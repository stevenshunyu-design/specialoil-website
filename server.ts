import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getSupabaseClient } from './src/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

// ==================== 代码版本标记 ====================
console.log('🚀 CODE VERSION: TEXT-MESSAGE-FORMAT-v1 (commit f5c0639)');
// ======================================================

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
// 人工客服通知 Webhook（用于聊天消息通知）
const FEISHU_CHAT_WEBHOOK = process.env.FEISHU_CHAT_WEBHOOK;
// 询盘通知 Webhook（用于客户询价通知）
const FEISHU_INQUIRY_WEBHOOK = process.env.FEISHU_INQUIRY_WEBHOOK;
// 兼容旧配置
const FEISHU_WEBHOOK_URL = FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;

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
console.log('FEISHU_CHAT_WEBHOOK (客服通知):', FEISHU_CHAT_WEBHOOK ? `SET` : 'NOT SET');
console.log('FEISHU_INQUIRY_WEBHOOK (询盘通知):', FEISHU_INQUIRY_WEBHOOK ? `SET` : 'NOT SET');
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
You are an AI assistant for CN-SpecLube Chain (Chinese Special Oil Supply Platform).

**IMPORTANT: You MUST respond in English only. Never respond in Chinese or any other language.**

About the Company:
- Leading Chinese supplier of specialty lubricants and oils
- Products: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants
- Services: Quality assurance, global logistics, custom solutions

Contact Information:
- Email: steven.shunyu@gmail.com
- Phone: +8613793280176
- Website: https://cnspecialtyoils.com

**IMPORTANT Website Promotion Rules:**
- When providing product information, ALWAYS include the website: https://cnspecialtyoils.com
- When users ask about products, services, or company info, mention they can visit https://cnspecialtyoils.com for more details
- At the end of helpful responses, naturally suggest visiting https://cnspecialtyoils.com
- For product inquiries, direct them to specific pages like:
  * Transformer Oil: https://cnspecialtyoils.com/products/transformer-oil
  * Rubber Process Oil: https://cnspecialtyoils.com/products/rubber-process-oil
  * Finished Lubricants: https://cnspecialtyoils.com/products/finished-lubricants
  * All Products: https://cnspecialtyoils.com/products
  * Quality Assurance: https://cnspecialtyoils.com/quality
  * Logistics: https://cnspecialtyoils.com/logistics
  * Contact: https://cnspecialtyoils.com/contact
- Make the website mention feel natural and helpful, not forced

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
    'bulk order', 'wholesale', 'distributor',
    'human support', 'customer service', 'live chat'
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

