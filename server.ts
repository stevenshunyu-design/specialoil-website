import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getSupabaseClient } from './src/storage/database/supabase-client';
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

// ==================== 环境变量配置 ====================
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.openai.com';

// ==================== 飞书机器人配置 ====================
let feishuAccessToken: string | null = null;
let tokenExpireTime = 0;

// 飞书消息 ID 与会话 ID 的映射
const messageSessionMap = new Map<string, string>();

// 获取飞书 access_token
async function getFeishuAccessToken(): Promise<string | null> {
  // 检查缓存是否有效
  if (feishuAccessToken && Date.now() < tokenExpireTime) {
    return feishuAccessToken;
  }

  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    console.log('Feishu app credentials not configured');
    return null;
  }

  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET
      })
    });

    const data = await response.json();
    
    if (data.code === 0) {
      feishuAccessToken = data.tenant_access_token;
      tokenExpireTime = Date.now() + (data.expire - 300) * 1000; // 提前5分钟过期
      return feishuAccessToken;
    } else {
      console.error('Failed to get Feishu token:', data);
      return null;
    }
  } catch (error) {
    console.error('Error getting Feishu token:', error);
    return null;
  }
}

// 发送飞书消息（私聊）
async function sendFeishuPrivateMessage(openId: string, message: string, sessionId: string): Promise<boolean> {
  const token = await getFeishuAccessToken();
  if (!token) return false;

  try {
    const response = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receive_id: openId,
        msg_type: 'text',
        content: JSON.stringify({ text: message })
      })
    });

    const data = await response.json();
    
    if (data.code === 0) {
      // 保存消息 ID 与会话 ID 的映射
      const messageId = data.data?.message_id;
      if (messageId) {
        messageSessionMap.set(messageId, sessionId);
      }
      return true;
    } else {
      console.error('Failed to send Feishu message:', data);
      return false;
    }
  } catch (error) {
    console.error('Error sending Feishu message:', error);
    return false;
  }
}

// 发送飞书卡片消息
async function sendFeishuCardMessage(openId: string, sessionId: string, visitorName: string, message: string): Promise<boolean> {
  const token = await getFeishuAccessToken();
  if (!token) return false;

  try {
    const response = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receive_id: openId,
        msg_type: 'interactive',
        content: JSON.stringify({
          type: 'chat_card',
          elements: [
            {
              tag: 'div',
              text: {
                tag: 'lark_md',
                content: `**👤 ${visitorName}**\n\n${message}`
              }
            },
            {
              tag: 'action',
              actions: [
                {
                  tag: 'input',
                  placeholder: { tag: 'plain_text', content: 'Type your reply...' },
                  name: `reply_${sessionId}`
                }
              ]
            }
          ]
        })
      })
    });

    const data = await response.json();
    return data.code === 0;
  } catch (error) {
    console.error('Error sending Feishu card:', error);
    return false;
  }
}

// 发送飞书群消息（使用 Webhook）
async function sendFeishuGroupMessage(sessionId: string, visitorName: string, visitorEmail: string | null, message: string): Promise<boolean> {
  if (!FEISHU_WEBHOOK_URL) {
    console.log('Feishu webhook not configured');
    return false;
  }

  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          header: {
            title: { tag: 'plain_text', content: `💬 Chat: ${visitorName || 'Visitor'}` },
            template: 'blue'
          },
          elements: [
            {
              tag: 'div',
              fields: [
                { is_short: true, text: { tag: 'lark_md', content: `**Session:**\n${sessionId.substring(0, 8)}` } },
                { is_short: true, text: { tag: 'lark_md', content: `**Email:**\n${visitorEmail || 'N/A'}` } }
              ]
            },
            {
              tag: 'div',
              text: { tag: 'lark_md', content: `**Message:**\n${message}` }
            },
            {
              tag: 'note',
              elements: [
                { tag: 'plain_text', content: `Reply format: /reply ${sessionId.substring(0, 8)} your message` }
              ]
            }
          ]
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending Feishu group message:', error);
    return false;
  }
}

// ==================== 类型定义 ====================
interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: 'waiting' | 'active' | 'closed';
  feishu_message_id?: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== Socket.io 连接管理 ====================
