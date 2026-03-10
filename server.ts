import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getSupabaseClient } from './src/storage/database/supabase-client';
import type { NewInquiry } from './src/storage/database/shared/schema';
import { 
  sendSubscriptionConfirmation, 
  sendUnsubscribeConfirmation,
  sendNewsletterToSubscribers
} from './src/lib/email';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.API_PORT || 3001;

// Socket.io 配置
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5000', 'http://localhost:3000', process.env.SITE_URL].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/'
});

app.use(cors());
app.use(express.json());

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.openai.com';

// ==================== 类型定义 ====================
interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: 'waiting' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'visitor' | 'admin';
  sender_name: string;
  message: string;
  created_at: string;
}

// ==================== Socket.io 连接管理 ====================
const connectedAdmins = new Set<string>();
const connectedVisitors = new Map<string, string>(); // visitorId -> socketId

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // 管理员连接
  socket.on('admin:join', (adminId: string) => {
    connectedAdmins.add(socket.id);
    socket.join('admin-room');
    console.log('Admin joined:', adminId);
    
    // 发送等待中的会话列表
    broadcastWaitingSessions();
  });

  // 访客连接
  socket.on('visitor:join', async (data: { visitorId: string; name?: string; email?: string }) => {
    const { visitorId, name, email } = data;
    
    // 检查是否有现有会话
    const client = getSupabaseClient();
    let session: ChatSession | null = null;
    
    const { data: existingSession } = await client
      .from('chat_sessions')
      .select('*')
      .eq('visitor_id', visitorId)
      .in('status', ['waiting', 'active'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingSession) {
      session = existingSession as ChatSession;
    } else {
      // 创建新会话
      const { data: newSession, error } = await client
        .from('chat_sessions')
        .insert({
          visitor_id: visitorId,
          visitor_name: name || null,
          visitor_email: email || null,
          status: 'waiting'
        })
        .select()
        .single();

      if (!error && newSession) {
        session = newSession as ChatSession;
      }
    }

    if (session) {
      socket.join(`session:${session.id}`);
      connectedVisitors.set(visitorId, socket.id);
      socket.data.visitorId = visitorId;
      socket.data.sessionId = session.id;

      // 发送会话信息给访客
      socket.emit('session:created', session);

      // 通知管理员有新的等待会话
      if (session.status === 'waiting') {
        io.to('admin-room').emit('session:waiting', session);
        
        // 发送飞书通知
        sendFeishuNewChatNotification(session, name);
      }

      // 发送历史消息
      const { data: messages } = await client
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      socket.emit('messages:history', messages || []);
    }
  });

  // 访客发送消息
  socket.on('visitor:message', async (data: { sessionId: string; message: string }) => {
    const { sessionId, message } = data;
    const client = getSupabaseClient();

    // 保存消息
    const { data: savedMessage, error } = await client
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: 'visitor',
        sender_name: 'Visitor',
        message: message
      })
      .select()
      .single();

    if (!error && savedMessage) {
      // 发送给访客确认
      socket.emit('message:received', savedMessage);
      
      // 发送给管理员
      io.to('admin-room').emit('message:new', savedMessage);
      
      // 更新会话时间
      await client
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }
  });

  // 管理员发送消息
  socket.on('admin:message', async (data: { sessionId: string; message: string; adminName: string }) => {
    const { sessionId, message, adminName } = data;
    const client = getSupabaseClient();

    // 保存消息
    const { data: savedMessage, error } = await client
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: 'admin',
        sender_name: adminName || 'Support',
        message: message
      })
      .select()
      .single();

    if (!error && savedMessage) {
      // 发送给管理员确认
      socket.emit('message:received', savedMessage);
      
      // 发送给访客
      io.to(`session:${sessionId}`).emit('message:new', savedMessage);
      
      // 更新会话时间
      await client
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }
  });

  // 管理员接管会话
  socket.on('admin:takeover', async (data: { sessionId: string; adminId: string }) => {
    const { sessionId, adminId } = data;
    const client = getSupabaseClient();

    const { error } = await client
      .from('chat_sessions')
      .update({ status: 'active' })
      .eq('id', sessionId);

    if (!error) {
      // 通知访客
      io.to(`session:${sessionId}`).emit('session:active', { adminId });
      
      // 通知其他管理员
      socket.to('admin-room').emit('session:taken', { sessionId, adminId });
      
      // 更新等待列表
      broadcastWaitingSessions();
    }
  });

  // 关闭会话
  socket.on('session:close', async (sessionId: string) => {
    const client = getSupabaseClient();
    
    await client
      .from('chat_sessions')
      .update({ status: 'closed' })
      .eq('id', sessionId);

    io.to(`session:${sessionId}`).emit('session:closed');
    broadcastWaitingSessions();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedAdmins.delete(socket.id);
    
    if (socket.data.visitorId) {
      connectedVisitors.delete(socket.data.visitorId);
    }
  });
});

