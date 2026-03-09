#!/bin/bash

# 准备 Hostinger 部署文件

echo "🚀 准备 Hostinger 部署文件..."

# 创建部署目录
rm -rf deploy-package
mkdir -p deploy-package

# 构建前端
echo "📦 构建前端..."
pnpm run build

# 复制文件
echo "📋 复制文件..."
cp -r dist deploy-package/
cp server.production.js deploy-package/
cp package.json deploy-package/

# 创建 .env 模板
echo "📝 创建环境变量模板..."
cat > deploy-package/.env.example << 'EOF'
# 必填 - Supabase 数据库配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# 可选 - 飞书通知
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx

# 站点配置
SITE_URL=https://cnspecialtyoils.com
NODE_ENV=production
EOF

# 创建 README
cat > deploy-package/README.txt << 'EOF'
====================================
  Hostinger 部署说明
====================================

1. 上传所有文件到 Hostinger Node.js 应用目录

2. 在 Hostinger 控制面板设置环境变量：
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - FEISHU_WEBHOOK_URL (可选)

3. 入口文件设置为: server.production.js

4. 点击"安装依赖"然后"启动应用"

详细文档: docs/HOSTINGER_NODEJS_DEPLOY.md
EOF

echo "✅ 部署文件准备完成！"
echo "📁 部署包位置: deploy-package/"
ls -la deploy-package/
