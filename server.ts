import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getSupabaseClient } from './src/storage/database/supabase-client';
import 'dotenv/config';

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
const FEISHU_WEBHOOK_URL = process.env.FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.openai.com';

console.log('========================================');
console.log('Server Configuration:');
console.log('FEISHU_APP_ID:', FEISHU_APP_ID || 'NOT SET');
console.log('FEISHU_APP_SECRET:', FEISHU_APP_SECRET ? 'SET' : 'NOT SET');
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
          status: 'active'
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
        const visitorEmail = session.visitor_email;
        
        console.log(`Sending message to Feishu for session ${sessionId}`);
        await sendFeishuGroupMessage(sessionId, visitorName, visitorEmail, message);
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
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
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
    
    // 解析消息内容
    let messageText = '';
    try {
      const content = JSON.parse(message.content || '{}');
      messageText = content.text || '';
    } catch {
      messageText = message.content || '';
    }
    
    console.log(`Feishu message from ${senderId}: ${messageText}`);
    
    // 检查是否是回复格式: /reply <session_id> <message>
    const replyMatch = messageText.match(/^\/reply\s+(\w+)\s+(.+)/is);
    
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
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    feishu: FEISHU_APP_ID ? 'configured' : 'not configured',
    appId: FEISHU_APP_ID
  });
});

// 启动服务器
httpServer.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket: /socket.io/`);
  console.log(`Feishu webhook: POST /feishu/webhook`);
  console.log(`========================================`);
  
  // 测试飞书连接
  if (FEISHU_APP_ID && FEISHU_APP_SECRET) {
    getFeishuAccessToken().then(token => {
      if (token) {
        console.log('✅ Feishu bot connected successfully');
      }
    });
  }
});