const connectedVisitors = new Map<string, string>(); // visitorId -> socketId
const sessionSocketMap = new Map<string, string>(); // sessionId -> socketId

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // 访客连接
  socket.on('visitor:join', async (data: { visitorId: string; name?: string; email?: string }) => {
    const { visitorId, name, email } = data;
    const client = getSupabaseClient();
    let session: ChatSession | null = null;
    
    // 检查现有会话
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
      sessionSocketMap.set(session.id, socket.id);
      socket.data.visitorId = visitorId;
      socket.data.sessionId = session.id;

      socket.emit('session:created', session);

      // 发送历史消息
      const { data: messages } = await client
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      socket.emit('messages:history', messages || []);

      // 如果是等待状态，通知管理员（飞书）
      if (session.status === 'waiting') {
        // 更新为活跃状态（表示已连接）
        await client
          .from('chat_sessions')
          .update({ status: 'active' })
          .eq('id', session.id);
        
        socket.emit('session:active', { message: 'Connected to support' });
      }
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
      socket.emit('message:received', savedMessage);
      
      // 获取会话信息
      const { data: session } = await client
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (session) {
        // 发送到飞书
        const visitorName = session.visitor_name || 'Visitor';
        const visitorEmail = session.visitor_email;
        
        await sendFeishuGroupMessage(
          sessionId, 
          visitorName, 
          visitorEmail,
          message
        );
      }

      // 更新会话时间
      await client
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }
  });

  // 关闭会话
  socket.on('session:close', async (sessionId: string) => {
    const client = getSupabaseClient();
    
    await client
      .from('chat_sessions')
      .update({ status: 'closed' })
      .eq('id', sessionId);

    socket.emit('session:closed');
    sessionSocketMap.delete(sessionId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (socket.data.visitorId) {
      connectedVisitors.delete(socket.data.visitorId);
    }
    if (socket.data.sessionId) {
      sessionSocketMap.delete(socket.data.sessionId);
    }
  });
});

// ==================== 飞书 Webhook 接收消息 ====================

// 飞书事件推送端点
app.post('/feishu/webhook', async (req: Request, res: Response) => {
  const { type, challenge, event, header } = req.body;

  // URL 验证
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // 处理消息事件
  if (event?.message) {
    const message = event.message;
    const content = JSON.parse(message.content || '{}');
    const senderId = event.sender?.sender_id?.open_id;
    
    // 忽略机器人自己发送的消息
    if (event.sender?.sender_id?.user_id === FEISHU_APP_ID) {
      return res.json({ code: 0 });
    }

    const messageText = content.text || '';

    // 检查是否是回复格式: /reply <session_id> <message>
    const replyMatch = messageText.match(/^\/reply\s+(\w+)\s+(.+)/i);
    
    if (replyMatch) {
      const sessionShortId = replyMatch[1];
      const replyMessage = replyMatch[2];

      const client = getSupabaseClient();
      
      // 查找对应会话
      const { data: sessions } = await client
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active');

      const targetSession = sessions?.find((s: ChatSession) => 
        s.id.startsWith(sessionShortId)
      );

      if (targetSession) {
        // 保存消息
        await client
          .from('chat_messages')
          .insert({
            session_id: targetSession.id,
            sender_type: 'admin',
            sender_name: 'Support',
            message: replyMessage
          });

        // 发送给访客
        const socketId = sessionSocketMap.get(targetSession.id);
        if (socketId) {
          io.to(`session:${targetSession.id}`).emit('message:new', {
            id: Date.now().toString(),
            session_id: targetSession.id,
            sender_type: 'admin',
            sender_name: 'Support',
            message: replyMessage,
            created_at: new Date().toISOString()
          });
        }

        // 确认已发送
        await sendFeishuPrivateMessage(senderId, `✅ Message sent to visitor: ${replyMessage}`, targetSession.id);
      } else {
        await sendFeishuPrivateMessage(senderId, `❌ Session not found: ${sessionShortId}`, '');
      }
    } else {
      // 普通消息，记录或处理
      console.log('Received Feishu message:', messageText);
    }
  }

  res.json({ code: 0 });
});