// 广播等待中的会话
async function broadcastWaitingSessions() {
  const client = getSupabaseClient();
  
  const { data: sessions } = await client
    .from('chat_sessions')
    .select('*')
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  io.to('admin-room').emit('sessions:waiting', sessions || []);
}

// 发送飞书新聊天通知
async function sendFeishuNewChatNotification(session: ChatSession, visitorName?: string) {
  if (!FEISHU_WEBHOOK_URL) return;

  try {
    await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          header: {
            title: { tag: 'plain_text', content: '💬 New Chat Request' },
            template: 'blue'
          },
          elements: [
            {
              tag: 'div',
              fields: [
                { is_short: true, text: { tag: 'lark_md', content: `**Session ID:**\n${session.id.substring(0, 8)}` } },
                { is_short: true, text: { tag: 'lark_md', content: `**Visitor:**\n${visitorName || 'Anonymous'}` } }
              ]
            },
            {
              tag: 'div',
              text: { tag: 'lark_md', content: `**Time:** ${new Date().toLocaleString()}` }
            },
            {
              tag: 'action',
              actions: [
                {
                  tag: 'button',
                  text: { tag: 'plain_text', content: 'Open Admin Panel' },
                  type: 'primary',
                  url: `${process.env.SITE_URL || 'http://localhost:5000'}/admin/chat`
                }
              ]
            }
          ]
        }
      })
    });
  } catch (err) {
    console.error('Failed to send Feishu notification:', err);
  }
}

// ==================== 原有 API 路由 ====================

// 发送飞书通知（询盘）
async function sendFeishuNotification(inquiry: {
  name: string;
  company: string;
  email: string;
  productCategory: string | null;
  portOfDestination: string;
  estimatedQuantity: string | null;
  message: string | null;
}) {
  if (!FEISHU_WEBHOOK_URL) {
    console.log('Feishu webhook URL not configured, skipping notification');
    return;
  }

  const card = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: '🔔 新询盘通知'
        },
        template: 'blue'
      },
      elements: [
        {
          tag: 'div',
          fields: [
            { is_short: true, text: { tag: 'lark_md', content: `**联系人**\n${inquiry.name}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**公司**\n${inquiry.company}` } }
          ]
        },
        {
          tag: 'div',
          fields: [
            { is_short: true, text: { tag: 'lark_md', content: `**邮箱**\n${inquiry.email}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**产品类型**\n${inquiry.productCategory || '未指定'}` } }
          ]
        },
        {
          tag: 'div',
          fields: [
            { is_short: true, text: { tag: 'lark_md', content: `**目的港**\n${inquiry.portOfDestination}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**预估数量**\n${inquiry.estimatedQuantity || '未指定'}` } }
          ]
        },
        {
          tag: 'div',
          text: { tag: 'lark_md', content: `**备注信息**\n${inquiry.message || '无'}` }
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: { tag: 'plain_text', content: '查看详情' },
              type: 'primary',
              url: `${process.env.SITE_URL || 'http://localhost:5000'}/admin/inquiries`
            }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });
    
    if (!response.ok) {
      console.error('Failed to send Feishu notification:', await response.text());
    } else {
      console.log('Feishu notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending Feishu notification:', error);
  }
}

