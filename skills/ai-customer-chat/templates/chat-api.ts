/**
 * AI Customer Chat System - Backend API
 * 
 * 将此代码添加到你的 server.ts 中
 */

import { Request, Response } from 'express';
import { getSupabaseClient } from './src/storage/database/supabase-client';

// ==================== 环境变量 ====================
const FEISHU_CHAT_WEBHOOK = process.env.FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.openai.com';

// ==================== 网站知识库（根据你的业务修改） ====================
const WEBSITE_KNOWLEDGE = `
You are a helpful customer service assistant for [Your Company Name].
You help customers with:
- Product information and specifications
- Pricing and quotes
- Order status and tracking
- Technical support
- General inquiries

Be friendly, professional, and concise.
If you cannot help with a question, suggest the user to request human support by saying "I'll connect you with a human agent".

Company Information:
- Products: [Your products]
- Location: [Your location]
- Contact: [Your contact info]
`;

// ==================== 转人工关键词检测 ====================
function needsHumanAgent(message: string): boolean {
  const keywords = [
    'human', '人工', '客服', '转人工',
    'speak to', 'talk to', 'person', 'agent',
    'manager', 'supervisor', 'urgent', 'emergency',
    'complaint', 'complain', 'refund', 'return',
    'price', 'pricing', 'quote', 'quotation', 'cost',
    'custom order', 'special order', 'partnership',
    'bulk order', 'wholesale', 'distributor',
    'human support', 'customer service', 'live chat'
  ];
  return keywords.some(k => message.toLowerCase().includes(k));
}

// ==================== API Routes ====================

/**
 * 获取消息 - 前端轮询获取客服回复
 * GET /api/chat/messages?sessionId=xxx&after=xxx
 */
export async function getChatMessages(req: Request, res: Response) {
  try {
    const { sessionId, after } = req.query;
    
    console.log(`📨 Polling messages for session: ${sessionId}`);
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.json({ messages: [] });
    }

    // 获取会话
    const { data: session } = await client
      .from('chat_sessions')
      .select('id, status')
      .eq('id', sessionId as string)
      .single();
    
    if (!session) {
      return res.json({ messages: [] });
    }

    // 获取消息
    let query = client
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
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

    const { data: messages } = await query;
    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

/**
 * 获取所有会话 - 后台客服工作台
 * GET /api/chat/sessions
 */
export async function getChatSessions(req: Request, res: Response) {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    const { data: sessions } = await client
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    res.json({ success: true, data: sessions || [] });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
}

/**
 * 获取会话消息 - 后台客服工作台
 * GET /api/chat/sessions/:sessionId/messages
 */
export async function getSessionMessages(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }

    const { data: messages } = await client
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    res.json({ success: true, data: messages || [] });
  } catch (error) {
    console.error('Get session messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

/**
 * 获取会话状态 - 前端检测会话是否已关闭
 * GET /api/chat/sessions/:sessionId/status
 */
export async function getSessionStatus(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: false, error: 'Database not configured' });
    }

    const { data: session } = await client
      .from('chat_sessions')
      .select('status')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return res.json({ success: false, error: 'Session not found' });
    }

    res.json({ success: true, status: session.status });
  } catch (error) {
    console.error('Get session status error:', error);
    res.status(500).json({ error: 'Failed to get session status' });
  }
}

/**
 * 管理员发送消息
 * POST /api/chat/admin/message
 */
