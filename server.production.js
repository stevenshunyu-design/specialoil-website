import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { verify as verifyHcaptchaLib } from 'hcaptcha';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Hostinger 会自动分配端口
const PORT = process.env.PORT || 3000;

// 邮件配置
const FROM_EMAIL = process.env.FROM_EMAIL || 'steven.shunyu@gmail.com';
const SITE_URL = process.env.SITE_URL || 'https://specialoil.com';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// hCaptcha 配置
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;

console.log('========================================');
console.log('Starting server with security features...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('HCAPTCHA_SECRET:', HCAPTCHA_SECRET ? 'SET' : 'NOT SET');
console.log('========================================');

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;

// ========== 安全中间件 ==========

// Helmet 安全头
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.hcaptcha.com", "https://newassets.hcaptcha.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.hcaptcha.com", "https://hcaptcha.com", "https://*.supabase.co"],
      frameSrc: ["'self'", "https://newassets.hcaptcha.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// 信任反向代理（Hostinger 使用代理）
// 设置为 1 表示信任第一层代理，设置为 true 表示信任所有代理
app.set('trust proxy', 1);

// CORS 配置
const allowedOrigins = [
  'https://specialoil.com',
  'https://www.specialoil.com',
  'https://cnspecialtyoils.com',
  'https://www.cnspecialtyoils.com',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // 允许无origin的请求（如移动应用、Postman、同源请求）
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // 开发环境允许所有localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    // 允许所有 HTTPS 请求（生产环境更宽松）
    if (origin.startsWith('https://')) {
      return callback(null, true);
    }
    // 其他情况也允许（避免阻止正常请求）
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// 全局速率限制
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 200, // 每个IP最多200个请求
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  // 使用默认的 keyGenerator，自动处理 IPv6
});
app.use(globalLimiter);

// API 严格速率限制
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 50, // 每个IP每小时最多50次API调用
  message: { error: 'API rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 表单提交严格速率限制
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每个IP每小时最多5次表单提交
  message: { error: 'Too many form submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 解析 JSON
app.use(express.json({ limit: '10kb' })); // 限制请求体大小

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

// ========== 安全辅助函数 ==========

// 输入清理函数
function sanitizeInput(str, maxLength = 500) {
  if (!str || typeof str !== 'string') return '';
  // 移除危险字符，保留基本字符
  return str
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // 移除可能的HTML标签
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// 验证邮箱格式
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// hCaptcha 验证
async function validateHcaptcha(token, _ip) {
  if (!HCAPTCHA_SECRET) {
    console.log('hCaptcha secret not configured, skipping verification');
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'Captcha token is required' };
  }

  try {
    const result = await verifyHcaptchaLib(HCAPTCHA_SECRET, token);
    
    if (!result.success) {
      console.log('hCaptcha verification failed:', result['error-codes']);
      return { success: false, error: 'Captcha verification failed', codes: result['error-codes'] };
    }

    console.log('hCaptcha verification successful');
    return { success: true };
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return { success: false, error: 'Captcha verification error' };
  }
}

// 检查honeypot字段（机器人会填写隐藏字段）
function checkHoneypot(body) {
  const honeypotFields = ['website', 'url', 'phone', 'fax', 'address'];
  for (const field of honeypotFields) {
    if (body[field] && body[field].trim() !== '') {
      console.log('Honeypot triggered:', field);
      return false;
    }
  }
  return true;
}

// 检查提交时间（太快可能是机器人）
function checkSubmissionTiming(startTime) {
  const minTime = 2000; // 最少2秒
  const elapsed = Date.now() - startTime;
  return elapsed >= minTime;
}

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

// ========== API 路由 ==========

app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    env: process.env.NODE_ENV,
    supabase: supabase ? 'configured' : 'NOT configured',
    hcaptcha: HCAPTCHA_SECRET ? 'configured' : 'NOT configured'
  });
});

