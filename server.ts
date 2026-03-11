import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getSupabaseClient } from './src/storage/database/supabase-client';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 全局错误处理 - 防止进程崩溃
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ESM 环境中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'dist') 
  : path.join(process.cwd(), 'dist');

console.log('========================================');
console.log('Starting server with security features...');
console.log('PORT:', process.env.PORT || 3001);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('Static files path:', distPath);
console.log('dist directory exists:', fs.existsSync(distPath));
console.log('========================================');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

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

// 静态文件服务 - 生产环境提供前端构建产物
app.use(express.static(distPath, { 
  index: false, // 禁止自动返回 index.html，让 SPA 路由处理
  maxAge: '1d' // 静态资源缓存
}));

// ==================== 环境变量配置 ====================
const FEISHU_WEBHOOK_URL = process.env.FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || process.env.FEISHU_CHAT_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || process.env.FEISHU_CHAT_APP_SECRET;
const FEISHU_CHAT_ID = process.env.FEISHU_CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.openai.com';

console.log('========================================');
console.log('Server Configuration:');
console.log('FEISHU_APP_ID:', FEISHU_APP_ID || 'NOT SET');
console.log('FEISHU_APP_SECRET:', FEISHU_APP_SECRET ? 'SET' : 'NOT SET');
console.log('FEISHU_CHAT_ID:', FEISHU_CHAT_ID || 'NOT SET');
console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? 'SET' : 'NOT SET');
console.log('========================================');

// ==================== 飞书 Token 管理 ====================
let feishuAccessToken: string | null = null;
let tokenExpireTime = 0;

async function getFeishuAccessToken(): Promise<string | null> {
  if (feishuAccessToken && Date.now() < tokenExpireTime) {
    return feishuAccessToken;
  }

  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
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
      tokenExpireTime = Date.now() + (data.expire - 300) * 1000;
      console.log('✅ Feishu access token obtained');
      return feishuAccessToken;
    }
    return null;
  } catch (error) {
    console.error('Error getting Feishu token:', error);
    return null;
  }
}

// 发送飞书私聊消息
async function sendFeishuMessage(openId: string, message: string): Promise<boolean> {
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
    return data.code === 0;
  } catch (error) {
    console.error('Error sending Feishu message:', error);
    return false;
  }
}