export async function sendAdminMessage(req: Request, res: Response) {
  try {
    const { sessionId, message, adminName } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 保存消息
    await client.from('chat_messages').insert({
      session_id: sessionId,
      sender_type: 'admin',
      sender_name: adminName || 'Support',
      message: message
    });

    // 如果会话是 waiting 状态，自动变为 active
    await client
      .from('chat_sessions')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .eq('status', 'waiting');

    // 更新会话时间
    await client
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Admin message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

/**
 * 关闭会话
 * POST /api/chat/sessions/:sessionId/close
 */
export async function closeSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    await client
      .from('chat_sessions')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    res.json({ success: true, message: 'Session closed' });
  } catch (error) {
    console.error('Close session error:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
}

/**
 * 删除会话
 * DELETE /api/chat/sessions/:sessionId
 */
export async function deleteSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 删除消息
    await client.from('chat_messages').delete().eq('session_id', sessionId);
    
    // 删除会话
    await client.from('chat_sessions').delete().eq('id', sessionId);

    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
}

/**
 * 人工客服消息 - 用户发送消息（转人工后使用）
 * POST /api/chat/human
 */
export async function sendHumanMessage(req: Request, res: Response) {
  try {
    const { message, sessionId, customerInfo } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and Session ID are required' });
    }

    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 获取会话
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

    // 发送飞书通知
    if (FEISHU_CHAT_WEBHOOK) {
      const customerNo = existingSession.customer_no || `#${sessionId.substring(0, 8)}`;
      const visitorName = existingSession.visitor_name || 'Visitor';
      
      const notification = {
        msg_type: 'text',
        content: {
          text: `💬 新消息 ${customerNo}\n\n${visitorName}: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}\n\n请前往后台回复: ${process.env.SITE_URL || 'https://your-website.com'}/admin/chat`
        }
      };

      try {
        await fetch(FEISHU_CHAT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
        console.log(`✅ Feishu notification sent for ${customerNo}`);
      } catch (feishuError) {
        console.error('❌ Failed to send Feishu notification:', feishuError);
      }
    }

    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Human chat error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

/**
 * AI 聊天主接口
 * POST /api/chat
 */
export async function chatWithAI(req: Request, res: Response) {
  try {
    const { message, customerInfo } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // 检测是否需要转人工
    if (needsHumanAgent(message)) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const customerNo = customerInfo?.customerNo || `#${sessionId.substring(0, 8)}`;
      const customerName = customerInfo?.name || 'Unknown';
      const customerEmail = customerInfo?.email || 'Not provided';
      const customerPhone = customerInfo?.phone || 'Not provided';
      
      const client = getSupabaseClient();
      
      if (client) {
        // 创建会话
        await client.from('chat_sessions').insert({
          id: sessionId,
          visitor_id: sessionId,
          visitor_name: customerName,
          visitor_email: customerEmail,
          visitor_phone: customerPhone,
          customer_no: customerNo,
          status: 'waiting'
        });
        
        // 保存用户消息
        await client.from('chat_messages').insert({
          session_id: sessionId,
          sender_type: 'visitor',
          sender_name: customerName,
          message: message
        });
      }
      
      // 发送飞书通知
      if (FEISHU_CHAT_WEBHOOK) {
        const notification = {
          msg_type: 'text',
          content: {
            text: `🔔 新客户咨询 ${customerNo}\n\n客户信息:\n👤 姓名: ${customerName}\n📧 邮箱: ${customerEmail}\n📱 电话: ${customerPhone}\n💬 消息: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}\n\n请前往后台回复: ${process.env.SITE_URL || 'https://your-website.com'}/admin/chat`
          }
        };

        try {
          await fetch(FEISHU_CHAT_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification)
          });
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

    // AI 回复
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
}

// ==================== 路由注册示例 ====================
/**
 * 在 server.ts 中添加以下路由：
 * 
 * app.get('/api/chat/messages', getChatMessages);
 * app.get('/api/chat/sessions', getChatSessions);
 * app.get('/api/chat/sessions/:sessionId/messages', getSessionMessages);
 * app.get('/api/chat/sessions/:sessionId/status', getSessionStatus);
 * app.post('/api/chat/admin/message', sendAdminMessage);
 * app.post('/api/chat/sessions/:sessionId/close', closeSession);
 * app.delete('/api/chat/sessions/:sessionId', deleteSession);
 * app.post('/api/chat/human', sendHumanMessage);
 * app.post('/api/chat', chatWithAI);
 */