app.post('/api/inquiries', formLimiter, async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  console.log(`[${new Date().toISOString()}] Inquiry request from IP: ${clientIp}`);
  
  try {
    if (!supabase) {
      console.error('Supabase not configured');
      return res.status(500).json({ error: 'Database not configured' });
    }

    // 检查 honeypot
    if (!checkHoneypot(req.body)) {
      console.log('Honeypot detected, rejecting request');
      // 返回成功状态以迷惑机器人
      return res.status(201).json({ success: true, message: 'Inquiry submitted successfully' });
    }

    // 检查提交时间
    const startTime = parseInt(req.body._startTime || '0', 10);
    if (startTime && !checkSubmissionTiming(startTime)) {
      console.log('Submission too fast, likely a bot');
      return res.status(400).json({ error: 'Submission too fast. Please try again.' });
    }

    // 验证 hCaptcha
    const captchaResult = await validateHcaptcha(req.body.captchaToken, clientIp);
    if (!captchaResult.success) {
      return res.status(400).json({ error: captchaResult.error || 'Captcha verification failed' });
    }

    // 清理和验证输入
    const name = sanitizeInput(req.body.name, 100);
    const company = sanitizeInput(req.body.company, 200);
    const email = sanitizeInput(req.body.email, 254);
    const productCategory = sanitizeInput(req.body.productCategory, 50);
    const portOfDestination = sanitizeInput(req.body.portOfDestination, 200);
    const estimatedQuantity = sanitizeInput(req.body.estimatedQuantity, 100);
    const message = sanitizeInput(req.body.message, 2000);

    // 验证必填字段
    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'company', 'email', 'portOfDestination'] 
      });
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
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
    
    console.log('Inserting data (sanitized):', { ...insertData, message: insertData.message?.substring(0, 50) + '...' });

    const { data, error } = await supabase
      .from('inquiries')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save', details: error.message });
    }

    console.log('Insert successful:', data.id);

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

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: { id: data.id } });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/api/inquiries', apiLimiter, async (_req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch' });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

