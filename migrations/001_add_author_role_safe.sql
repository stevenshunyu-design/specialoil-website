-- =====================================================
-- 安全的数据库迁移脚本：添加作者角色字段
-- 执行环境：生产环境 Supabase PostgreSQL
-- 特点：检查约束是否已存在，避免重复执行错误
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
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_description
        WHERE objsubid = (
            SELECT attnum FROM pg_attribute
            WHERE attrelid = 'authors'::regclass AND attname = 'role'
        )
    ) THEN
        COMMENT ON COLUMN authors.role IS '作者角色：admin(管理员) 或 author(普通作者)';
        RAISE NOTICE 'Added comment to role column';
    END IF;
END $$;

-- 3. 更新现有作者的 role（根据邮箱判断管理员）
-- 安全方式：只有当 role 为 NULL 或为空时才设置
UPDATE authors 
SET role = 'admin' 
WHERE email IN ('kdwelly@163.com', 'admin@cnspecialtyoils.com')
  AND (role IS NULL OR role = '');

-- 4. 确保所有其他作者的 role 为 'author'
-- 安全方式：只有当 role 为 NULL 或为空时才设置
UPDATE authors 
SET role = 'author' 
WHERE (role IS NULL OR role = '');

-- 5. 添加 NOT NULL 约束（如果不存在）
DO $$
BEGIN
    -- 先检查 role 列是否可以设置为 NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'authors' 
          AND column_name = 'role'
          AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE authors ALTER COLUMN role SET NOT NULL;
        RAISE NOTICE 'Added NOT NULL constraint to role column';
    ELSE
        RAISE NOTICE 'role column already has NOT NULL constraint';
    END IF;
END $$;

-- 6. 添加检查约束（只允许 admin 或 author），如果不存在
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'authors_role_check'
    ) THEN
        ALTER TABLE authors ADD CONSTRAINT authors_role_check 
        CHECK (role IN ('admin', 'author'));
        RAISE NOTICE 'Added role check constraint';
    ELSE
        RAISE NOTICE 'authors_role_check constraint already exists';
    END IF;
END $$;

-- 7. 创建索引以提高查询性能（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_authors_role'
    ) THEN
        CREATE INDEX idx_authors_role ON authors(role);
        RAISE NOTICE 'Created index on role column';
    ELSE
        RAISE NOTICE 'Index idx_authors_role already exists';
    END IF;
END $$;

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
-- 迁移完成
-- =====================================================
