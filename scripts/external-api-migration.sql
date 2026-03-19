-- =====================================================
-- 外部 API 支持数据库迁移脚本
-- 执行前请确保已备份数据库
-- =====================================================

-- 1. 为 blog_posts 表添加 source_url 字段（用于去重）
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS source_url VARCHAR(500);

-- 为 source_url 创建索引（提高查询效率）
CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url 
ON blog_posts(source_url) 
WHERE source_url IS NOT NULL;

-- 2. 创建或更新 AI 作者账号
INSERT INTO authors (id, email, display_name, bio, status, created_at)
VALUES (
  'ai_bot_001', 
  'ai@cnspecialtyoils.com', 
  'AI 编辑', 
  '自动采集行业资讯，由人工智能生成', 
  'active',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  display_name = 'AI 编辑',
  bio = '自动采集行业资讯，由人工智能生成',
  status = 'active',
  updated_at = NOW();

-- 3. 验证结果
SELECT id, display_name, status FROM authors WHERE id = 'ai_bot_001';