app.patch('/api/inquiries/:id', apiLimiter, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    const { id } = req.params;
    const { status, notes } = req.body;
    const updateData = { updated_at: new Date().toISOString() };
    if (status) updateData.status = sanitizeInput(status, 20);
    if (notes !== undefined) updateData.notes = sanitizeInput(notes, 1000);
    const { data, error } = await supabase.from('inquiries').update(updateData).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: 'Failed to update' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

app.delete('/api/inquiries/:id', apiLimiter, async (req, res) => {
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

// ========== Newsletter 订阅 API ==========

app.post('/api/subscribers', formLimiter, async (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    // 检查 honeypot
    if (!checkHoneypot(req.body)) {
      return res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
    }
    
    const email = sanitizeInput(req.body.email, 254);
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    if (!isValidEmail(email)) {
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
        const { error } = await supabase
          .from('subscribers')
          .update({ status: 'active', unsubscribed_at: null })
          .eq('id', existing.id);
        if (error) return res.status(500).json({ error: 'Failed to resubscribe' });
      }
    } else {
      const { error } = await supabase.from('subscribers').insert({ 
        email, 
        status: 'active'
      });
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
    res.status(500).json({ error: 'Internal error' });
  }
});

// 取消订阅 API
app.post('/api/subscribers/unsubscribe', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const email = sanitizeInput(req.body.email, 254);
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const { error } = await supabase
      .from('subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email);
    
    if (error) return res.status(500).json({ error: 'Failed to unsubscribe' });
    
    sendUnsubscribeConfirmation(email).catch(err => console.error('Email error:', err));
    
    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// 获取所有订阅者（管理员）
app.get('/api/subscribers', apiLimiter, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { data, error } = await supabase
      .from('subscribers')
      .select('id, email, status, subscribed_at, unsubscribed_at')
      .order('subscribed_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: 'Failed to fetch subscribers' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// 删除订阅者（管理员）
app.delete('/api/subscribers/:id', apiLimiter, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });
    
    const { id } = req.params;
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    
    if (error) return res.status(500).json({ error: 'Failed to delete subscriber' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// 发送 Newsletter（管理员）
app.post('/api/newsletter/send', apiLimiter, async (req, res) => {
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
    const sanitizedSubject = sanitizeInput(subject, 200);
    const sanitizedPreview = sanitizeInput(previewText, 300);
    const sanitizedArticles = articles.map(a => ({
      ...a,
      title: sanitizeInput(a.title, 200),
      excerpt: sanitizeInput(a.excerpt, 500),
      url: a.url
    }));
    
    const result = await sendNewsletterToSubscribers(emails, sanitizedSubject, sanitizedArticles, sanitizedPreview);
    
    res.json({ 
      success: result.success, 
      sentCount: result.sentCount,
      totalSubscribers: emails.length,
      errors: result.errors 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// ========== 邮件发送函数 ==========

const emailStyles = `
  <style>
    body, html { margin: 0; padding: 0; width: 100% !important; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; }
    body { background-color: #f0f2f5; }
    .email-container { max-width: 680px; margin: 0 auto; padding: 40px 20px; }
    .email-card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .email-header { background: linear-gradient(135deg, #003366 0%, #1a4d80 50%, #003366 100%); padding: 50px 40px; text-align: center; position: relative; overflow: hidden; }
    .email-header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 50%); }
    .email-header .logo { position: relative; z-index: 1; }
    .email-header .logo-icon { width: 80px; height: 80px; background: rgba(212,175,55,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 2px solid rgba(212,175,55,0.4); }
    .email-header .logo-icon span { font-size: 36px; }
    .email-header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.5px; position: relative; z-index: 1; }
    .email-header .tagline { color: rgba(255,255,255,0.85); font-size: 16px; margin: 0; position: relative; z-index: 1; }
    .email-content { padding: 50px 40px; }
    .email-content h2 { color: #003366; font-size: 26px; font-weight: 600; margin: 0 0 24px; letter-spacing: -0.3px; }
    .email-content p { color: #4a5568; font-size: 16px; line-height: 1.8; margin: 0 0 20px; }
    .email-content .greeting { font-size: 18px; color: #1a202c; }
    .feature-list { list-style: none; padding: 0; margin: 30px 0; }
    .feature-list li { display: flex; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid #e2e8f0; }
    .feature-list li:last-child { border-bottom: none; }
    .feature-list .icon { width: 44px; height: 44px; background: linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; font-size: 22px; }
    .feature-list .text { flex: 1; }
    .feature-list .text strong { color: #003366; font-size: 16px; display: block; margin-bottom: 4px; }
    .feature-list .text span { color: #718096; font-size: 14px; }
    .email-button { display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #c9a02e 100%); color: #ffffff !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 14px rgba(212,175,55,0.35); }
    .article-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #D4AF37; }
    .article-card h3 { color: #003366; font-size: 18px; font-weight: 600; margin: 0 0 12px; }
    .article-card h3 a { color: #003366; text-decoration: none; }
    .article-card p { color: #64748b; font-size: 15px; margin: 0 0 16px; line-height: 1.7; }
    .article-card .read-more { color: #D4AF37; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 40px 0; }
    .signature { text-align: center; padding: 30px 0 0; }
    .signature p { color: #718096; font-size: 15px; margin: 0 0 8px; }
    .signature .team-name { color: #003366; font-weight: 600; font-size: 16px; }
    .email-footer { background: #1a202c; padding: 40px; text-align: center; }
    .email-footer p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 12px; line-height: 1.6; }
    .email-footer a { color: rgba(255,255,255,0.8); text-decoration: none; }
    .email-footer .footer-links { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .email-footer .footer-links a { margin: 0 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
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
      subject: `Welcome to SpecialOil Newsletter`,
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
                <li><div class="icon">📊</div><div class="text"><strong>Industry News</strong><span>Latest updates from China's special oil market</span></div></li>
                <li><div class="icon">🔧</div><div class="text"><strong>Technical Insights</strong><span>Expert analysis and product developments</span></div></li>
                <li><div class="icon">📈</div><div class="text"><strong>Market Analysis</strong><span>Price trends and market forecasts</span></div></li>
                <li><div class="icon">🎁</div><div class="text"><strong>Exclusive Offers</strong><span>Special promotions for our subscribers</span></div></li>
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
  
  const subscribeUrl = `${SITE_URL}/`;
  
  try {
    await resend.emails.send({
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
                <p class="tagline">Your Trusted China Special Oil Partner</p>
              </div>
            </div>
            <div class="email-content">
              <h2>Unsubscribed Successfully</h2>
              <p class="greeting">You have been successfully unsubscribed from our newsletter. We're sorry to see you go!</p>
              <div class="divider"></div>
              <p>If you change your mind, you can always resubscribe on our website.</p>
              <a href="${subscribeUrl}" class="email-button">Visit Website</a>
              <div class="signature">
                <p>Thank you for your time with us.</p>
                <p class="team-name">The SpecialOil Team</p>
              </div>
            </div>
            <div class="email-footer">
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </div>
      </body></html>`
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

async function sendNewsletterToSubscribers(emails, subject, articles, previewText) {
  if (!resend) { console.log('Resend not configured'); return { success: false, sentCount: 0, errors: ['Resend not configured'] }; }
  
  let sentCount = 0;
  const errors = [];
  
  for (const email of emails) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    
    const articlesHtml = articles.map(article => `
      <div class="article-card">
        <h3><a href="${article.url}">${article.title}</a></h3>
        <p>${article.excerpt}</p>
        <a href="${article.url}" class="read-more">Read more</a>
      </div>
    `).join('');
    
    try {
      await resend.emails.send({
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
                  <p class="tagline">Your Trusted China Special Oil Partner</p>
                </div>
              </div>
              <div class="email-content">
                <h2>${subject}</h2>
                ${previewText ? `<p class="greeting">${previewText}</p><div class="divider"></div>` : ''}
                ${articlesHtml}
                <div class="divider"></div>
                <div class="signature">
                  <p>Thank you for reading!</p>
                  <p class="team-name">The SpecialOil Team</p>
                </div>
              </div>
              <div class="email-footer">
                <p>You're receiving this email because you subscribed to our newsletter.</p>
                <div class="footer-links">
                  <a href="${unsubscribeUrl}">Unsubscribe</a>
                  <a href="${SITE_URL}">Visit Website</a>
                </div>
              </div>
            </div>
          </div>
        </body></html>`
      });
      sentCount++;
    } catch (error) {
      errors.push(`${email}: ${error.message}`);
    }
  }
  
  return { success: sentCount > 0, sentCount, errors };
}

// ========== AI 聊天助手 API ==========

// OpenAI API 配置
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_HOST = process.env.OPENAI_API_HOST || 'api.chatanywhere.tech';

// 网站知识库 - 用于AI理解网站内容
const WEBSITE_KNOWLEDGE = `
# CN-SpecLube Chain - 中国特种润滑油供应链平台

## 公司简介
CN-SpecLube Chain 是中国领先的特种润滑油供应链平台，专注于为中国及全球客户提供高品质的工业润滑油原料及成品。

## 主要产品
1. **变压器油 (Transformer Oil)**
   - 用于电力变压器、互感器等电气设备
   - 规格：25#、45#等
   - 符合IEC 60296、ASTM D3487标准

2. **橡胶操作油 (Rubber Process Oil)**
   - DAE (Distillate Aromatic Extract) 蒸馏芳烃抽出油
   - TDAE (Treated Distillate Aromatic Extract) 处理芳烃抽出油
   - RAE (Residual Aromatic Extract) 残渣芳烃抽出油
   - 用于橡胶轮胎、胶管、胶带等产品

3. **成品润滑油**
   - 液压油 (Hydraulic Oil)
   - 齿轮油 (Gear Oil)
   - 透平油 (Turbine Oil)
   - 导热油 (Heat Transfer Oil)

4. **基础油**
   - SN系列矿物基础油
   - 白油 (White Oil)
   - 环烷油 (Naphthenic Oil)

## 服务内容
- **产品采购**: 协助客户从中国采购优质润滑油原料
- **质量检测**: 提供第三方检测报告，确保产品质量
- **物流服务**: 提供FOB、CIF、CFR等多种贸易条款
- **技术支持**: 提供产品应用技术指导

## 贸易条款
- 支持EXW、FOB、CIF、CFR、DAP、DDP等Incoterms
- 最小起订量：根据产品不同，一般为1个集装箱或50桶
- 付款方式：T/T、L/C

## 质量认证
- ISO 9001 质量管理体系认证
- ISO 14001 环境管理体系认证
- 产品符合ASTM、DIN、IEC等国际标准
- 欧盟REACH合规

## 联系方式
- **邮箱**: steven.shunyu@gmail.com
- **电话/WhatsApp**: +86 137 9328 0176
- **地址**: 中国山东省青岛市崂山区松岭路197号10层
- **工作时间**: 周一至周五 9:00-18:00 (GMT+8)

## 常见问题
1. **起订量**: 根据产品不同，一般最小起订量为1个20尺集装箱或100桶
2. **交货期**: 常规产品7-14天，定制产品需要协商
3. **样品**: 可以提供免费样品，客户承担运费
4. **付款**: 支持T/T(30%定金+70%发货前付款)或信用证
5. **运输**: 可以安排海运到全球主要港口

## 公司优势
- 10年+ 行业经验
- 中国本土采购渠道
- 严格质量控制体系
- 专业团队支持
- 快速响应(24小时内回复)
`;

// 聊天会话存储（简单的内存存储，生产环境应使用数据库）
const chatSessions = new Map();

// 发送人工客服请求到飞书
async function notifyHumanSupportRequest(sessionId, messages, userEmail) {
  if (!FEISHU_WEBHOOK_URL) {
    console.log('Feishu webhook not configured');
    return false;
  }

  const lastMessages = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
  
  const card = {
    msg_type: 'interactive',
    card: {
      header: { title: { tag: 'plain_text', content: '🤖 AI助手转人工请求' }, template: 'orange' },
      elements: [
        { tag: 'div', text: { tag: 'lark_md', content: `**会话ID**\n${sessionId}` } },
        { tag: 'div', text: { tag: 'lark_md', content: `**客户邮箱**\n${userEmail || '未提供'}` } },
        { tag: 'div', text: { tag: 'lark_md', content: `**最近对话**\n${lastMessages}` } },
        { tag: 'action', actions: [
          { tag: 'button', text: { tag: 'plain_text', content: '联系客户' }, url: `mailto:${userEmail || ''}`, type: 'primary' }
        ]}
      ]
    }
  };

  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(card) 
    });
    return response.ok;
  } catch (error) {
    console.error('Feishu notification error:', error);
    return false;
  }
}

// AI 聊天 API
app.post('/api/chat', apiLimiter, async (req, res) => {
  try {
    const { message, sessionId, userEmail } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 创建或获取会话
    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!chatSessions.has(sid)) {
      chatSessions.set(sid, {
        messages: [],
        createdAt: new Date().toISOString(),
        userEmail: userEmail
      });
    }
    
    const session = chatSessions.get(sid);
    
    // 更新用户邮箱（如果提供）
    if (userEmail && !session.userEmail) {
      session.userEmail = userEmail;
    }
    
    // 添加用户消息到会话
    session.messages.push({ role: 'user', content: message });
    
    // 检查是否请求人工客服
    const humanKeywords = ['人工', '真人', '人工客服', '真人客服', '转人工', '客服', 'human', 'agent', 'support'];
    const isHumanRequest = humanKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    if (isHumanRequest) {
      // 发送通知到飞书
      await notifyHumanSupportRequest(sid, session.messages, session.userEmail);
      
      return res.json({
        success: true,
        sessionId: sid,
        response: '好的，我已经为您转接人工客服。我们的客服团队会尽快通过邮件或WhatsApp联系您。\n\n如需紧急联系，请直接联系：\n📧 邮箱：steven.shunyu@gmail.com\n📱 WhatsApp：+86 137 9328 0176',
        isHumanHandoff: true
      });
    }
    
    // 如果没有配置OpenAI API Key，返回默认响应
    if (!OPENAI_API_KEY) {
      console.log('OpenAI API key not configured');
      return res.json({
        success: true,
        sessionId: sid,
        response: '感谢您的咨询！我是CN-SpecLube的AI助手。\n\n我可以为您介绍我们的产品：变压器油、橡胶操作油、成品润滑油等。\n\n如需详细报价，请联系我们：\n📧 steven.shunyu@gmail.com\n📱 +86 137 9328 0176\n\n或者输入"人工"转接人工客服。'
      });
    }
    
    // 调用 OpenAI API
    const systemPrompt = `你是CN-SpecLube Chain的AI客服助手，专注于中国特种润滑油产品。

你的职责：
1. 回答关于公司产品、服务的问题
2. 协助客户了解产品规格、价格范围
3. 引导客户提交询盘或联系人工客服

重要信息：
${WEBSITE_KNOWLEDGE}

回答规则：
- 用中文回答（如果用户用英文提问，可以用英文回答）
- 简洁专业，避免过长回复
- 如果涉及具体价格，引导客户提交询盘
- 如果客户需要详细技术参数或报价，建议联系人工客服
- 如果客户要求人工服务，回复"请输入'人工'转接人工客服"
- 始终保持友好、专业的态度`;

    // 构建消息历史（保留最近10条）
    const recentMessages = session.messages.slice(-10);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages
    ];
    
    const openaiResponse = await fetch(`https://${OPENAI_API_HOST}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return res.status(500).json({ error: 'AI service error' });
    }
    
    const result = await openaiResponse.json();
    const aiResponse = result.choices[0]?.message?.content || '抱歉，我暂时无法回答您的问题。请联系人工客服。';
    
    // 添加AI回复到会话
    session.messages.push({ role: 'assistant', content: aiResponse });
    
    res.json({
      success: true,
      sessionId: sid,
      response: aiResponse
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

// ========== 飞书 Webhook 端点 ==========
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;

// 飞书 Token 管理
let feishuAccessToken = null;
let tokenExpireTime = 0;

async function getFeishuAccessToken() {
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
async function sendFeishuMessage(openId, message) {
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

// 飞书 Webhook 端点
app.post('/feishu/webhook', async (req, res) => {
  console.log('=== Received Feishu webhook ===');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const { type, challenge, event } = req.body;

  // URL 验证
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

      // 查找对应会话
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active');

      const targetSession = sessions?.find(s => 
        s.id.startsWith(sessionShortId)
      );

      if (targetSession) {
        console.log(`Found session ${targetSession.id} for reply`);
        
        // 保存消息
        await supabase.from('chat_messages').insert({
          session_id: targetSession.id,
          sender_type: 'admin',
          sender_name: 'Support',
          message: replyMessage
        });

        // 注意: 这里需要WebSocket通知访客
        // 由于生产环境可能没有WebSocket, 消息会保存在数据库中
        // 访客下次刷新时会获取历史消息

        console.log(`✅ Reply saved to database: ${replyMessage}`);
        
        if (senderId) {
          await sendFeishuMessage(senderId, `✅ 消息已保存，访客将在下次连接时收到`);
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

// GET 请求处理
app.get('/feishu/webhook', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Feishu webhook endpoint is working' });
});

// ========== SPA 回退路由 ==========
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built. Please run build first.');
  }
});

// ========== 启动服务器 ==========
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Security features enabled:`);
  console.log(`  - Helmet security headers`);
  console.log(`  - Rate limiting (global: 200/15min, API: 50/hr, Form: 5/hr)`);
  console.log(`  - Input sanitization`);
  console.log(`  - Honeypot protection`);
  console.log(`  - hCaptcha verification: ${HCAPTCHA_SECRET ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Feishu bot: ${FEISHU_APP_ID ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
  console.log(`Feishu webhook: /feishu/webhook`);
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
