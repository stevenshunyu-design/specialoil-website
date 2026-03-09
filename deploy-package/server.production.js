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
    /* 重置样式 */
    body, html { margin: 0; padding: 0; width: 100% !important; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; }
    body { background-color: #f0f2f5; }
    
    /* 容器 */
    .email-container { max-width: 680px; margin: 0 auto; padding: 40px 20px; }
    
    /* 主卡片 */
    .email-card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    
    /* 头部 */
    .email-header { background: linear-gradient(135deg, #003366 0%, #1a4d80 50%, #003366 100%); padding: 50px 40px; text-align: center; position: relative; overflow: hidden; }
    .email-header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 50%); animation: pulse 3s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }
    .email-header .logo { position: relative; z-index: 1; }
    .email-header .logo-icon { width: 80px; height: 80px; background: rgba(212,175,55,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 2px solid rgba(212,175,55,0.4); }
    .email-header .logo-icon span { font-size: 36px; }
    .email-header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.5px; position: relative; z-index: 1; }
    .email-header .tagline { color: rgba(255,255,255,0.85); font-size: 16px; margin: 0; position: relative; z-index: 1; }
    
    /* 内容区域 */
    .email-content { padding: 50px 40px; }
    .email-content h2 { color: #003366; font-size: 26px; font-weight: 600; margin: 0 0 24px; letter-spacing: -0.3px; }
    .email-content p { color: #4a5568; font-size: 16px; line-height: 1.8; margin: 0 0 20px; }
    .email-content .greeting { font-size: 18px; color: #1a202c; }
    
    /* 特性列表 */
    .feature-list { list-style: none; padding: 0; margin: 30px 0; }
    .feature-list li { display: flex; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid #e2e8f0; }
    .feature-list li:last-child { border-bottom: none; }
    .feature-list .icon { width: 44px; height: 44px; background: linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; font-size: 22px; }
    .feature-list .text { flex: 1; }
    .feature-list .text strong { color: #003366; font-size: 16px; display: block; margin-bottom: 4px; }
    .feature-list .text span { color: #718096; font-size: 14px; }
    
    /* 按钮 */
    .email-button { display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #c9a02e 100%); color: #ffffff !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 14px rgba(212,175,55,0.35); transition: all 0.3s ease; }
    .email-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.45); }
    
    /* 文章卡片 */
    .article-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #D4AF37; transition: all 0.3s ease; }
    .article-card:hover { transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .article-card h3 { color: #003366; font-size: 18px; font-weight: 600; margin: 0 0 12px; }
    .article-card h3 a { color: #003366; text-decoration: none; }
    .article-card h3 a:hover { color: #D4AF37; }
    .article-card p { color: #64748b; font-size: 15px; margin: 0 0 16px; line-height: 1.7; }
    .article-card .read-more { color: #D4AF37; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; }
    .article-card .read-more:hover { color: #c9a02e; }
    .article-card .read-more::after { content: ' →'; margin-left: 4px; transition: transform 0.2s; }
    .article-card .read-more:hover::after { transform: translateX(4px); }
    
    /* 分隔线 */
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 40px 0; }
    
    /* 签名 */
    .signature { text-align: center; padding: 30px 0 0; }
    .signature p { color: #718096; font-size: 15px; margin: 0 0 8px; }
    .signature .team-name { color: #003366; font-weight: 600; font-size: 16px; }
    
    /* 页脚 */
    .email-footer { background: #1a202c; padding: 40px; text-align: center; }
    .email-footer .social-links { margin-bottom: 24px; }
    .email-footer .social-links a { display: inline-block; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; margin: 0 8px; line-height: 40px; text-decoration: none; transition: all 0.3s ease; }
    .email-footer .social-links a:hover { background: #D4AF37; transform: translateY(-2px); }
    .email-footer p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 12px; line-height: 1.6; }
    .email-footer a { color: rgba(255,255,255,0.8); text-decoration: none; }
    .email-footer a:hover { color: #D4AF37; }
    .email-footer .footer-links { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .email-footer .footer-links a { margin: 0 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    /* 响应式 */
    @media only screen and (max-width: 600px) {
      .email-container { padding: 20px 10px; }
      .email-header { padding: 40px 24px; }
      .email-header h1 { font-size: 26px; }
      .email-content { padding: 32px 24px; }
      .email-content h2 { font-size: 22px; }
      .email-footer { padding: 32px 24px; }
    }
  </style>
`;

async function sendSubscriptionConfirmation(email) {
  if (!resend) { console.log('Resend not configured'); return false; }
  
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to SpecialOil Newsletter 📧`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head><body>
        <div class="email-container">
          <div class="email-card">
            <div class="email-header">
              <div class="logo">
                <div class="logo-icon"><span>🏭</span></div>
                <h1>SpecialOil</h1>
                <p class="tagline">Your Trusted China Special Oil Partner</p>
              </div>
            </div>
            <div class="email-content">
              <h2>Welcome to Our Newsletter!</h2>
              <p class="greeting">Thank you for subscribing! You're now part of an exclusive community receiving the latest insights from China's special oil industry.</p>
              
              <div class="divider"></div>
              
              <p>Here's what you can expect:</p>
              <ul class="feature-list">
                <li>
                  <div class="icon">📊</div>
                  <div class="text">
                    <strong>Industry News</strong>
                    <span>Latest updates from China's special oil market</span>
                  </div>
                </li>
                <li>
                  <div class="icon">🔧</div>
                  <div class="text">
                    <strong>Technical Insights</strong>
                    <span>Expert analysis and product developments</span>
                  </div>
                </li>
                <li>
                  <div class="icon">📈</div>
                  <div class="text">
                    <strong>Market Analysis</strong>
                    <span>Price trends and market forecasts</span>
                  </div>
                </li>
                <li>
                  <div class="icon">🎁</div>
                  <div class="text">
                    <strong>Exclusive Offers</strong>
                    <span>Special promotions for our subscribers</span>
                  </div>
                </li>
              </ul>
              
              <div class="divider"></div>
              
              <div class="signature">
                <p>We're excited to have you on board!</p>
                <p class="team-name">The SpecialOil Team</p>
              </div>
            </div>
            <div class="email-footer">
              <p>You're receiving this email because you subscribed to our newsletter.</p>
              <div class="footer-links">
                <a href="${unsubscribeUrl}">Unsubscribe</a>
                <a href="${SITE_URL}">Visit Website</a>
                <a href="${SITE_URL}/contact">Contact Us</a>
              </div>
            </div>
          </div>
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
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head><body>
        <div class="email-container">
          <div class="email-card">
            <div class="email-header">
              <div class="logo">
                <div class="logo-icon"><span>🏭</span></div>
                <h1>SpecialOil</h1>
              </div>
            </div>
            <div class="email-content">
              <h2>Unsubscribe Confirmation</h2>
              <p class="greeting">You have been successfully unsubscribed from our newsletter.</p>
              <p>We're sorry to see you go. Your feedback is valuable to us - if you have a moment, please let us know why you decided to unsubscribe.</p>
              
              <div class="divider"></div>
              
              <p style="text-align: center;">Changed your mind? You can always come back!</p>
              <p style="text-align: center;"><a href="${resubscribeUrl}" class="email-button">Resubscribe</a></p>
              
              <div class="divider"></div>
              
              <div class="signature">
                <p>Thank you for being part of our community.</p>
                <p class="team-name">The SpecialOil Team</p>
              </div>
            </div>
            <div class="email-footer">
              <p>You're receiving this email because you unsubscribed from our newsletter.</p>
              <div class="footer-links">
                <a href="${SITE_URL}">Visit Website</a>
                <a href="${SITE_URL}/contact">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </body></html>`
    });
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
    const articlesHTML = articles.map(a => `
      <div class="article-card">
        <h3><a href="${a.url}">${a.title}</a></h3>
        <p>${a.summary}</p>
        <a href="${a.url}" class="read-more">Read full article</a>
      </div>
    `).join('');
    
    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: subject,
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head><body>
          <div class="email-container">
            <div class="email-card">
              <div class="email-header">
                <div class="logo">
                  <div class="logo-icon"><span>🏭</span></div>
                  <h1>SpecialOil</h1>
                  <p class="tagline">Newsletter</p>
                </div>
              </div>
              <div class="email-content">
                <h2 style="text-align: center;">${subject}</h2>
                ${previewText ? `<p style="text-align: center; color: #64748b; font-style: italic; font-size: 16px;">${previewText}</p><div class="divider"></div>` : ''}
                ${articlesHTML}
                <div class="divider"></div>
                <div class="signature">
                  <p>Stay connected with us!</p>
                  <p class="team-name">The SpecialOil Team</p>
                </div>
              </div>
              <div class="email-footer">
                <p>You're receiving this email because you subscribed to our newsletter.</p>
                <div class="footer-links">
                  <a href="${unsubscribeUrl}">Unsubscribe</a>
                  <a href="${SITE_URL}">Visit Website</a>
                  <a href="${SITE_URL}/contact">Contact Us</a>
                </div>
              </div>
            </div>
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
