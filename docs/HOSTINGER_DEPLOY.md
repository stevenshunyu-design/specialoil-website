# Hostinger 部署指南

## 前置要求
- Hostinger VPS 或云主机计划（支持 Node.js）
- SSH 访问权限

## 一、服务器环境配置

### 1. SSH 连接到服务器
```bash
ssh username@your-server-ip
```

### 2. 安装 Node.js 24
```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. 安装 pnpm
```bash
npm install -g pnpm
```

### 4. 安装 PM2（进程管理器）
```bash
sudo npm install -g pm2
```

## 二、部署应用

### 1. 克隆或上传代码
```bash
# 方式一：从 Git 克隆
git clone https://github.com/your-username/your-repo.git /var/www/specialoil

# 方式二：使用 SFTP 上传代码到 /var/www/specialoil
```

### 2. 安装依赖并构建
```bash
cd /var/www/specialoil
pnpm install
pnpm run build
```

### 3. 配置环境变量

创建 `.env` 文件：
```bash
nano /var/www/specialoil/.env
```

添加以下内容：
```env
# Supabase 数据库配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# 飞书 Webhook（可选）
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx

# 站点 URL
SITE_URL=https://yourdomain.com

# API 端口
API_PORT=3001
NODE_ENV=production
```

### 4. 创建启动脚本

创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [
    {
      name: 'specialoil-api',
      script: 'npx',
      args: 'tsx server.ts',
      cwd: '/var/www/specialoil',
      env: {
        NODE_ENV: 'production',
        API_PORT: 3001
      }
    },
    {
      name: 'specialoil-web',
      script: 'npx',
      args: 'serve dist -l 5000',
      cwd: '/var/www/specialoil',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### 5. 使用 PM2 启动服务
```bash
cd /var/www/specialoil
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 三、Nginx 反向代理配置

### 1. 安装 Nginx
```bash
sudo apt install nginx
```

### 2. 创建站点配置
```bash
sudo nano /etc/nginx/sites-available/specialoil
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 启用站点并重启 Nginx
```bash
sudo ln -s /etc/nginx/sites-available/specialoil /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 四、配置 SSL（HTTPS）

使用 Let's Encrypt 免费证书：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 五、常用命令

### PM2 进程管理
```bash
pm2 status              # 查看进程状态
pm2 logs                # 查看日志
pm2 restart all         # 重启所有进程
pm2 stop all            # 停止所有进程
pm2 restart specialoil-api  # 重启 API 服务
```

### 更新部署
```bash
cd /var/www/specialoil
git pull                # 拉取最新代码
pnpm install            # 更新依赖
pnpm run build          # 重新构建
pm2 restart all         # 重启服务
```

---

## 方案B：Hostinger 共享主机（静态部署）

如果使用共享主机，需要分离部署：

### 前端部署到 Hostinger
1. 本地执行 `pnpm run build`
2. 将 `dist` 目录内容上传到 `public_html`

### 后端部署到其他服务
推荐使用以下平台托管后端：
- **Vercel** - 免费
- **Railway** - 每月 $5 起
- **Render** - 免费
- **Fly.io** - 有免费额度

---

## 环境变量清单

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `SUPABASE_URL` | ✅ | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 |
| `FEISHU_WEBHOOK_URL` | ❌ | 飞书机器人 Webhook |
| `SITE_URL` | ❌ | 网站域名（用于通知链接） |
| `API_PORT` | ❌ | API 端口，默认 3001 |
