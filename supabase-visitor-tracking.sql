-- 访客追踪数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 访客表 - 存储唯一访客信息
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(64) UNIQUE NOT NULL,  -- 浏览器指纹或唯一标识
  ip_address VARCHAR(45),                   -- IPv4 或 IPv6
  country VARCHAR(100),                     -- 国家
  country_code VARCHAR(10),                 -- 国家代码
  region VARCHAR(100),                      -- 地区/省份
  city VARCHAR(100),                        -- 城市
  latitude DECIMAL(10, 8),                  -- 纬度
  longitude DECIMAL(11, 8),                 -- 经度
  timezone VARCHAR(50),                     -- 时区
  browser VARCHAR(100),                     -- 浏览器
  browser_version VARCHAR(50),              -- 浏览器版本
  os VARCHAR(100),                          -- 操作系统
  os_version VARCHAR(50),                   -- 操作系统版本
  device_type VARCHAR(20),                  -- 设备类型: desktop, mobile, tablet
  screen_resolution VARCHAR(20),            -- 屏幕分辨率
  language VARCHAR(20),                     -- 浏览器语言
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 首次访问时间
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),   -- 最后访问时间
  visit_count INTEGER DEFAULT 1,            -- 访问次数
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 页面访问记录表
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(64) NOT NULL,          -- 关联访客
  session_id VARCHAR(64),                   -- 会话ID
  page_url VARCHAR(500) NOT NULL,           -- 页面URL
  page_path VARCHAR(500),                   -- 页面路径
  page_title VARCHAR(500),                  -- 页面标题
  referrer VARCHAR(500),                    -- 来源页面
  referrer_domain VARCHAR(255),             -- 来源域名
  traffic_source VARCHAR(50),               -- 流量来源类型: direct, organic, referral, social, email
  utm_source VARCHAR(100),                  -- UTM 来源
  utm_medium VARCHAR(100),                  -- UTM 媒介
  utm_campaign VARCHAR(200),                -- UTM 活动
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 进入时间
  exit_time TIMESTAMP WITH TIME ZONE,       -- 离开时间
  duration_seconds INTEGER,                 -- 停留时长(秒)
  scroll_depth INTEGER,                     -- 滚动深度百分比
  is_bounce BOOLEAN DEFAULT false,          -- 是否跳出
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 在线会话表 - 实时在线访客
CREATE TABLE IF NOT EXISTS active_sessions (
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

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON visitors(first_visit_at);

CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_entry_time ON page_views(entry_time);
CREATE INDEX IF NOT EXISTS idx_page_views_traffic_source ON page_views(traffic_source);

CREATE INDEX IF NOT EXISTS idx_active_sessions_visitor_id ON active_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_activity ON active_sessions(last_activity_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_visitors_updated_at 
    BEFORE UPDATE ON visitors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5分钟无活动视为离线，自动清理
-- 可以通过定时任务或应用逻辑处理

-- 添加注释
COMMENT ON TABLE visitors IS '访客信息表 - 存储唯一访客的基本信息';
COMMENT ON TABLE page_views IS '页面访问记录表 - 记录每次页面访问的详细信息';
COMMENT ON TABLE active_sessions IS '在线会话表 - 实时追踪在线访客';
