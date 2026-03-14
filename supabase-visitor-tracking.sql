-- =====================================================
-- 访客追踪数据库表结构 - 分步执行版
-- 在 Supabase SQL Editor 中逐步执行每个部分
-- =====================================================

-- ============================================
-- 第一步：创建表（先单独执行这部分）
-- ============================================

-- 1. 访客表 - 存储唯一访客信息
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(64) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  country VARCHAR(100),
  country_code VARCHAR(10),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone VARCHAR(50),
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  os VARCHAR(100),
  os_version VARCHAR(50),
  device_type VARCHAR(20),
  screen_resolution VARCHAR(20),
  language VARCHAR(20),
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 页面访问记录表
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64),
  page_url VARCHAR(500) NOT NULL,
  page_path VARCHAR(500),
  page_title VARCHAR(500),
  referrer VARCHAR(500),
  referrer_domain VARCHAR(255),
  traffic_source VARCHAR(50),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(200),
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  scroll_depth INTEGER,
  is_bounce BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 在线会话表 - 实时在线访客
CREATE TABLE active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  country VARCHAR(100),
  city VARCHAR(100),
  page_url VARCHAR(500),
  page_title VARCHAR(500),
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(20),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_views INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 第二步：创建索引（表创建成功后执行）
-- ============================================

CREATE INDEX idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX idx_visitors_ip ON visitors(ip_address);
CREATE INDEX idx_visitors_country ON visitors(country);
CREATE INDEX idx_visitors_first_visit ON visitors(first_visit_at);

CREATE INDEX idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_page_views_entry_time ON page_views(entry_time);
CREATE INDEX idx_page_views_traffic_source ON page_views(traffic_source);

CREATE INDEX idx_active_sessions_visitor_id ON active_sessions(visitor_id);
CREATE INDEX idx_active_sessions_last_activity ON active_sessions(last_activity_at);

-- ============================================
-- 第三步：创建触发器函数
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 第四步：创建触发器
-- ============================================

DROP TRIGGER IF EXISTS update_visitors_updated_at ON visitors;
CREATE TRIGGER update_visitors_updated_at 
    BEFORE UPDATE ON visitors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 第五步：配置 RLS (Row Level Security)
-- ============================================

-- 启用 RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入（追踪需要）
CREATE POLICY "Allow anonymous insert visitors" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert sessions" ON active_sessions FOR INSERT WITH CHECK (true);

-- 允许匿名更新
CREATE POLICY "Allow anonymous update visitors" ON visitors FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous update sessions" ON active_sessions FOR UPDATE USING (true);

-- 允许匿名删除（会话结束时）
CREATE POLICY "Allow anonymous delete sessions" ON active_sessions FOR DELETE USING (true);

-- 允许读取（后台查看统计）
CREATE POLICY "Allow read visitors" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow read page_views" ON page_views FOR SELECT USING (true);
CREATE POLICY "Allow read sessions" ON active_sessions FOR SELECT USING (true);

-- ============================================
-- 第六步：添加表注释
-- ============================================

COMMENT ON TABLE visitors IS '访客信息表 - 存储唯一访客的基本信息';
COMMENT ON TABLE page_views IS '页面访问记录表 - 记录每次页面访问的详细信息';
COMMENT ON TABLE active_sessions IS '在线会话表 - 实时追踪在线访客';