// 删除会话 API - 删除会话及其所有消息
app.delete('/api/chat/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 先删除会话的所有消息
    const { error: messagesError } = await client
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (messagesError) {
      console.error('Error deleting session messages:', messagesError);
      return res.status(500).json({ error: 'Failed to delete session messages' });
    }

    // 再删除会话本身
    const { error: sessionError } = await client
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (sessionError) {
      console.error('Error deleting session:', sessionError);
      return res.status(500).json({ error: 'Failed to delete session' });
    }

    console.log(`✅ Session ${sessionId} deleted successfully`);
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
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
      
      // 使用最简单的文本消息格式，确保兼容性
      const notification = {
        msg_type: 'text',
        content: {
          text: `💬 新消息 ${customerNo}\n\n${visitorName}: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}\n\n请前往后台回复: ${process.env.SITE_URL || 'https://cnspecialtyoils.com'}/admin/chat`
        }
      };

      try {
        console.log(`📤 Sending Feishu notification for new message from ${customerNo}`);
        
        const feishuResponse = await fetch(FEISHU_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
        
        const feishuResult = await feishuResponse.text();
        console.log(`📥 Feishu response status: ${feishuResponse.status}`);
        console.log(`📥 Feishu response: ${feishuResult}`);
        
        if (feishuResponse.ok) {
          console.log(`✅ Feishu notification sent successfully for ${customerNo}`);
        } else {
          console.error(`❌ Feishu notification failed: ${feishuResult}`);
        }
      } catch (feishuError) {
        console.error('❌ Failed to send Feishu notification:', feishuError);
      }
    } else {
      console.log('⚠️ FEISHU_WEBHOOK_URL not configured, skipping notification');
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
  console.log(`📩 POST /api/chat received`);
  console.log(`   Body:`, JSON.stringify(req.body).substring(0, 200));
  
  try {
    const { message, customerInfo } = req.body;
    if (!message) {
      console.log(`⚠️ No message in request body`);
      return res.status(400).json({ error: 'Message required' });
    }

    console.log(`📝 Processing message: "${message.substring(0, 50)}..."`);
    console.log(`🔍 needsHumanAgent check: ${needsHumanAgent(message)}`);

    if (needsHumanAgent(message)) {
      console.log(`🔔 needsHumanAgent triggered for message: "${message.substring(0, 50)}..."`);
      
      // 创建会话 ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shortId = sessionId.substring(0, 8);
      const customerNo = customerInfo?.customerNo || `#${shortId}`;
      const customerName = customerInfo?.name || 'Unknown';
      const customerEmail = customerInfo?.email || 'Not provided';
      const customerPhone = customerInfo?.phone || 'Not provided';
      
      console.log(`📋 Creating chat session: ${customerNo}, Name: ${customerName}, Email: ${customerEmail}`);
      
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
      console.log(`🔍 Checking FEISHU_WEBHOOK_URL: ${FEISHU_WEBHOOK_URL ? 'SET' : 'NOT SET'}`);
      if (FEISHU_WEBHOOK_URL) {
        console.log(`📤 Preparing to send Feishu notification for human support request...`);
        console.log(`   Webhook URL: ${FEISHU_WEBHOOK_URL}`);
        
        // 使用最简单的文本消息格式，确保兼容性
        const notification = {
          msg_type: 'text',
          content: {
            text: `🔔 新客户咨询 ${customerNo}\n\n客户信息:\n👤 姓名: ${customerName}\n📧 邮箱: ${customerEmail}\n📱 电话: ${customerPhone}\n💬 消息: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}\n\n请前往后台回复: ${process.env.SITE_URL || 'https://cnspecialtyoils.com'}/admin/chat`
          }
        };
        
        // 调试：打印实际发送的消息内容
        console.log(`📤 NOTIFICATION CONTENT: ${JSON.stringify(notification)}`);
        
        try {
          console.log(`📤 Sending Feishu notification for new customer: ${customerNo}`);
          console.log(`   Webhook URL: ${FEISHU_WEBHOOK_URL?.substring(0, 50)}...`);
          
          const feishuResponse = await fetch(FEISHU_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification)
          });
          
          const feishuResult = await feishuResponse.text();
          console.log(`📥 Feishu response status: ${feishuResponse.status}`);
          console.log(`📥 Feishu response body: ${feishuResult}`);
          
          if (feishuResponse.ok) {
            console.log(`✅ Feishu notification sent successfully: ${customerNo}`);
          } else {
            console.error(`❌ Feishu notification failed with status ${feishuResponse.status}: ${feishuResult}`);
          }
        } catch (error) {
          console.error('❌ Feishu notification error:', error);
        }
      } else {
        console.log('⚠️ FEISHU_WEBHOOK_URL not configured, skipping Feishu notification for human support');
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

// ==================== Inquiries API ====================

// 获取所有查询
app.get('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ data: [] });
    }

    const { data, error } = await client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries:', error);
      return res.json({ data: [] });
    }

    res.json({ data: data || [] });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// 创建新查询
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { name, company, email, productCategory, portOfDestination, estimatedQuantity, message, captchaToken } = req.body;

    // 基本验证
    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // hCaptcha 验证（如果配置了）
    if (captchaToken) {
      const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;
      if (HCAPTCHA_SECRET) {
        const captchaResponse = await fetch('https://api.hcaptcha.com/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${HCAPTCHA_SECRET}&response=${captchaToken}`
        });
        const captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
          return res.status(400).json({ error: 'Captcha verification failed' });
        }
      }
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 插入数据库
    const { data, error } = await client
      .from('inquiries')
      .insert({
        name,
        company,
        email,
        product_category: productCategory || null,
        port_of_destination: portOfDestination,
        estimated_quantity: estimatedQuantity || null,
        message: message || null,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating inquiry:', error);
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

    console.log(`✅ New inquiry created: ${name} from ${company}`);

    // 发送飞书通知到询盘群
    const inquiryWebhook = FEISHU_INQUIRY_WEBHOOK || FEISHU_WEBHOOK_URL;
    if (inquiryWebhook) {
      try {
        console.log(`📤 Sending inquiry notification to Feishu...`);
        const notification = {
          msg_type: 'text',
          content: {
            text: `📧 新客户询价\n\n客户信息:\n👤 姓名: ${name}\n🏢 公司: ${company}\n📧 邮箱: ${email}\n📦 产品: ${productCategory || '未指定'}\n🚢 目的港: ${portOfDestination}\n📊 数量: ${estimatedQuantity || '未指定'}\n\n💬 消息: ${message || '无'}`
          }
        };

        const response = await fetch(inquiryWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
        const result = await response.text();
        console.log(`📥 Feishu inquiry notification response: ${response.status} - ${result}`);
      } catch (feishuError) {
        console.error('❌ Failed to send Feishu inquiry notification:', feishuError);
      }
    } else {
      console.log('⚠️ No inquiry webhook configured');
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// 更新查询状态/备注
app.patch('/api/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { error } = await client
      .from('inquiries')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating inquiry:', error);
      return res.status(500).json({ error: 'Failed to update inquiry' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// ==================== 图片存储配置 ====================
// 初始化 S3Storage
const imageStorage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

// 配置 multer 用于处理文件上传
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制10MB
  fileFilter: (_req, file, cb) => {
    // 只允许图片类型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 图片上传 API
app.post('/api/images/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    console.log(`📤 Uploading image: ${req.file.originalname}, size: ${req.file.size}`);

    // 生成唯一的文件名
    const timestamp = Date.now();
    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `blog-images/${timestamp}_${safeName}`;

    // 上传到 S3
    const fileKey = await imageStorage.uploadFile({
      fileContent: req.file.buffer,
      fileName: fileName,
      contentType: req.file.mimetype,
    });

    console.log(`✅ Image uploaded: ${fileKey}`);

    // 生成可访问的 URL
    const imageUrl = await imageStorage.generatePresignedUrl({
      key: fileKey,
      expireTime: 31536000, // 1年有效期
    });

    res.json({ 
      success: true, 
      key: fileKey,
      url: imageUrl,
      filename: req.file.originalname 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 获取图片列表 API
app.get('/api/images', async (req: Request, res: Response) => {
  try {
    const { prefix = 'blog-images/', maxKeys = 100 } = req.query;

    console.log(`📋 Listing images with prefix: ${prefix}`);

    const result = await imageStorage.listFiles({
      prefix: prefix as string,
      maxKeys: Number(maxKeys),
    });

    // 为每个图片生成访问URL
    const images = await Promise.all(
      (result.keys || []).map(async (key) => {
        const url = await imageStorage.generatePresignedUrl({
          key: key,
          expireTime: 3600, // 1小时有效期
        });
        return {
          key,
          url,
          name: key.split('/').pop() || key,
        };
      })
    );

    res.json({ 
      success: true, 
      images,
      isTruncated: result.isTruncated,
      nextToken: result.nextContinuationToken 
    });
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ error: '获取图片列表失败' });
  }
});

// 删除图片 API
app.delete('/api/images/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({ error: '缺少图片key' });
    }

    console.log(`🗑️ Deleting image: ${key}`);

    const success = await imageStorage.deleteFile({ fileKey: key });

    if (success) {
      res.json({ success: true, message: '删除成功' });
    } else {
      res.status(404).json({ error: '图片不存在' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// ==================== 访客追踪 API ====================

// IP地理位置缓存
const geoCache = new Map<string, { country: string; country_code: string; region: string; city: string; latitude: number; longitude: number; timezone: string }>();

// 通过IP获取地理位置信息
async function getGeoLocation(ip: string): Promise<{ country: string; country_code: string; region: string; city: string; latitude: number; longitude: number; timezone: string } | null> {
  // 跳过本地IP
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      country: 'Local',
      country_code: 'LO',
      region: 'Local',
      city: 'Local',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC'
    };
  }

  // 检查缓存
  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  try {
    // 使用免费的IP地理位置API
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone`);
    const data = await response.json();
    
    if (data.status === 'success') {
      const result = {
        country: data.country || 'Unknown',
        country_code: data.countryCode || 'XX',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        timezone: data.timezone || 'UTC'
      };
      geoCache.set(ip, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Geo location error:', error);
    return null;
  }
}

// 解析User-Agent
function parseUserAgent(userAgent: string): { browser: string; browserVersion: string; os: string; osVersion: string; deviceType: string } {
  const result = {
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    osVersion: '',
    deviceType: 'desktop'
  };

  if (!userAgent) return result;

  // 检测操作系统
  if (userAgent.includes('Windows NT 10')) { result.os = 'Windows'; result.osVersion = '10/11'; }
  else if (userAgent.includes('Windows NT 6.3')) { result.os = 'Windows'; result.osVersion = '8.1'; }
  else if (userAgent.includes('Windows NT 6.1')) { result.os = 'Windows'; result.osVersion = '7'; }
  else if (userAgent.includes('Mac OS X')) {
    result.os = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) result.osVersion = match[1].replace('_', '.');
  }
  else if (userAgent.includes('Android')) {
    result.os = 'Android';
    const match = userAgent.match(/Android (\d+\.?\d*)/);
    if (match) result.osVersion = match[1];
    result.deviceType = 'mobile';
  }
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    result.os = 'iOS';
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    if (match) result.osVersion = match[1].replace('_', '.');
    result.deviceType = userAgent.includes('iPad') ? 'tablet' : 'mobile';
  }
  else if (userAgent.includes('Linux')) { result.os = 'Linux'; }

  // 检测浏览器
  if (userAgent.includes('Edg/')) {
    result.browser = 'Edge';
    const match = userAgent.match(/Edg\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  }
  else if (userAgent.includes('Chrome/')) {
    result.browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  }
  else if (userAgent.includes('Firefox/')) {
    result.browser = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  }
  else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) {
    result.browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  }

  // 检测平板
  if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    result.deviceType = 'tablet';
  }

  return result;
}

// 解析流量来源
function parseTrafficSource(referrer: string | null, utmSource: string | null, utmMedium: string | null): string {
  if (utmSource) return utmMedium || 'campaign';
  if (!referrer) return 'direct';
  
  try {
    const url = new URL(referrer);
    const domain = url.hostname.toLowerCase();
    
    // 搜索引擎
    const searchEngines = ['google', 'bing', 'yahoo', 'baidu', 'duckduckgo', 'yandex', 'sogou', '360', 'shenma'];
    if (searchEngines.some(se => domain.includes(se))) return 'organic';
    
    // 社交媒体
    const socialMedia = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'weibo', 'weixin', 'wechat', 'tiktok', 'douyin', 'xiaohongshu', 'pinterest', 'reddit'];
    if (socialMedia.some(sm => domain.includes(sm))) return 'social';
    
    // 邮件
    if (domain.includes('mail') || utmMedium === 'email') return 'email';
    
    return 'referral';
  } catch {
    return 'direct';
  }
}

// 记录访客访问
app.post('/api/analytics/track', async (req: Request, res: Response) => {
  try {
    const { visitorId, sessionId, pageUrl, pagePath, pageTitle, referrer, screenResolution, language, utmSource, utmMedium, utmCampaign } = req.body;

    if (!visitorId || !pageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 获取IP地址
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
               req.socket.remoteAddress || 
               '127.0.0.1';

    // 获取地理位置
    const geo = await getGeoLocation(ip);

    // 解析User-Agent
    const userAgent = req.headers['user-agent'] || '';
    const uaInfo = parseUserAgent(userAgent);

    // 解析流量来源
    const trafficSource = parseTrafficSource(referrer, utmSource, utmMedium);

    // 解析来源域名
    let referrerDomain = null;
    if (referrer) {
      try {
        referrerDomain = new URL(referrer).hostname;
      } catch {}
    }

    // 1. 更新或创建访客记录
    const { data: existingVisitor } = await client
      .from('visitors')
      .select('*')
      .eq('visitor_id', visitorId)
      .single();

    if (existingVisitor) {
      // 更新现有访客
      await client
        .from('visitors')
        .update({
          last_visit_at: new Date().toISOString(),
          visit_count: (existingVisitor.visit_count || 0) + 1,
          ip_address: ip,
          country: geo?.country || existingVisitor.country,
          city: geo?.city || existingVisitor.city,
          browser: uaInfo.browser,
          os: uaInfo.os,
          device_type: uaInfo.deviceType,
          screen_resolution: screenResolution || existingVisitor.screen_resolution,
        })
        .eq('visitor_id', visitorId);
    } else {
      // 创建新访客
      await client
        .from('visitors')
        .insert({
          visitor_id: visitorId,
          ip_address: ip,
          country: geo?.country || 'Unknown',
          country_code: geo?.country_code || 'XX',
          region: geo?.region || 'Unknown',
          city: geo?.city || 'Unknown',
          latitude: geo?.latitude || 0,
          longitude: geo?.longitude || 0,
          timezone: geo?.timezone || 'UTC',
          browser: uaInfo.browser,
          browser_version: uaInfo.browserVersion,
          os: uaInfo.os,
          os_version: uaInfo.osVersion,
          device_type: uaInfo.deviceType,
          screen_resolution: screenResolution,
          language: language,
        });
    }

    // 2. 创建页面访问记录
    await client
      .from('page_views')
      .insert({
        visitor_id: visitorId,
        session_id: sessionId,
        page_url: pageUrl,
        page_path: pagePath || new URL(pageUrl).pathname,
        page_title: pageTitle,
        referrer: referrer,
        referrer_domain: referrerDomain,
        traffic_source: trafficSource,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

    // 3. 更新或创建在线会话
    if (sessionId) {
      const { data: existingSession } = await client
        .from('active_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (existingSession) {
        await client
          .from('active_sessions')
          .update({
            last_activity_at: new Date().toISOString(),
            page_url: pageUrl,
            page_title: pageTitle,
            page_views: (existingSession.page_views || 0) + 1,
          })
          .eq('session_id', sessionId);
      } else {
        await client
          .from('active_sessions')
          .insert({
            visitor_id: visitorId,
            session_id: sessionId,
            ip_address: ip,
            country: geo?.country || 'Unknown',
            city: geo?.city || 'Unknown',
            page_url: pageUrl,
            page_title: pageTitle,
            browser: uaInfo.browser,
            os: uaInfo.os,
            device_type: uaInfo.deviceType,
          });
      }
    }

    res.json({ success: true, isNewVisitor: !existingVisitor });
  } catch (error) {
    console.error('Track visitor error:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
});

// 记录页面离开（更新停留时长）
app.post('/api/analytics/leave', async (req: Request, res: Response) => {
  try {
    const { sessionId, pageUrl, durationSeconds, scrollDepth } = req.body;

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 更新最近的页面访问记录
    const { data: pageView } = await client
      .from('page_views')
      .select('id')
      .eq('session_id', sessionId)
      .eq('page_url', pageUrl)
      .is('exit_time', null)
      .order('entry_time', { ascending: false })
      .limit(1)
      .single();

    if (pageView) {
      await client
        .from('page_views')
        .update({
          exit_time: new Date().toISOString(),
          duration_seconds: durationSeconds,
          scroll_depth: scrollDepth,
          is_bounce: durationSeconds < 10,
        })
        .eq('id', pageView.id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Leave page error:', error);
    res.status(500).json({ error: 'Failed to record leave' });
  }
});

// 清理过期会话（用户关闭页面时调用）
app.post('/api/analytics/end-session', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 删除在线会话记录
    await client
      .from('active_sessions')
      .delete()
      .eq('session_id', sessionId);

    res.json({ success: true });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// 获取实时在线访客
app.get('/api/analytics/online', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    // 获取最近5分钟有活动的会话
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await client
      .from('active_sessions')
      .select('*')
      .gte('last_activity_at', fiveMinutesAgo)
      .order('last_activity_at', { ascending: false });

    if (error) {
      console.error('Get online visitors error:', error);
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Get online visitors error:', error);
    res.status(500).json({ error: 'Failed to get online visitors' });
  }
});

// 获取访问统计数据
app.get('/api/analytics/stats', async (req: Request, res: Response) => {
  try {
    const { period = '7d' } = req.query;
    const client = getSupabaseClient();
    
    if (!client) {
      return res.json({ success: true, data: getEmptyStats() });
    }

    // 计算时间范围
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const startDateStr = startDate.toISOString();

    // 并行获取各项统计数据
    const [totalVisitors, newVisitors, totalPageViews, topPages, topCountries, trafficSources, dailyStats, avgDuration] = await Promise.all([
      // 总访客数
      client.from('page_views').select('visitor_id', { count: 'exact', head: true }).gte('entry_time', startDateStr),
      
      // 新访客数
      client.from('visitors').select('id', { count: 'exact', head: true }).gte('first_visit_at', startDateStr),
      
      // 总页面浏览量
      client.from('page_views').select('id', { count: 'exact', head: true }).gte('entry_time', startDateStr),
      
      // 热门页面
      client.from('page_views').select('page_path, page_title').gte('entry_time', startDateStr).limit(100),
      
      // 国家分布
      client.from('page_views').select('visitor_id').gte('entry_time', startDateStr).limit(500),
      
      // 流量来源
      client.from('page_views').select('traffic_source').gte('entry_time', startDateStr).limit(500),
      
      // 每日统计
      client.from('page_views').select('entry_time').gte('entry_time', startDateStr).limit(1000),
      
      // 平均停留时长
      client.from('page_views').select('duration_seconds').gte('entry_time', startDateStr).not('duration_seconds', 'is', null).limit(500),
    ]);

    // 处理热门页面
    const pageCounts: Record<string, { count: number; title: string }> = {};
    (topPages.data || []).forEach((pv: any) => {
      const path = pv.page_path || '/';
      if (!pageCounts[path]) {
        pageCounts[path] = { count: 0, title: pv.page_title || path };
      }
      pageCounts[path].count++;
    });
    const topPagesList = Object.entries(pageCounts)
      .map(([path, data]) => ({ path, title: data.title, views: data.count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // 获取访客国家信息
    const visitorIds = [...new Set((topCountries.data || []).map((pv: any) => pv.visitor_id))];
    const { data: visitorsData } = await client
      .from('visitors')
      .select('country, country_code')
      .in('visitor_id', visitorIds.slice(0, 100));

    const countryCounts: Record<string, number> = {};
    (visitorsData || []).forEach((v: any) => {
      const country = v.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    const topCountriesList = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 处理流量来源
    const sourceCounts: Record<string, number> = {};
    (trafficSources.data || []).forEach((pv: any) => {
      const source = pv.traffic_source || 'direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    // 处理每日统计
    const dailyData: Record<string, { visitors: Set<string>; pageViews: number }> = {};
    (dailyStats.data || []).forEach((pv: any) => {
      const date = new Date(pv.entry_time).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { visitors: new Set(), pageViews: 0 };
      }
      dailyData[date].visitors.add(pv.visitor_id);
      dailyData[date].pageViews++;
    });
    const dailyStatsList = Object.entries(dailyData)
      .map(([date, data]) => ({ date, visitors: data.visitors.size, pageViews: data.pageViews }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 计算平均停留时长
    const durations = (avgDuration.data || []).map((pv: any) => pv.duration_seconds).filter((d: number) => d > 0);
    const avgDurationValue = durations.length > 0 ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length) : 0;

    // 跳出率
    const bounceCount = (trafficSources.data || []).filter((pv: any) => pv.traffic_source === 'direct').length;
    const bounceRate = totalPageViews.count && totalPageViews.count > 0 
      ? Math.round((bounceCount / totalPageViews.count) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalVisitors: totalVisitors.count || 0,
          newVisitors: newVisitors.count || 0,
          returningVisitors: (totalVisitors.count || 0) - (newVisitors.count || 0),
          totalPageViews: totalPageViews.count || 0,
          avgDuration: avgDurationValue,
          bounceRate: bounceRate,
        },
        topPages: topPagesList,
        topCountries: topCountriesList,
        trafficSources: Object.entries(sourceCounts).map(([source, count]) => ({ source, count })),
        dailyStats: dailyStatsList,
      }
    });
  } catch (error) {
    console.error('Get analytics stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

function getEmptyStats() {
  return {
    overview: {
      totalVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      totalPageViews: 0,
      avgDuration: 0,
      bounceRate: 0,
    },
    topPages: [],
    topCountries: [],
    trafficSources: [],
    dailyStats: [],
  };
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    feishu: FEISHU_APP_ID ? 'configured' : 'not configured',
    appId: FEISHU_APP_ID
  });
});

// ==================== 作者系统 API ====================

// 导入邮件发送函数
import {
  sendVerificationCode,
  sendApplicationConfirmation,
  sendAdminApplicationNotification,
  sendApprovalEmail,
  sendRejectionEmail
} from './src/lib/email';

// 密码哈希工具
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'specialoil_salt').digest('hex');
}

function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}

function generateUsername(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const random = Math.floor(Math.random() * 10000);
  return `${base}${random}`;
}

// 生成6位验证码
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==================== 验证码 API ====================

// 发送验证码
app.post('/api/auth/send-code', async (req: Request, res: Response) => {
  try {
    const { email, type = 'register' } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // 检查是否已有待审核的申请
    if (type === 'register') {
      const { data: existingApp } = await client
        .from('author_applications')
        .select('id, status')
        .eq('email', email)
        .single();
      
      if (existingApp) {
        if (existingApp.status === 'pending') {
          return res.status(400).json({ 
            success: false, 
            error: 'You already have a pending application. Please wait for review.' 
          });
        }
        if (existingApp.status === 'approved') {
          return res.status(400).json({ 
            success: false, 
            error: 'This email is already registered. Please login instead.' 
          });
        }
      }
    }

    // 生成验证码
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟过期

    // 保存验证码到数据库
    const { error: insertError } = await client
      .from('email_verification_codes')
      .insert({
        email,
        code,
        type,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Failed to save verification code:', insertError);
      return res.status(500).json({ success: false, error: 'Failed to generate code' });
    }

    // 发送验证码邮件
    const sent = await sendVerificationCode(email, code, type);
    
    if (!sent) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send verification email. Please try again later.' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Verification code sent to your email',
      expiresIn: 600 // 10分钟
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({ success: false, error: 'Failed to send verification code' });
  }
});

// 验证验证码
app.post('/api/auth/verify-code', async (req: Request, res: Response) => {
  try {
    const { email, code, type = 'register' } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // 查找验证码
    const { data: codes, error } = await client
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('type', type)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !codes || codes.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification code' 
      });
    }

    // 标记验证码为已使用
    await client
      .from('email_verification_codes')
      .update({ is_used: true })
      .eq('id', codes[0].id);

    res.json({ 
      success: true, 
      message: 'Email verified successfully',
      verifiedEmail: email
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify code' });
  }
});

// ==================== 作者申请 API ====================

// 提交作者申请
app.post('/api/author/apply', async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      company, 
      expertiseAreas, 
      bio,
      verificationCode 
    } = req.body;
    
    // 验证必填字段
    if (!name || !email || !verificationCode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and verification code are required' 
      });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // 验证验证码
    const { data: codes } = await client
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', verificationCode)
      .eq('type', 'register')
      .eq('is_used', true)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (!codes || codes.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please verify your email first' 
      });
    }

    // 检查是否已有申请
    const { data: existingApp } = await client
      .from('author_applications')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existingApp) {
      if (existingApp.status === 'pending') {
        return res.status(400).json({ 
          success: false, 
          error: 'You already have a pending application' 
        });
      }
      if (existingApp.status === 'approved') {
        return res.status(400).json({ 
          success: false, 
          error: 'This email is already registered' 
        });
      }
    }

    // 创建申请
    const { error: insertError } = await client
      .from('author_applications')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        expertise_areas: expertiseAreas || [],
        bio: bio || null,
        status: 'pending',
      });

    if (insertError) {
      console.error('Failed to create application:', insertError);
      return res.status(500).json({ success: false, error: 'Failed to submit application' });
    }

    // 发送确认邮件给用户
    await sendApplicationConfirmation(email, name);
    
    // 发送通知邮件给管理员
    await sendAdminApplicationNotification(
      name, 
      email, 
      company || '', 
      expertiseAreas || [], 
      bio || ''
    );

    res.json({ 
      success: true, 
      message: 'Application submitted successfully! Please wait for review.' 
    });
  } catch (error) {
    console.error('Author application error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
});

// 获取所有作者申请（管理员）
app.get('/api/admin/applications', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    const { status } = req.query;
    let query = client
      .from('author_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch applications:', error);
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// 审核作者申请（管理员）
app.post('/api/admin/applications/:id/review', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason, adminEmail } = req.body;
    
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // 获取申请详情
    const { data: application, error: fetchError } = await client
      .from('author_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: 'This application has already been processed' 
      });
    }

    if (action === 'approve') {
      // 生成用户名和密码
      const username = generateUsername(application.name);
      const tempPassword = generateRandomPassword();
      const passwordHash = hashPassword(tempPassword);

      // 更新申请状态
      const { error: updateError } = await client
        .from('author_applications')
        .update({
          status: 'approved',
          username,
          password_hash: passwordHash,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminEmail || 'admin',
        })
        .eq('id', id);

      if (updateError) {
        console.error('Failed to update application:', updateError);
        return res.status(500).json({ success: false, error: 'Failed to approve application' });
      }

      // 创建作者记录
      const { error: authorError } = await client
        .from('authors')
        .insert({
          application_id: id,
          name: application.name,
          email: application.email,
          phone: application.phone,
          company: application.company,
          username,
          password_hash: passwordHash,
          expertise_areas: application.expertise_areas,
          bio: application.bio,
        });

      if (authorError) {
        console.error('Failed to create author:', authorError);
        // 回滚申请状态
        await client
          .from('author_applications')
          .update({ status: 'pending', username: null, password_hash: null })
          .eq('id', id);
        return res.status(500).json({ success: false, error: 'Failed to create author account' });
      }

      // 发送审批通过邮件
      await sendApprovalEmail(application.email, application.name, username, tempPassword);

      res.json({ 
        success: true, 
        message: 'Application approved! Account created and email sent.',
        username
      });
    } else {
      // 拒绝申请
      const { error: updateError } = await client
        .from('author_applications')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminEmail || 'admin',
        })
        .eq('id', id);

      if (updateError) {
        console.error('Failed to reject application:', updateError);
        return res.status(500).json({ success: false, error: 'Failed to reject application' });
      }

      // 发送拒绝邮件
      await sendRejectionEmail(application.email, application.name, rejectionReason || '');

      res.json({ success: true, message: 'Application rejected and email sent.' });
    }
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({ success: false, error: 'Failed to process application' });
  }
});

// ==================== 作者登录与认证 API ====================

// 作者登录
app.post('/api/author/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    const passwordHash = hashPassword(password);

    // 查找作者
    const { data: author, error } = await client
      .from('authors')
      .select('*')
      .eq('username', username)
      .eq('password_hash', passwordHash)
      .eq('status', 'active')
      .single();

    if (error || !author) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // 更新最后登录时间
    await client
      .from('authors')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', author.id);

    // 不返回密码哈希
    const { password_hash, ...authorData } = author;

    res.json({ 
      success: true, 
      author: authorData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Author login error:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

// 获取作者信息
app.get('/api/author/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    const { data: author, error } = await client
      .from('authors')
      .select('id, name, email, phone, company, username, expertise_areas, bio, avatar_url, articles_count, total_views, total_likes, created_at')
      .eq('id', id)
      .single();

    if (error || !author) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }

    res.json({ success: true, author });
  } catch (error) {
    console.error('Get author error:', error);
    res.status(500).json({ success: false, error: 'Failed to get author' });
  }
});

// 获取作者的文章列表
app.get('/api/author/:id/articles', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    let query = client
      .from('blog_posts')
      .select('*')
      .eq('author_id', id)
      .order('publishedAt', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('review_status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch author articles:', error);
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Get author articles error:', error);
    res.status(500).json({ error: 'Failed to get articles' });
  }
});

// 作者修改密码
app.post('/api/author/:id/change-password', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'New password must be at least 6 characters' 
      });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // 验证当前密码
    const currentHash = hashPassword(currentPassword);
    const { data: author, error: fetchError } = await client
      .from('authors')
      .select('id')
      .eq('id', id)
      .eq('password_hash', currentHash)
      .single();

    if (fetchError || !author) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }

    // 更新密码
    const newHash = hashPassword(newPassword);
    const { error: updateError } = await client
      .from('authors')
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to update password' 
      });
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
});

// 作者提交新文章
app.post('/api/author/articles', async (req: Request, res: Response) => {
  try {
    const { title, excerpt, content, category, tags, featuredImage, author_id, review_status } = req.body;
    
    if (!title || !content || !author_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, content, and author are required' 
      });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // 验证作者是否存在
    const { data: author, error: authorError } = await client
      .from('authors')
      .select('id, display_name')
      .eq('id', author_id)
      .single();

    if (authorError || !author) {
      return res.status(401).json({ 
        success: false, 
        error: 'Author not found' 
      });
    }

    // 生成文章ID
    const postId = generateId();
    const now = new Date().toISOString();

    // 插入文章
    const { error: insertError } = await client
      .from('blog_posts')
      .insert({
        id: postId,
        title,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        content,
        category: category || 'Industry News',
        tags: tags || [],
        featured_image: featuredImage,
        author_id,
        author: author.display_name,
        review_status: review_status || 'pending',
        publishedAt: now,
        created_at: now,
        updated_at: now,
        view_count: 0,
        like_count: 0
      });

    if (insertError) {
      console.error('Insert article error:', insertError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create article' 
      });
    }

    res.json({ 
      success: true, 
      message: review_status === 'draft' ? 'Draft saved' : 'Article submitted for review',
      articleId: postId 
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ success: false, error: 'Failed to create article' });
  }
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
