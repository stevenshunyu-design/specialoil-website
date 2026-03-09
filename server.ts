import express, { Request, Response } from 'express';
import cors from 'cors';
import { getSupabaseClient } from './src/storage/database/supabase-client';
import type { NewInquiry } from './src/storage/database/shared/schema';

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

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
