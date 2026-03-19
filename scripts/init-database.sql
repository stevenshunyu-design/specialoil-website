-- =====================================================
-- 完整数据库初始化脚本
-- 包含外部 API 所需的所有表
-- =====================================================

-- 1. 创建 blog_posts 表（如果不存在）
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Industry News',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  author TEXT,
  author_id VARCHAR(50),
  review_status TEXT DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  rejection_reason TEXT,
  source_url VARCHAR(500),
  publishedAt TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_review_status ON blog_posts(review_status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- 2. 创建 authors 表（如果不存在）
CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(50) PRIMARY KEY,
  
  -- 基本信息
  name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  
  -- 账户信息
  username TEXT UNIQUE,
  password_hash TEXT,
  
  -- 创作信息
  expertise_areas TEXT[],
  bio TEXT,
  avatar_url TEXT,
  
  -- 统计数据
  articles_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  
  -- 状态
  status TEXT NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_status ON authors(status);

-- 3. 创建 email_verification_codes 表（如果不存在）
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'register',
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_email ON email_verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_code ON email_verification_codes(code);

-- 4. 为 blog_posts 添加 source_url 索引（用于去重）
CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url 
ON blog_posts(source_url) 
WHERE source_url IS NOT NULL;

-- 5. 创建 AI 作者账号
INSERT INTO authors (id, email, display_name, bio, status, created_at)
VALUES (
  '18d5e355-e4ea-411b-bfc5-c42beff90d1d', 
  'ai@cnspecialtyoils.com', 
  'Steven CN-SpecLube Chain', 
  'Senior editor specializing in specialty oils industry, covering market trends, technical insights, and supply chain dynamics for transformer oil, rubber process oil, and lubricants.', 
  'active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  display_name = 'Steven CN-SpecLube Chain',
  bio = 'Senior editor specializing in specialty oils industry, covering market trends, technical insights, and supply chain dynamics for transformer oil, rubber process oil, and lubricants.',
  status = 'active',
  updated_at = NOW();

-- 6. 添加外键约束（如果 authors 表已存在数据）
DO $$ 
BEGIN
  -- 检查外键是否存在，不存在则添加
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_blog_posts_author_id' 
    AND table_name = 'blog_posts'
  ) THEN
    ALTER TABLE blog_posts 
    ADD CONSTRAINT fk_blog_posts_author_id 
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 7. 启用 Row Level Security（可选）
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- 8. 验证结果
SELECT 'blog_posts' as table_name, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'authors' as table_name, COUNT(*) as count FROM authors
UNION ALL
SELECT 'email_verification_codes' as table_name, COUNT(*) as count FROM email_verification_codes;

-- 显示 AI 作者信息
SELECT id, display_name, bio, status FROM authors WHERE id = '18d5e355-e4ea-411b-bfc5-c42beff90d1d';
