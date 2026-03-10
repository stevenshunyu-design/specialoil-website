import express, { Request, Response } from 'express';
import cors from 'cors';
import { getSupabaseClient } from './src/storage/database/supabase-client';
import type { NewInquiry } from './src/storage/database/shared/schema';
import { 
  sendSubscriptionConfirmation, 
  sendUnsubscribeConfirmation,
  sendNewsletterToSubscribers
} from './src/lib/email';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// 飞书 Webhook URL（需要用户配置）
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;

// 发送飞书通知
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

    // 验证必填字段
    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'company', 'email', 'portOfDestination']
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const client = getSupabaseClient();
    
    // 插入数据
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

    // 发送飞书通知（异步，不阻塞响应）
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

// 获取询盘列表 API（需要认证）
app.get('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }

    res.json({ data });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 更新询盘状态 API
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
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to update inquiry' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 删除询盘 API
app.delete('/api/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = getSupabaseClient();
    
    const { error } = await client
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to delete inquiry' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 订阅 Newsletter API
app.post('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 验证邮箱
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const client = getSupabaseClient();
    
    // 检查是否已订阅
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
        // 重新激活订阅
        const { error } = await client
          .from('subscribers')
          .update({ status: 'active', unsubscribed_at: null })
          .eq('id', existing.id);

        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error: 'Failed to resubscribe' });
        }
      }
    } else {
      // 新订阅
      const { error } = await client
        .from('subscribers')
        .insert({ email, status: 'active' });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to subscribe' });
      }
      
      isNewSubscription = true;
    }

    // 发送确认邮件（异步，不阻塞响应）
    sendSubscriptionConfirmation(email).catch(err => 
      console.error('Failed to send confirmation email:', err)
    );

    res.status(isNewSubscription ? 201 : 200).json({ 
      success: true, 
      message: isNewSubscription 
        ? 'Thank you for subscribing! Please check your email for confirmation.' 
        : 'Welcome back! You have been resubscribed.'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 取消订阅 API
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
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }

    // 发送取消订阅确认邮件（异步）
    sendUnsubscribeConfirmation(email).catch(err => 
      console.error('Failed to send unsubscribe confirmation:', err)
    );

    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取所有订阅者 API（管理员）
app.get('/api/subscribers', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 删除订阅者 API（管理员）
app.delete('/api/subscribers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    
    const { error } = await client
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to delete subscriber' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 发送 Newsletter API（管理员）
app.post('/api/newsletter/send', async (req: Request, res: Response) => {
  try {
    const { subject, articles, previewText } = req.body;

    if (!subject || !articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Subject and articles are required' });
    }

    const client = getSupabaseClient();
    
    // 获取所有活跃订阅者
    const { data: subscribers, error } = await client
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(400).json({ error: 'No active subscribers' });
    }

    const emails = subscribers.map(s => s.email);

    // 批量发送邮件
    const result = await sendNewsletterToSubscribers(emails, subject, articles, previewText);

    res.json({ 
      success: result.success, 
      sentCount: result.sentCount,
      totalSubscribers: emails.length,
      errors: result.errors 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// AI 聊天 API
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.openai.com';

// 网站知识库上下文
const WEBSITE_KNOWLEDGE = `
You are an AI customer service assistant for Zhongrun Special Oil (Chinese Special Oil Supply Platform). 

About the Company:
- We are a leading Chinese supplier of specialty lubricants and oils
- Products include: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants
- Services: Quality assurance, global logistics, custom solutions

Key Products:
1. Transformer Oil: High-grade insulating oil for electrical transformers
2. Rubber Process Oil: Various types (Naphthenic, Paraffinic, Aromatic) for rubber manufacturing
3. White Oil: Food-grade and pharmaceutical-grade white oils
4. Finished Lubricants: Automotive, industrial, and marine lubricants

Contact Information:
- Email: steven.shunyu@gmail.com
- Phone: +8613793280176
- Website: SpecialOil platform

Key Services:
- Quality certification (ISO standards)
- Global shipping logistics
- Custom product development
- Technical support

When to Transfer to Human Agent:
If the user asks about: pricing, complex technical specifications, custom orders, complaints, partnership inquiries, or explicitly requests human agent - say: "I'll connect you with our team. Please provide your email so our specialist can contact you."
`;

// 检测是否需要人工客服
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

    // 检查是否需要人工客服（在 API key 检查之前）
    if (needsHumanAgent(message)) {
      // 发送飞书通知
      if (FEISHU_WEBHOOK_URL) {
        try {
          await fetch(FEISHU_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              msg_type: 'interactive',
              card: {
                header: {
                  title: { tag: 'plain_text', content: '🔔 Customer Service Request' },
                  template: 'red'
                },
                elements: [
                  {
                    tag: 'div',
                    text: { tag: 'lark_md', content: `**Message:**\n${message}` }
                  },
                  {
                    tag: 'div',
                    text: { tag: 'lark_md', content: '**Action Required:** Customer requested human assistance' }
                  }
                ]
              }
            })
          });
        } catch (err) {
          console.error('Failed to send Feishu notification:', err);
        }
      }

      return res.json({
        response: "I'll connect you with our team. Please provide your email so our specialist can contact you.",
        needsEmail: true
      });
    }

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // 调用 OpenAI API
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
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
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

// 提交客户邮箱（人工客服后）
app.post('/api/chat/email', async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // 发送飞书通知
    if (FEISHU_WEBHOOK_URL) {
      try {
        await fetch(FEISHU_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            msg_type: 'interactive',
            card: {
              header: {
                title: { tag: 'plain_text', content: '📧 Customer Email Collected' },
                template: 'green'
              },
              elements: [
                {
                  tag: 'div',
                  fields: [
                    { is_short: true, text: { tag: 'lark_md', content: `**Email:**\n${email}` } }
                  ]
                },
                {
                  tag: 'div',
                  text: { tag: 'lark_md', content: `**Original Message:**\n${message || 'N/A'}` }
                },
                {
                  tag: 'action',
                  actions: [
                    {
                      tag: 'button',
                      text: { tag: 'plain_text', content: 'Reply via Email' },
                      type: 'primary',
                      url: `mailto:${email}`
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

    res.json({ 
      success: true, 
      message: 'Thank you! Our team will contact you soon.' 
    });
  } catch (error) {
    console.error('Email submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
