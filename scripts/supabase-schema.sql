-- =====================================================
-- CN-SpecLube Chain 完整数据库 Schema
-- 在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 1. 创建 authors 作者表
CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  expertise_areas TEXT[],
  bio TEXT,
  avatar_url TEXT,
  articles_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 authors 索引
CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_status ON authors(status);

-- 如果表已存在且有 NOT NULL 约束，移除约束
ALTER TABLE authors ALTER COLUMN password_hash DROP NOT NULL;

-- 2. 创建 blog_posts 博客文章表
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Industry News',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  author TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  review_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'needs_revision'
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  rejection_reason TEXT,
  revision_suggestion TEXT, -- 打回修改建议
  source_url VARCHAR(500),
  publishedAt TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0
);

-- 创建 blog_posts 索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_review_status ON blog_posts(review_status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url ON blog_posts(source_url) WHERE source_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- 3. 创建 author_applications 作者申请表
CREATE TABLE IF NOT EXISTS author_applications (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  expertise_areas TEXT[],
  bio TEXT,
  sample_article_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_author_applications_status ON author_applications(status);
CREATE INDEX IF NOT EXISTS idx_author_applications_email ON author_applications(email);

-- 4. 创建 newsletter_subscribers 订阅用户表
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id VARCHAR(50) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'unsubscribed'
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- 5. 创建 visitor_tracking 访客追踪表
CREATE TABLE IF NOT EXISTS visitor_tracking (
  id VARCHAR(50) PRIMARY KEY,
  visitor_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  landing_page TEXT,
  visit_count INTEGER DEFAULT 1,
  first_visit_at TIMESTAMPTZ DEFAULT NOW(),
  last_visit_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_tracking_visitor_id ON visitor_tracking(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_last_visit ON visitor_tracking(last_visit_at DESC);

-- 6. 创建 chat_sessions 聊天会话表
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  visitor_id TEXT,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  customer_no TEXT,
  status TEXT DEFAULT 'active',
  feishu_root_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- 7. 创建 chat_messages 聊天消息表
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- 'visitor' 或 'admin'
  sender_name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 8. 创建 inquiries 询盘表
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_category TEXT,
  port_of_destination TEXT,
  estimated_quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- =====================================================
-- 启用 Row Level Security (RLS)
-- =====================================================

-- blog_posts: 允许公开读取已审核通过的文章
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read approved posts" ON blog_posts
  FOR SELECT USING (review_status = 'approved');

CREATE POLICY "Allow all operations for service role" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');

-- authors: 允许公开查看作者信息
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active authors" ON authors
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow all operations for service role" ON authors
  FOR ALL USING (auth.role() = 'service_role');

-- chat_sessions 和 chat_messages: 允许匿名访问
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to chat_sessions" ON chat_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to chat_messages" ON chat_messages
  FOR ALL USING (true);

-- newsletter_subscribers: 允许插入新订阅
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all operations for service role" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- inquiries: 允许插入新询盘
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all operations for service role" ON inquiries
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 创建 AI 作者账号
-- =====================================================

INSERT INTO authors (id, email, display_name, name, username, bio, status, created_at)
VALUES (
  '18d5e355-e4ea-411b-bfc5-c42beff90d1d', 
  'ai@cnspecialtyoils.com', 
  'Steven CN-SpecLube Chain',
  'Steven',
  'ai_author',
  'Senior editor specializing in specialty oils industry, covering market trends, technical insights, and supply chain dynamics for transformer oil, rubber process oil, and lubricants.', 
  'active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  display_name = 'Steven CN-SpecLube Chain',
  username = 'ai_author',
  bio = 'Senior editor specializing in specialty oils industry, covering market trends, technical insights, and supply chain dynamics for transformer oil, rubber process oil, and lubricants.',
  status = 'active',
  updated_at = NOW();

-- =====================================================
-- 刷新 Schema Cache (重要！)
-- =====================================================

NOTIFY pgrst, 'reload schema';

-- =====================================================
-- 验证创建结果
-- =====================================================

SELECT 'Tables created successfully!' as message;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
