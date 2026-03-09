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
