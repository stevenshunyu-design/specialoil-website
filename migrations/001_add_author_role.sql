-- =====================================================
-- 数据库迁移脚本：添加作者角色字段
-- 执行环境：生产环境 Supabase PostgreSQL
-- 创建时间：2024-03-24
-- =====================================================

-- 1. 添加 role 字段到 authors 表（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'authors' AND column_name = 'role'
    ) THEN
        ALTER TABLE authors ADD COLUMN role VARCHAR(20) DEFAULT 'author';
        RAISE NOTICE 'Added role column to authors table';
    ELSE
        RAISE NOTICE 'role column already exists in authors table';
    END IF;
END $$;

-- 2. 为 role 字段添加注释
COMMENT ON COLUMN authors.role IS '作者角色：admin(管理员) 或 author(普通作者)';

-- 3. 更新现有作者的 role（根据邮箱判断管理员）
-- 将指定邮箱的作者设置为管理员
UPDATE authors 
SET role = 'admin' 
WHERE email IN ('kdwelly@163.com', 'admin@cnspecialtyoils.com');

-- 4. 确保所有其他作者的 role 为 'author'
UPDATE authors 
SET role = 'author' 
WHERE role IS NULL OR role = '';

-- 5. 添加 NOT NULL 约束（确保所有记录都有角色）
ALTER TABLE authors ALTER COLUMN role SET NOT NULL;

-- 6. 添加检查约束（只允许 admin 或 author）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'authors_role_check'
    ) THEN
        ALTER TABLE authors ADD CONSTRAINT authors_role_check 
        CHECK (role IN ('admin', 'author'));
        RAISE NOTICE 'Added role check constraint';
    END IF;
END $$;

-- 7. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_authors_role ON authors(role);

-- 8. 验证迁移结果
SELECT 
    id,
    name,
    email,
    username,
    role,
    status,
    created_at
FROM authors
ORDER BY created_at DESC;

-- =====================================================
-- 迁移完成提示
-- =====================================================
-- 执行此脚本后，authors 表将包含 role 字段
-- 默认角色为 'author'，指定管理员邮箱将设置为 'admin'
-- =====================================================