// 提交询盘 API
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { name, company, email, productCategory, portOfDestination, estimatedQuantity, message } = req.body;

    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'company', 'email', 'portOfDestination']
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('inquiries')
      .insert({
        name,
        company,
        email,
        product_category: productCategory,
        port_of_destination: portOfDestination,
        estimated_quantity: estimatedQuantity,
        message,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

    sendFeishuNotification({
      name,
      company,
      email,
      productCategory: productCategory || null,
      portOfDestination,
      estimatedQuantity: estimatedQuantity || null,
      message: message || null
    }).catch(err => console.error('Feishu notification error:', err));

    res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully',
      data 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取询盘列表
app.get('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 更新询盘状态
app.patch('/api/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const client = getSupabaseClient();
    
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await client
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update inquiry' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 删除询盘
app.delete('/api/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    
    const { error } = await client
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete inquiry' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Newsletter 订阅
app.post('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const client = getSupabaseClient();
    
    const { data: existing } = await client
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    let isNewSubscription = false;

    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed!' 
        });
      } else {
        const { error } = await client
          .from('subscribers')
          .update({ status: 'active', unsubscribed_at: null })
          .eq('id', existing.id);

        if (error) {
          return res.status(500).json({ error: 'Failed to resubscribe' });
        }
      }
    } else {
      const { error } = await client
        .from('subscribers')
        .insert({ email, status: 'active' });

      if (error) {
        return res.status(500).json({ error: 'Failed to subscribe' });
      }
      
      isNewSubscription = true;
    }

    sendSubscriptionConfirmation(email).catch(err => 
      console.error('Failed to send confirmation email:', err)
    );

    res.status(isNewSubscription ? 201 : 200).json({ 
      success: true, 
      message: isNewSubscription 
        ? 'Thank you for subscribing!' 
        : 'Welcome back!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 取消订阅
app.post('/api/subscribers/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const client = getSupabaseClient();
    
    const { error } = await client
      .from('subscribers')
      .update({ 
        status: 'unsubscribed', 
        unsubscribed_at: new Date().toISOString() 
      })
      .eq('email', email);

    if (error) {
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }

    sendUnsubscribeConfirmation(email).catch(err => 
      console.error('Failed to send unsubscribe confirmation:', err)
    );

    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取订阅者列表
app.get('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 删除订阅者
app.delete('/api/subscribers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    
    const { error } = await client
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete subscriber' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 发送 Newsletter
app.post('/api/newsletter/send', async (req: Request, res: Response) => {
  try {
    const { subject, articles, previewText } = req.body;

    if (!subject || !articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Subject and articles are required' });
    }

    const client = getSupabaseClient();
    
    const { data: subscribers, error } = await client
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(400).json({ error: 'No active subscribers' });
    }

    const emails = subscribers.map(s => s.email);
    const result = await sendNewsletterToSubscribers(emails, subject, articles, previewText);

    res.json({ 
      success: result.success, 
      sentCount: result.sentCount,
      totalSubscribers: emails.length,
      errors: result.errors 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== AI 聊天 API ====================

const WEBSITE_KNOWLEDGE = `
You are an AI customer service assistant for Zhongrun Special Oil (Chinese Special Oil Supply Platform). 

About the Company:
- We are a leading Chinese supplier of specialty lubricants and oils
- Products include: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants
- Services: Quality assurance, global logistics, custom solutions

Key Products:
1. Transformer Oil: High-grade insulating oil for electrical transformers
2. Rubber Process Oil: Various types for rubber manufacturing
3. White Oil: Food-grade and pharmaceutical-grade white oils
4. Finished Lubricants: Automotive, industrial, and marine lubricants

Contact Information:
- Email: steven.shunyu@gmail.com
- Phone: +8613793280176

When to Transfer to Human Agent:
If the user asks about: pricing, quotes, custom orders, complaints, partnership, or requests human agent - tell them you will connect them to a human agent.
`;

function needsHumanAgent(message: string): boolean {
  const keywords = [
    'price', 'pricing', 'quote', 'quotation', 'cost',
    'discount', 'negotiate', 'complaint', 'complain',
    'human', 'agent', 'person', 'speak to', 'talk to',
    'manager', 'supervisor', 'urgent', 'emergency',
    'custom order', 'special order', 'partnership',
    'bulk order', 'wholesale', 'distributor'
  ];
  
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 检查是否需要人工客服
    if (needsHumanAgent(message)) {
      return res.json({
        response: "I'll connect you with a human agent. Please wait...",
        needsHuman: true
      });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const response = await fetch(`https://${OPENAI_API_HOST}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: WEBSITE_KNOWLEDGE },
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role,
            content: h.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== 聊天会话 API ====================

// 获取所有会话
app.get('/api/chat/sessions', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取会话消息
app.get('/api/chat/sessions/:sessionId/messages', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket enabled at /socket.io/`);
});