// 发送飞书群消息（使用 Webhook）
async function sendFeishuGroupMessage(sessionId: string, visitorName: string, visitorEmail: string | null, message: string): Promise<boolean> {
  if (!FEISHU_WEBHOOK_URL) {
    console.log('Feishu webhook not configured');
    return false;
  }

  const shortId = sessionId.substring(0, 8);

  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msg_type: 'interactive',
        card: {
          header: {
            title: { tag: 'plain_text', content: `💬 来自访客: ${visitorName || '匿名'}` },
            template: 'blue'
          },
          elements: [
            {
              tag: 'div',
              fields: [
                { is_short: true, text: { tag: 'lark_md', content: `**会话ID:**\n${shortId}` } },
                { is_short: true, text: { tag: 'lark_md', content: `**邮箱:**\n${visitorEmail || '未提供'}` } }
              ]
            },
            {
              tag: 'div',
              text: { tag: 'lark_md', content: `**消息内容:**\n${message}` }
            },
            {
              tag: 'note',
              elements: [
                { tag: 'plain_text', content: `回复格式: /reply ${shortId} 您的回复内容` }
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

// 发送飞书群消息（使用 API，支持话题回复）
async function sendFeishuChatMessage(
  sessionId: string, 
  customerNo: string,
  customerName: string, 
  customerEmail: string, 
  customerPhone: string,
  message: string,
  rootMessageId?: string
): Promise<{ success: boolean; messageId?: string }> {
  const token = await getFeishuAccessToken();
  
  // 如果没有配置 API，回退到 Webhook
  if (!token || !FEISHU_CHAT_ID) {
    console.log('Feishu API not configured, falling back to webhook');
    const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
    return { success: webhookSuccess };
  }

  const shortId = sessionId.substring(0, 8);
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // 构建消息卡片
  const card = {
    config: { wide_screen_mode: true },
    header: { 
      title: { tag: 'plain_text', content: rootMessageId ? `💬 ${customerNo}` : `🔔 新客户咨询 ${customerNo}` }, 
      template: 'blue' 
    },
    elements: [
      { 
        tag: 'div', 
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**客户姓名**\n${customerName}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**时间**\n${timestamp}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**邮箱**\n${customerEmail || '未提供'}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**电话**\n${customerPhone || '未提供'}` } }
        ]
      },
      { tag: 'hr' },
      { tag: 'div', text: { tag: 'lark_md', content: `**消息内容**\n${message}` } },
      { tag: 'hr' },
      { tag: 'note', text: { tag: 'lark_md', content: rootMessageId ? `💬 直接在话题下回复客户` : `💬 直接在话题下回复客户` } }
    ]
  };

  try {
    // 构建请求体
    const requestBody: any = {
      receive_id: FEISHU_CHAT_ID,
      msg_type: 'interactive',
      content: JSON.stringify(card)
    };

    // 如果有 rootMessageId，则作为话题回复
    if (rootMessageId) {
      requestBody.root_id = rootMessageId;
    }

    const response = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (data.code === 0 && data.data?.message_id) {
      console.log(`✅ Feishu message sent: ${data.data.message_id}`);
      return { success: true, messageId: data.data.message_id };
    } else {
      console.error('Feishu API error:', data);
      // 回退到 Webhook
      const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
      return { success: webhookSuccess };
    }
  } catch (error) {
    console.error('Error sending Feishu API message:', error);
    // 回退到 Webhook
    const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
    return { success: webhookSuccess };
  }
}

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

// ==================== Socket.io 连接管理 ====================
const connectedVisitors = new Map<string, string>();
const sessionSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('visitor:join', async (data: { visitorId: string; name?: string; email?: string }) => {
    const { visitorId, name, email } = data;
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
      const { data: newSession, error } = await client
        .from('chat_sessions')
        .insert({
          visitor_id: visitorId,
          visitor_name: name || null,
          visitor_email: email || null,
          status: 'waiting'  // 新会话设为等待状态
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

      const { data: messages } = await client
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      socket.emit('messages:history', messages || []);
      socket.emit('session:active', { message: 'Connected to support' });
    }
  });

  socket.on('visitor:message', async (data: { sessionId: string; message: string }) => {
    const { sessionId, message } = data;
    const client = getSupabaseClient();

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
      
      const { data: session } = await client
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (session) {
        const visitorName = session.visitor_name || 'Visitor';
        const visitorEmail = session.visitor_email || 'Not provided';
        const visitorPhone = session.visitor_phone || 'Not provided';
        const customerNo = session.customer_no || `#${sessionId.substring(0, 8)}`;
        const rootMessageId = session.feishu_root_message_id;
        
        console.log(`Sending message to Feishu for session ${sessionId}`);
        
        // 使用 API 发送消息（支持话题回复）
        const result = await sendFeishuChatMessage(
          sessionId,
          customerNo,
          visitorName,
          visitorEmail,
          visitorPhone,
          message,
          rootMessageId // 如果有 root_message_id，则作为话题回复
        );
        
        // 如果是第一条消息且成功获取了 message_id，保存到数据库
        if (result.success && result.messageId && !rootMessageId) {
          await client
            .from('chat_sessions')
            .update({ feishu_root_message_id: result.messageId })
            .eq('id', sessionId);
          console.log(`✅ Saved root message ID: ${result.messageId}`);
        }
      }

      await client
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }
  });

  socket.on('session:close', async (sessionId: string) => {
    const client = getSupabaseClient();
    await client.from('chat_sessions').update({ status: 'closed' }).eq('id', sessionId);
    socket.emit('session:closed');
    sessionSocketMap.delete(sessionId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (socket.data.visitorId) connectedVisitors.delete(socket.data.visitorId);
    if (socket.data.sessionId) sessionSocketMap.delete(socket.data.sessionId);
  });
});

// ==================== 飞书 Webhook 端点 ====================

app.post('/feishu/webhook', async (req: Request, res: Response) => {
  console.log('=== Received Feishu webhook ===');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const { type, challenge, event } = req.body;

  // URL 验证 - 必须返回 JSON 格式
  if (type === 'url_verification') {
    console.log('URL verification, challenge:', challenge);
    return res.status(200).json({ challenge });
  }

  // 处理消息事件
  if (event?.message) {
    const message = event.message;
    const senderId = event.sender?.sender_id?.open_id;
    const rootId = message.root_id; // 话题根消息ID
    const parentId = message.parent_id; // 父消息ID
    
    // 解析消息内容
    let messageText = '';
    try {
      const content = JSON.parse(message.content || '{}');
      messageText = content.text || '';
    } catch {
      messageText = message.content || '';
    }
    
    console.log(`Feishu message from ${senderId}: ${messageText}, root_id: ${rootId}, parent_id: ${parentId}`);
    
    const client = getSupabaseClient();
    
    // 方式1：通过 root_id 查找会话（话题回复）
    if (rootId) {
      console.log(`Looking for session with feishu_root_message_id: ${rootId}`);
      const { data: sessionByRootId } = await client
        .from('chat_sessions')
        .select('*')
        .eq('feishu_root_message_id', rootId)
        .eq('status', 'active')
        .single();

      if (sessionByRootId) {
        console.log(`Found session ${sessionByRootId.id} by root_id`);
        
        // 保存消息
        await client.from('chat_messages').insert({
          session_id: sessionByRootId.id,
          sender_type: 'admin',
          sender_name: 'Support',
          message: messageText
        });

        // 发送给访客
        io.to(`session:${sessionByRootId.id}`).emit('message:new', {
          id: Date.now().toString(),
          session_id: sessionByRootId.id,
          sender_type: 'admin',
          sender_name: 'Support',
          message: messageText,
          created_at: new Date().toISOString()
        });

        console.log(`✅ Topic reply sent to visitor: ${messageText}`);
        return res.status(200).json({ code: 0, msg: 'success' });
      }
    }
    
    // 方式2：命令格式 /reply <session_id> <message>（兼容旧方式）
    const replyMatch = messageText.match(/^\/reply\s+(\w+)\s+(.+)/is);
    
    if (replyMatch) {
      const sessionShortId = replyMatch[1];
      const replyMessage = replyMatch[2];

      // 查找对应会话
      const { data: sessions } = await client
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active');

      const targetSession = sessions?.find((s: ChatSession) => 
        s.id.startsWith(sessionShortId)
      );

      if (targetSession) {
        console.log(`Found session ${targetSession.id} for reply`);
        
        // 保存消息
        await client.from('chat_messages').insert({
          session_id: targetSession.id,
          sender_type: 'admin',
          sender_name: 'Support',
          message: replyMessage
        });

        // 发送给访客
        io.to(`session:${targetSession.id}`).emit('message:new', {
          id: Date.now().toString(),
          session_id: targetSession.id,
          sender_type: 'admin',
          sender_name: 'Support',
          message: replyMessage,
          created_at: new Date().toISOString()
        });

        console.log(`✅ Reply sent to visitor: ${replyMessage}`);
        
        // 确认发送成功
        if (senderId) {
          await sendFeishuMessage(senderId, `✅ 消息已发送给访客`);
        }
      } else {
        console.log(`Session not found: ${sessionShortId}`);
        if (senderId) {
          await sendFeishuMessage(senderId, `❌ 未找到会话: ${sessionShortId}`);
        }
      }
    }
  }

  res.status(200).json({ code: 0, msg: 'success' });
});

// GET 请求处理（用于测试）
app.get('/feishu/webhook', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Feishu webhook endpoint is working' });
});

// ==================== API 路由 ====================

const WEBSITE_KNOWLEDGE = `
You are an AI assistant for Zhongrun Special Oil (Chinese Special Oil Supply Platform).

**IMPORTANT: You MUST respond in English only. Never respond in Chinese or any other language.**

About the Company:
- Leading Chinese supplier of specialty lubricants and oils
- Products: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants
- Services: Quality assurance, global logistics, custom solutions

Contact Information:
- Email: steven.shunyu@gmail.com
- Phone: +8613793280176
- Website: https://cnspecialtyoils.com

When to Transfer to Human Agent:
If user asks about: pricing, quotes, custom orders, complaints, partnership, bulk orders, or requests human help - respond: "I'll connect you with a human agent. Please wait..."
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

// 获取会话消息 API - 用于前端轮询获取客服回复
app.get('/api/chat/messages', async (req: Request, res: Response) => {
  try {
    const { sessionId, after } = req.query;
    
    console.log(`📨 Polling messages for session: ${sessionId}`);
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const client = getSupabaseClient();
    if (!client) {
      console.log('⚠️ Database not configured');
      return res.json({ messages: [] });
    }

    // 先尝试精确匹配，再尝试前缀匹配
    let targetSession = null;
    
    // 精确匹配
    const { data: exactSession } = await client
      .from('chat_sessions')
      .select('id, status')
      .eq('id', sessionId as string)
      .single();
    
    if (exactSession) {
      targetSession = exactSession;
      console.log(`✅ Found exact session: ${targetSession.id}`);
    } else {
      // 前缀匹配
      const { data: sessions } = await client
        .from('chat_sessions')
        .select('id, status')
        .eq('status', 'active');

      targetSession = sessions?.find(s => s.id.startsWith(sessionId as string));
      
      if (targetSession) {
        console.log(`✅ Found session by prefix match: ${targetSession.id}`);
      } else {
        console.log(`⚠️ Session not found: ${sessionId}`);
        return res.json({ messages: [] });
      }
    }

    // Get messages after the specified ID
    let query = client
      .from('chat_messages')
      .select('*')
      .eq('session_id', targetSession.id)
      .order('created_at', { ascending: true });

    if (after) {
      const { data: afterMessage } = await client
        .from('chat_messages')
        .select('created_at')
        .eq('id', after)
        .single();
      
      if (afterMessage) {
        query = query.gt('created_at', afterMessage.created_at);
      }
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return res.json({ messages: [] });
    }

    console.log(`📬 Returning ${messages?.length || 0} messages`);
    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// 获取所有会话 API - 用于客服工作台（包括已关闭的历史会话）
app.get('/api/chat/sessions', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    // 获取所有会话，包括已关闭的，按更新时间倒序排列
    const { data: sessions, error } = await client
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: sessions || [] });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// 获取会话消息 API - 用于客服工作台
app.get('/api/chat/sessions/:sessionId/messages', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    const { data: messages, error } = await client
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: messages || [] });
  } catch (error) {
    console.error('Get session messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// 获取会话状态 API - 用于前端检测会话是否已关闭
app.get('/api/chat/sessions/:sessionId/status', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: false, error: 'Database not configured' });
    }

    const { data: session, error } = await client
      .from('chat_sessions')
      .select('status')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return res.json({ success: false, error: 'Session not found' });
    }

    res.json({ success: true, status: session.status });
  } catch (error) {
    console.error('Get session status error:', error);
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

// 管理员发送消息 API
app.post('/api/chat/admin/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, message, adminName } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { error: insertError } = await client
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: 'admin',
        sender_name: adminName || 'Support',
        message: message
      });

    if (insertError) {
      console.error('Error saving admin message:', insertError);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    // 如果会话是 waiting 状态，自动变为 active
    await client
      .from('chat_sessions')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .eq('status', 'waiting');  // 只更新 waiting 状态的会话

    await client
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Admin message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 关闭会话 API
app.post('/api/chat/sessions/:sessionId/close', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { error } = await client
      .from('chat_sessions')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      console.error('Error closing session:', error);
      return res.status(500).json({ error: 'Failed to close session' });
    }

    res.json({ success: true, message: 'Session closed' });
  } catch (error) {
    console.error('Close session error:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

// 人工客服消息 API - 用户发送消息（转人工后使用）
app.post('/api/chat/human', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, customerInfo } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // 保存消息到数据库
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 检查会话是否存在
    const { data: existingSession } = await client
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!existingSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // 保存用户消息
    await client.from('chat_messages').insert({
      session_id: sessionId,
      sender_type: 'visitor',
      sender_name: existingSession.visitor_name || 'Visitor',
      message: message
    });

    // 更新会话时间
    await client
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    // 发送飞书通知 - 提醒管理员有新消息
    if (FEISHU_WEBHOOK_URL) {
      const customerNo = existingSession.customer_no || `#${sessionId.substring(0, 8)}`;
      const visitorName = existingSession.visitor_name || 'Visitor';
      
      const notification = {
        msg_type: 'interactive',
        card: {
          header: { 
            title: { tag: 'plain_text', content: `💬 新消息 ${customerNo}` }, 
            template: 'blue' 
          },
          elements: [
            { 
              tag: 'div', 
              text: { 
                tag: 'lark_md', 
                content: `**${visitorName}**: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}` 
              } 
            },
            { tag: 'divider' },
            { 
              tag: 'action', 
              actions: [
                {
                  tag: 'button',
                  text: { tag: 'plain_text', content: '前往后台回复' },
                  url: `${process.env.SITE_URL || 'https://cnspecialtyoils.com'}/admin/chat`,
                  type: 'primary'
                }
              ]
            }
          ]
        }
      };

      try {
        await fetch(FEISHU_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
        console.log(`✅ Feishu notification sent for new message from ${customerNo}`);
      } catch (feishuError) {
        console.error('Failed to send Feishu notification:', feishuError);
      }
    }

    res.json({
      success: true,
      message: 'Message sent',
      session: existingSession
    });
  } catch (error) {
    console.error('Human chat error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, customerInfo } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    if (needsHumanAgent(message)) {
      // 创建会话 ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shortId = sessionId.substring(0, 8);
      const customerNo = customerInfo?.customerNo || `#${shortId}`;
      const customerName = customerInfo?.name || 'Unknown';
      const customerEmail = customerInfo?.email || 'Not provided';
      const customerPhone = customerInfo?.phone || 'Not provided';
      
      // 获取 Supabase 客户端
      const client = getSupabaseClient();
      
      // 保存会话到数据库
      if (client) {
        await client.from('chat_sessions').insert({
          id: sessionId,
          visitor_id: sessionId,
          visitor_name: customerName,
          visitor_email: customerEmail,
          visitor_phone: customerPhone,
          customer_no: customerNo,
          status: 'waiting'  // 新会话设为等待状态，管理员回复后变为 active
        });
        
        // 保存用户消息
        await client.from('chat_messages').insert({
          session_id: sessionId,
          sender_type: 'visitor',
          sender_name: customerName,
          message: message
        });
        console.log(`✅ Session saved: ${customerNo}`);
      }
      
      // 发送飞书通知 - 提醒管理员去后台查看
      if (FEISHU_WEBHOOK_URL) {
        const notification = {
          msg_type: 'interactive',
          card: {
            header: { 
              title: { tag: 'plain_text', content: `🔔 新客户咨询 ${customerNo}` }, 
              template: 'blue' 
            },
            elements: [
              { 
                tag: 'div', 
                text: { 
                  tag: 'lark_md', 
                  content: `**客户信息**\n👤 姓名: ${customerName}\n📧 邮箱: ${customerEmail}\n📱 电话: ${customerPhone}\n💬 消息: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}` 
                } 
              },
              { tag: 'divider' },
              { 
                tag: 'action', 
                actions: [
                  {
                    tag: 'button',
                    text: { tag: 'plain_text', content: '前往后台回复' },
                    url: `${process.env.SITE_URL || 'https://cnspecialtyoils.com'}/admin/chat`,
                    type: 'primary'
                  }
                ]
              },
              { 
                tag: 'note', 
                elements: [
                  { tag: 'plain_text', content: `请登录后台客服系统回复客户消息` }
                ] 
              }
            ]
          }
        };
        
        try {
          await fetch(FEISHU_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification)
          });
          console.log(`✅ Feishu notification sent: ${customerNo}`);
        } catch (error) {
          console.error('Feishu notification error:', error);
        }
      }

      return res.json({
        response: "I'll connect you with a human agent. Please wait...",
        needsHuman: true,
        sessionId: sessionId
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
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    feishu: FEISHU_APP_ID ? 'configured' : 'not configured',
    appId: FEISHU_APP_ID
  });
});

// SPA 路由回退 - 所有非 API 路由返回 index.html
app.get('*', (req: Request, res: Response) => {
  // 如果是 API 请求但路由不存在，返回 404
  if (req.path.startsWith('/api/') || req.path.startsWith('/feishu/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // 其他请求返回 index.html（SPA 路由）
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built. Please run build first.');
  }
});

// 启动服务器
// 监听 0.0.0.0 确保反向代理正确转发请求
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket: /socket.io/`);
  console.log(`Feishu webhook: POST /feishu/webhook`);
  console.log(`========================================`);
  console.log(`✅ Server ready to accept connections`);
  
  // 测试飞书连接
  if (FEISHU_APP_ID && FEISHU_APP_SECRET) {
    getFeishuAccessToken().then(token => {
      if (token) {
        console.log('✅ Feishu bot connected successfully');
      }
    });
  }
});
