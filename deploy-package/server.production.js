import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Hostinger 会自动分配端口
const PORT = process.env.PORT || 3000;

// 邮件配置
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@specialoil.com';
const SITE_URL = process.env.SITE_URL || 'https://specialoil.com';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

console.log('========================================');
console.log('Starting server...');
console.log('__dirname:', __dirname);
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
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

// ========== Newsletter 订阅 API ==========

app.post('/api/subscribers', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // 检查是否已订阅
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();
    
    let isNewSubscription = false;
    
    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({ success: true, message: 'You are already subscribed!' });
      } else {
        // 重新激活
        const { error } = await supabase
          .from('subscribers')
          .update({ status: 'active', unsubscribed_at: null })
          .eq('id', existing.id);
        if (error) return res.status(500).json({ error: 'Failed to resubscribe' });
      }
    } else {
      // 新订阅
      const { error } = await supabase.from('subscribers').insert({ email, status: 'active' });
      if (error) return res.status(500).json({ error: 'Failed to subscribe' });
      isNewSubscription = true;
    }
    
    // 发送确认邮件（异步）
    sendSubscriptionConfirmation(email).catch(err => console.error('Email error:', err));
    
    res.status(isNewSubscription ? 201 : 200).json({ 
      success: true, 
      message: isNewSubscription 
        ? 'Thank you for subscribing! Please check your email for confirmation.' 
        : 'Welcome back! You have been resubscribed.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

// 取消订阅 API
app.post('/api/subscribers/unsubscribe', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const { error } = await supabase
      .from('subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email);
    
    if (error) return res.status(500).json({ error: 'Failed to unsubscribe' });
    
    // 发送确认邮件（异步）
    sendUnsubscribeConfirmation(email).catch(err => console.error('Email error:', err));
    
    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

// 获取所有订阅者（管理员）
app.get('/api/subscribers', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: 'Failed to fetch subscribers' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

// 删除订阅者（管理员）
app.delete('/api/subscribers/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { id } = req.params;
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    
    if (error) return res.status(500).json({ error: 'Failed to delete subscriber' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

// 发送 Newsletter（管理员）
app.post('/api/newsletter/send', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { subject, articles, previewText } = req.body;
    if (!subject || !articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: 'Subject and articles are required' });
    }
    
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');
    
    if (error) return res.status(500).json({ error: 'Failed to fetch subscribers' });
    if (!subscribers || subscribers.length === 0) {
      return res.status(400).json({ error: 'No active subscribers' });
    }
    
    const emails = subscribers.map(s => s.email);
    const result = await sendNewsletterToSubscribers(emails, subject, articles, previewText);
    
    res.json({ 
      success: result.success, 
      sentCount: result.sentCount,
      totalSubscribers: emails.length,
      errors: result.errors 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal error', details: error.message });
  }
});

// ========== 邮件发送函数 ==========

const emailStyles = `
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #003366 0%, #004488 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .footer a { color: #003366; }
    .article { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #D4AF37; }
    .article h3 { margin: 0 0 10px; color: #003366; }
    .article a { color: #D4AF37; text-decoration: none; }
  </style>
`;

async function sendSubscriptionConfirmation(email) {
  if (!resend) { console.log('Resend not configured'); return false; }
  
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to SpecialOil Newsletter! 📧`,
      html: `<!DOCTYPE html><html><head>${emailStyles}</head><body>
        <div class="header"><h1>🏭 SpecialOil</h1><p style="margin:10px 0 0;opacity:0.9;">Your Trusted China Special Oil Partner</p></div>
        <div class="content">
          <h2>Welcome to Our Newsletter!</h2>
          <p>Thank you for subscribing to the <strong>SpecialOil</strong> newsletter.</p>
          <p>You'll now receive:</p>
          <ul>
            <li>📊 Latest China special oil industry news</li>
            <li>🔧 Technical insights and product updates</li>
            <li>📈 Market analysis and price trends</li>
            <li>🎁 Exclusive offers and promotions</li>
          </ul>
          <p style="margin-top:30px;">Stay tuned for our next update!</p>
          <p>Best regards,<br><strong>The SpecialOil Team</strong></p>
        </div>
        <div class="footer">
          <p>You're receiving this email because you subscribed to our newsletter.</p>
          <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${SITE_URL}">Visit Website</a></p>
        </div>
      </body></html>`
    });
    
    if (error) { console.error('Email error:', error); return false; }
    console.log('Subscription email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

async function sendUnsubscribeConfirmation(email) {
  if (!resend) { console.log('Resend not configured'); return false; }
  
  const resubscribeUrl = `${SITE_URL}/blog`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You've been unsubscribed from SpecialOil Newsletter`,
      html: `<!DOCTYPE html><html><head>${emailStyles}</head><body>
        <div class="header"><h1>🏭 SpecialOil</h1></div>
        <div class="content">
          <h2>Unsubscribe Confirmation</h2>
          <p>You have been successfully unsubscribed from our newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always resubscribe:</p>
          <a href="${resubscribeUrl}" class="button">Resubscribe</a>
          <p>Thank you for being part of our community.</p>
          <p>Best regards,<br><strong>The SpecialOil Team</strong></p>
        </div>
        <div class="footer"><p><a href="${SITE_URL}">Visit Website</a></p></div>
      </body></html>`
    });
    
    if (error) { console.error('Email error:', error); return false; }
    console.log('Unsubscribe email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

async function sendNewsletterToSubscribers(subscribers, subject, articles, previewText) {
  if (!resend) return { success: false, sentCount: 0, errors: ['Resend not configured'] };
  
  const errors = [];
  let sentCount = 0;
  
  for (const email of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    const articlesHTML = articles.map(a => `<div class="article"><h3><a href="${a.url}">${a.title}</a></h3><p>${a.summary}</p><a href="${a.url}" style="color:#D4AF37">Read more →</a></div>`).join('');
    
    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: subject,
        html: `<!DOCTYPE html><html><head>${emailStyles}</head><body>
          <div class="header"><h1>🏭 SpecialOil</h1><p style="margin:10px 0 0;opacity:0.9">Newsletter</p></div>
          <div class="content">
            <h2>${subject}</h2>
            ${previewText ? `<p style="color:#666;font-style:italic">${previewText}</p>` : ''}
            ${articlesHTML}
            <p style="margin-top:30px">Stay connected with us!</p>
            <p>Best regards,<br><strong>The SpecialOil Team</strong></p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to our newsletter.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${SITE_URL}">Visit Website</a></p>
          </div>
        </body></html>`
      });
      
      if (error) { errors.push(`${email}: ${error.message}`); }
      else { sentCount++; }
      
      if (sentCount % 10 === 0) await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      errors.push(`${email}: ${err.message}`);
    }
  }
  
  return { success: sentCount > 0, sentCount, errors };
}

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
