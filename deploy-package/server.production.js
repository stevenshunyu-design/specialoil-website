import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Hostinger 会自动分配端口
const PORT = process.env.PORT || process.env.API_PORT || 3000;

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;

// 发送飞书通知
async function sendFeishuNotification(inquiry) {
  if (!FEISHU_WEBHOOK_URL) {
    console.log('Feishu webhook URL not configured, skipping notification');
    return;
  }

  const card = {
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
              url: `${process.env.SITE_URL || 'https://cnspecialtyoils.com'}/admin`
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
    console.log('Feishu notification sent:', response.ok ? 'success' : 'failed');
  } catch (error) {
    console.error('Error sending Feishu notification:', error);
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务（前端构建产物）
app.use(express.static(path.join(__dirname, 'dist')));

// ========== API 路由 ==========

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 提交询盘
app.post('/api/inquiries', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

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

    // 插入数据
    const { data, error } = await supabase
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

    // 发送飞书通知（异步）
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
app.get('/api/inquiries', async (_req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { data, error } = await supabase
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

// 更新询盘
app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
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

// 删除询盘
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { id } = req.params;

    const { error } = await supabase
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
};

// SPA 回退路由（所有非 API 路由返回 index.html）
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase configured: ${!!supabase}`);
  console.log(`Feishu webhook configured: ${!!FEISHU_WEBHOOK_URL}`);
});
