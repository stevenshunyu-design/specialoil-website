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
const PORT = process.env.PORT || 3000;

console.log('========================================');
console.log('Starting server...');
console.log('__dirname:', __dirname);
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('========================================');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;

// 发送飞书通知
async function sendFeishuNotification(inquiry) {
  if (!FEISHU_WEBHOOK_URL) {
    console.log('Feishu webhook not configured');
    return;
  }

  const card = {
    msg_type: 'interactive',
    card: {
      header: { title: { tag: 'plain_text', content: '🔔 新询盘通知' }, template: 'blue' },
      elements: [
        { tag: 'div', fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**联系人**\n${inquiry.name}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**公司**\n${inquiry.company}` } }
        ]},
        { tag: 'div', fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**邮箱**\n${inquiry.email}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**产品类型**\n${inquiry.productCategory || '未指定'}` } }
        ]},
        { tag: 'div', fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**目的港**\n${inquiry.portOfDestination}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**预估数量**\n${inquiry.estimatedQuantity || '未指定'}` } }
        ]},
        { tag: 'div', text: { tag: 'lark_md', content: `**备注信息**\n${inquiry.message || '无'}` } }
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
    console.error('Feishu error:', error);
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
import fs from 'fs';
const distPath = path.join(__dirname, 'dist');
console.log('Static files path:', distPath);

if (fs.existsSync(distPath)) {
  console.log('dist directory exists');
  app.use(express.static(distPath));
} else {
  console.log('WARNING: dist directory NOT found at', distPath);
}

// ========== API 路由 ==========

app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    env: process.env.NODE_ENV,
    supabase: supabase ? 'configured' : 'NOT configured',
    supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
    supabaseKey: supabaseKey ? 'SET' : 'NOT SET'
  });
});

app.post('/api/inquiries', async (req, res) => {
  console.log('Received inquiry request:', req.body);
  
  try {
    if (!supabase) {
      console.error('Supabase not configured');
      return res.status(500).json({ error: 'Database not configured', details: 'SUPABASE_URL or SUPABASE_ANON_KEY not set' });
    }

    const { name, company, email, productCategory, portOfDestination, estimatedQuantity, message } = req.body;

    // 验证必填字段
    if (!name || !company || !email || !portOfDestination) {
      console.error('Missing required fields:', { name: !!name, company: !!company, email: !!email, portOfDestination: !!portOfDestination });
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

    const insertData = {
      name,
      company,
      email,
      product_category: productCategory || null,
      port_of_destination: portOfDestination,
      estimated_quantity: estimatedQuantity || null,
      message: message || null,
      status: 'new'
    };
    
    console.log('Inserting data:', insertData);

    const { data, error } = await supabase
      .from('inquiries')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save', details: error.message, code: error.code });
    }

    console.log('Insert successful:', data);

    // 发送飞书通知（异步）
    sendFeishuNotification({
      name,
      company,
      email,
      productCategory,
      portOfDestination,
      estimatedQuantity,
      message
    }).catch(err => console.error('Feishu notification error:', err));

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

app.get('/api/inquiries', async (_req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch', details: error.message });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const { status, notes } = req.body;
    const updateData = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    const { data, error } = await supabase.from('inquiries').update(updateData).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: 'Failed to update', details: error.message });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete', details: error.message });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

// SPA 回退路由
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found');
  }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase: ${supabase ? 'configured' : 'NOT configured'}`);
  console.log(`Feishu: ${FEISHU_WEBHOOK_URL ? 'configured' : 'NOT configured'}`);
});