// 飞书卡片回调（处理按钮点击等）
app.post('/feishu/card', async (req: Request, res: Response) => {
  const { action, open_id } = req.body;
  
  // 处理卡片回调
  console.log('Feishu card callback:', req.body);
  
  res.json({ code: 0 });
});

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
  if (!FEISHU_WEBHOOK_URL) return;

  try {
    await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          header: {
            title: { tag: 'plain_text', content: '🔔 新询盘通知' },
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
                { is_short: true, text: { tag: 'lark_md', content: `**产品**\n${inquiry.productCategory || '未指定'}` } }
              ]
            },
            {
              tag: 'div',
              text: { tag: 'lark_md', content: `**备注**\n${inquiry.message || '无'}` }
            }
          ]
        }
      })
    });
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
        name, company, email,
        product_category: productCategory,
        port_of_destination: portOfDestination,
        estimated_quantity: estimatedQuantity,
        message,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

    sendFeishuNotification({
      name, company, email,
      productCategory: productCategory || null,
      portOfDestination,
      estimatedQuantity: estimatedQuantity || null,
      message: message || null
    }).catch(err => console.error('Feishu notification error:', err));

    res.status(201).json({ success: true, data });
  } catch (error) {
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

    if (error) return res.status(500).json({ error: 'Failed to fetch inquiries' });
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

    if (error) return res.status(500).json({ error: 'Failed to update inquiry' });
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
    const { error } = await client.from('inquiries').delete().eq('id', id);

    if (error) return res.status(500).json({ error: 'Failed to delete inquiry' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Newsletter 订阅
app.post('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' });

    const client = getSupabaseClient();
    const { data: existing } = await client
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    let isNewSubscription = false;

    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({ success: true, message: 'Already subscribed!' });
      }
      await client.from('subscribers').update({ status: 'active' }).eq('id', existing.id);
    } else {
      const { error } = await client.from('subscribers').insert({ email, status: 'active' });
      if (error) return res.status(500).json({ error: 'Failed to subscribe' });
      isNewSubscription = true;
    }

    sendSubscriptionConfirmation(email).catch(err => console.error('Email error:', err));

    res.status(isNewSubscription ? 201 : 200).json({ 
      success: true, 
      message: isNewSubscription ? 'Thank you for subscribing!' : 'Welcome back!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 取消订阅
app.post('/api/subscribers/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const client = getSupabaseClient();
    await client
      .from('subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email);

    sendUnsubscribeConfirmation(email).catch(err => console.error('Email error:', err));
    res.json({ success: true, message: 'Unsubscribed.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取订阅者
app.get('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch' });
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
    await client.from('subscribers').delete().eq('id', id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 发送 Newsletter
app.post('/api/newsletter/send', async (req: Request, res: Response) => {
  try {
    const { subject, articles, previewText } = req.body;
    if (!subject || !articles) return res.status(400).json({ error: 'Subject and articles required' });

    const client = getSupabaseClient();
    const { data: subscribers } = await client
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    if (!subscribers?.length) return res.status(400).json({ error: 'No subscribers' });

    const emails = subscribers.map(s => s.email);
    const result = await sendNewsletterToSubscribers(emails, subject, articles, previewText);

    res.json({ success: result.success, sentCount: result.sentCount, errors: result.errors });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== AI 聊天 API ====================

const WEBSITE_KNOWLEDGE = `
You are an AI assistant for Zhongrun Special Oil. Products: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants.
Contact: steven.shunyu@gmail.com, +8613793280176
Transfer to human agent if user asks about: pricing, quotes, custom orders, complaints, partnership.
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
  return keywords.some(k => message.toLowerCase().includes(k));
}

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    if (needsHumanAgent(message)) {
      return res.json({
        response: "I'll connect you with a human agent. Please wait...",
        needsHuman: true
      });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI not configured' });
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
          { role: 'user', content: message }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    res.json({ response: data.choices?.[0]?.message?.content || 'Sorry, error occurred.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== 聊天会话 API ====================

app.get('/api/chat/sessions', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/sessions/:sessionId/messages', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: 'Failed to fetch' });
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
  console.log(`WebSocket: /socket.io/`);
  console.log(`Feishu webhook: /feishu/webhook`);
});
