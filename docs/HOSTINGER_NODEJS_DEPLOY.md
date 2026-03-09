# Hostinger Business Web Hosting 部署指南

## 部署方式概览

Hostinger Business Web Hosting 支持 **Node.js 应用部署**，有两种方式：

| 方式 | 难度 | 推荐度 |
|------|------|--------|
| GitHub 自动部署 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| 手动上传文件 | ⭐⭐ 中等 | ⭐⭐⭐ |

---

## 方式一：GitHub 自动部署（推荐）

### 步骤1：准备 GitHub 仓库

1. 在 GitHub 创建新仓库（如 `specialoil-website`）
2. 将代码推送到仓库

### 步骤2：在 Hostinger 创建 Node.js 应用

1. 登录 Hostinger 控制面板
2. 点击 **添加网站** → **Node.js 网络应用程序**
3. 选择 **从 GitHub 部署**
4. 授权 Hostinger 访问您的 GitHub
5. 选择仓库 `specialoil-website`

### 步骤3：配置应用

在 Node.js 应用设置页面：

| 配置项 | 值 |
|--------|-----|
| **入口文件** | `server.production.js` |
| **运行时** | Node.js 18+ |
| **启动命令** | `npm start` |
| **自动部署** | 开启（每次 push 自动更新） |

### 步骤4：配置环境变量

在 Hostinger 的 **环境变量** 设置中添加：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=你的supabase-anon-key
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx
SITE_URL=https://cnspecialtyoils.com
NODE_ENV=production
```

### 步骤5：构建和部署

在 Hostinger 控制面板：
1. 点击 **构建应用** 或 **安装依赖**
2. 等待构建完成
3. 点击 **启动应用**

---

## 方式二：手动上传部署

### 步骤1：本地构建

在本地开发环境执行：

```bash
# 安装依赖
pnpm install

# 构建前端
pnpm run build
```

### 步骤2：准备部署文件

创建部署包，包含以下文件：

```
deploy-package/
├── dist/                    # 前端构建产物
│   ├── index.html
│   ├── assets/
│   └── ...
├── server.production.js     # 生产服务器
├── package.json             # 依赖配置
└── .env                     # 环境变量（上传后手动创建）
```

### 步骤3：上传到 Hostinger

1. 登录 Hostinger 控制面板
2. 点击 **添加网站** → **Node.js 网络应用程序**
3. 选择 **上传文件**
4. 使用文件管理器上传所有文件

### 步骤4：配置环境变量

通过 Hostinger 控制面板或 `.env` 文件配置：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=你的supabase-anon-key
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx
SITE_URL=https://cnspecialtyoils.com
NODE_ENV=production
```

### 步骤5：安装依赖并启动

在 Hostinger 控制面板：
1. 点击 **安装依赖**（npm install）
2. 点击 **启动应用**

---

## 飞书 Webhook 配置

### 获取 Webhook URL

1. 打开飞书 App，进入目标群聊
2. 点击右上角 **设置** ⚙️ → **群机器人**
3. 点击 **添加机器人** → **自定义机器人**
4. 输入名称：`网站询盘通知`
5. 复制生成的 **Webhook 地址**

格式如下：
```
https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 配置到 Hostinger

在环境变量中添加：
```
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx
```

---

## 域名绑定

### 自动绑定（推荐）

如果您的域名已在 Hostinger：
1. Node.js 应用会自动绑定到选择的域名
2. 直接访问 `https://cnspecialtyoils.com` 即可

### 手动绑定

1. 进入 **域名管理**
2. 添加域名到 Node.js 应用
3. 配置 DNS 指向 Hostinger

---

## 常见问题

### Q: 页面显示 502/503 错误？
A: 检查 Node.js 应用是否正常运行，查看日志排查错误。

### Q: API 返回 "Database not configured"？
A: 检查环境变量 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 是否正确设置。

### Q: 飞书通知不发送？
A: 确认 `FEISHU_WEBHOOK_URL` 已正确配置，检查应用日志。

### Q: 如何查看日志？
A: 在 Hostinger 控制面板的 Node.js 应用页面，点击 **日志** 或 **Logs**。

### Q: 如何更新代码？
A: 
- **GitHub 部署**：直接 push 到仓库，自动触发更新
- **手动上传**：重新上传文件并重启应用

---

## 必填环境变量清单

| 变量名 | 必填 | 说明 | 示例 |
|--------|:----:|------|------|
| `SUPABASE_URL` | ✅ | Supabase 项目 URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 | `eyJhbGciOiJIU...` |
| `FEISHU_WEBHOOK_URL` | ❌ | 飞书机器人通知 | `https://open.feishu.cn/...` |
| `SITE_URL` | ❌ | 网站正式域名 | `https://cnspecialtyoils.com` |
| `NODE_ENV` | ❌ | 运行环境 | `production` |

---

## 部署检查清单

- [ ] GitHub 仓库已创建并推送代码
- [ ] Hostinger Node.js 应用已创建
- [ ] 入口文件设置为 `server.production.js`
- [ ] 环境变量已配置（SUPABASE_URL, SUPABASE_ANON_KEY）
- [ ] 飞书 Webhook 已配置（可选）
- [ ] 域名已绑定
- [ ] 应用已启动并运行正常
- [ ] 访问网站测试询盘提交功能
- [ ] 验证数据保存到 Supabase
- [ ] 验证飞书通知收到（如配置）
