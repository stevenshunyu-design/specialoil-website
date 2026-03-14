-- =========================================
-- 博客作者注册与审核系统数据库表
-- =========================================

-- 1. 邮箱验证码表
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'register', -- 'register', 'reset_password', etc.
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_email ON email_verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_code ON email_verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_expires_at ON email_verification_codes(expires_at);

-- 2. 作者申请表
CREATE TABLE IF NOT EXISTS author_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 基本信息
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  
  -- 创作方向
  expertise_areas TEXT[], -- 专业领域数组，如 ['Transformer Oil', 'Lubricants']
  bio TEXT, -- 个人简介
  
  -- 账户信息（审核通过后设置）
  username TEXT UNIQUE,
  password_hash TEXT,
  
  -- 审核状态
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT, -- 管理员邮箱
  rejection_reason TEXT,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_author_applications_status ON author_applications(status);
CREATE INDEX IF NOT EXISTS idx_author_applications_email ON author_applications(email);
CREATE INDEX IF NOT EXISTS idx_author_applications_created_at ON author_applications(created_at DESC);

-- 3. 作者表（审核通过后的作者信息）
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 关联申请
  application_id UUID REFERENCES author_applications(id),
  
  -- 基本信息
  name TEXT NOT NULL,
  display_name TEXT, -- 显示名称，可与真实姓名不同
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  
  -- 账户信息
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  
  -- 创作信息
  expertise_areas TEXT[],
  bio TEXT,
  avatar_url TEXT,
  
  -- 统计数据
  articles_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  
  -- 状态
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  last_login_at TIMESTAMPTZ,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加 display_name 列（如果表已存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authors' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE authors ADD COLUMN display_name TEXT;
  END IF;
END $$;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_username ON authors(username);
CREATE INDEX IF NOT EXISTS idx_authors_status ON authors(status);

-- 4. 文章表扩展（添加作者关联和审核状态）
-- 注意：如果 blog_posts 表已存在，需要使用 ALTER TABLE

-- 先检查是否存在 blog_posts 表，如果存在则添加列
DO $$ 
BEGIN
  -- 添加 author_id 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_id UUID REFERENCES authors(id);
  END IF;
  
  -- 添加审核状态列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'review_status'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN review_status TEXT DEFAULT 'pending';
    -- 'pending', 'approved', 'rejected'
  END IF;
  
  -- 添加审核信息列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN reviewed_by TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN rejection_reason TEXT;
  END IF;
  
  -- 添加统计列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'like_count'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN like_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_review_status ON blog_posts(review_status);

-- 5. 启用 Row Level Security
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- 允许匿名访问（验证码和申请需要匿名提交）
CREATE POLICY "Allow anonymous access to email_verification_codes" ON email_verification_codes
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to author_applications" ON author_applications
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to authors" ON authors
  FOR ALL USING (true);

-- 刷新 schema cache
NOTIFY pgrst, 'reload schema';

-- =========================================
-- 示例数据（可选）
-- =========================================

-- 插入测试验证码（可选）
-- INSERT INTO email_verification_codes (email, code, type, expires_at)
-- VALUES ('test@example.com', '123456', 'register', NOW() + INTERVAL '10 minutes');
