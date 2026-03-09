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
  if (!FEISHU_WEBHOOK_URL) return;

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
    await fetch(FEISHU_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card) });
  } catch (error) {
    console.error('Feishu error:', error);
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
const distPath = path.join(__dirname, 'dist');
console.log('Static files path:', distPath);

// 检查 dist 目录是否存在
import fs from 'fs';
if (fs.existsSync(distPath)) {
  console.log('dist directory exists');
  app.use(express.static(distPath));
} else {
  console.log('WARNING: dist directory NOT found at', distPath);
  // 尝试其他可能的路径
  const altPath = path.join(process.cwd(), 'dist');
  console.log('Trying alternative path:', altPath);
  if (fs.existsSync(altPath)) {
    console.log('Alternative dist found');
    app.use(express.static(altPath));
  }
}

// ========== API 路由 ==========

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

app.post('/api/inquiries', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });

    const { name, company, email, productCategory, portOfDestination, estimatedQuantity, message } = req.body;

    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const { data, error } = await supabase
      .from('inquiries')
      .insert({ name, company, email, product_category: productCategory, port_of_destination: portOfDestination, estimated_quantity: estimatedQuantity, message, status: 'new' })
      .select().single();

    if (error) return res.status(500).json({ error: 'Failed to save' });

    sendFeishuNotification({ name, company, email, productCategory, portOfDestination, estimatedQuantity, message }).catch(() => {});

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/api/inquiries', async (_req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: 'Failed to fetch' });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
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
    if (error) return res.status(500).json({ error: 'Failed to update' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// SPA 回退路由
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Index file not found. __dirname: ' + __dirname);
  }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase: ${supabase ? 'configured' : 'NOT configured'}`);
  console.log(`Feishu: ${FEISHU_WEBHOOK_URL ? 'configured' : 'NOT configured'}`);
});
