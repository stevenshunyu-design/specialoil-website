# 手动上传 Hostinger 完整指南

## 步骤一：在 Hostinger 创建 Node.js 应用

1. 登录 [Hostinger 控制面板](https://hpanel.hostinger.com)
2. 在您的网站列表中，点击 **cnspecialtyoils.com**
3. 点击左侧菜单 **网站** → **高级** → **Node.js 应用**
4. 或直接点击 **添加网站** → **Node.js 网络应用程序**

## 步骤二：配置 Node.js 应用

创建应用时填写：

| 设置项 | 值 |
|--------|-----|
| 应用名称 | `specialoil` |
| 域名 | `cnspecialtyoils.com` |
| Node.js 版本 | 18.x 或更高 |
| 入口文件 | `server.production.js` |
| 启动命令 | `npm start` |

## 步骤三：上传文件

### 方法A：使用 Hostinger 文件管理器

1. 在 Hostinger 控制面板，点击 **文件** → **文件管理器**
2. 导航到 Node.js 应用目录（通常是 `domains/cnspecialtyoils.com/app/` 或类似路径）
3. 点击 **上传文件**
4. 上传以下文件：

```
app/
├── dist/                      # 前端构建产物（整个文件夹）
│   ├── index.html
│   ├── assets/
│   └── partners/
├── server.production.js       # 服务器入口
├── package.json               # 依赖配置
└── .env                       # 环境变量（需要创建）
```

### 方法B：使用 FTP 上传

1. 在 Hostinger 控制面板，找到 **FTP 账户**
2. 使用 FTP 客户端（如 FileZilla）连接
3. 上传文件到 Node.js 应用目录

## 步骤四：创建环境变量文件

在 Node.js 应用目录创建 `.env` 文件：

```env
# Supabase 数据库配置（必填）
SUPABASE_URL=https://你的项目ID.supabase.co
SUPABASE_ANON_KEY=你的supabase匿名密钥

# 飞书通知（可选）
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/你的webhook

# 站点配置
SITE_URL=https://cnspecialtyoils.com
NODE_ENV=production
```

**或者在 Hostinger 控制面板配置环境变量：**

1. 进入 Node.js 应用设置
2. 找到 **环境变量** 部分
3. 逐个添加变量

## 步骤五：安装依赖并启动

1. 在 Node.js 应用页面，点击 **安装依赖** 或 **Install Dependencies**
2. 等待安装完成（可能需要几分钟）
3. 点击 **重启** 或 **Start**

## 步骤六：验证部署

访问 `https://cnspecialtyoils.com`，检查网站是否正常显示。

---

## 文件内容参考

### package.json
```json
{
  "name": "specialoil",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.production.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  }
}
```

---

## 常见问题

### Q: 找不到 Node.js 应用选项？
A: 确保您购买的是 Business Web Hosting 或更高级别计划。在控制面板搜索 "Node.js" 或查看 "高级" 选项。

### Q: 应用启动失败？
A: 
1. 检查入口文件是否正确设为 `server.production.js`
2. 查看 Hostinger 提供的错误日志
3. 确认环境变量已正确配置

### Q: 页面显示空白？
A: 
1. 确认 `dist` 文件夹已完整上传
2. 检查服务器日志是否有错误

### Q: API 不工作？
A: 
1. 确认 Supabase 环境变量已配置
2. 检查 Supabase 项目是否正常运行

---

## 获取 Supabase 密钥

如果您还没有 Supabase 密钥：

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目或选择现有项目
3. 进入 **Settings** → **API**
4. 复制：
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
