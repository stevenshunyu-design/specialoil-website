# GitHub 自动部署到 Hostinger 完整指南

## 流程概览

```
GitHub 仓库 → Hostinger 连接 → 自动构建部署 → 网站上线
```

---

## 第一步：创建 GitHub 仓库

### 1.1 在 GitHub 创建新仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 填写仓库信息：

| 设置项 | 值 |
|--------|-----|
| Repository name | `specialoil-website` |
| Description | 特种润滑油供应链平台 |
| Visibility | ✅ Public（公开，免费）或 Private（私有）|
| Add README | ❌ 不勾选（避免冲突）|

4. 点击 **Create repository**

### 1.2 推送代码到 GitHub

在本地项目目录执行：

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 特种润滑油网站"

# 设置主分支
git branch -M main

# 连接远程仓库（替换成你的用户名）
git remote add origin https://github.com/你的用户名/specialoil-website.git

# 推送代码
git push -u origin main
```

---

## 第二步：在 Hostinger 连接 GitHub

### 2.1 进入 Node.js 应用设置

1. 登录 [Hostinger 控制面板](https://hpanel.hostinger.com)
2. 点击网站 **cnspecialtyoils.com**
3. 在左侧菜单找到 **Node.js** 或搜索 "Node.js"
4. 点击 **创建应用** 或 **Create Application**

### 2.2 选择 GitHub 部署

在创建应用页面：

1. 选择部署方式：**从 GitHub 部署** (Deploy from GitHub)
2. 点击 **连接 GitHub** (Connect GitHub)
3. 授权 Hostinger 访问您的 GitHub
4. 选择仓库 `specialoil-website`

### 2.3 配置应用设置

| 配置项 | 值 |
|--------|-----|
| 分支 (Branch) | `main` |
| Node.js 版本 | `18.x` 或 `20.x` |
| 入口文件 (Entry point) | `server.production.js` |
| 启动命令 (Start command) | `npm start` |

### 2.4 保存并创建应用

点击 **创建** 或 **Create**

---

## 第三步：配置环境变量

在 Node.js 应用设置页面找到 **环境变量** (Environment Variables)：

### 添加以下变量：

```
SUPABASE_URL=https://你的项目ID.supabase.co
```

```
SUPABASE_ANON_KEY=你的supabase匿名密钥
```

```
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/你的webhook
```

```
SITE_URL=https://cnspecialtyoils.com
```

```
NODE_ENV=production
```

---

## 第四步：部署应用

### 4.1 首次部署

1. 点击 **安装依赖** (Install Dependencies)
2. 等待安装完成（约 2-5 分钟）
3. 点击 **构建应用** (Build) - 如果有这个选项
4. 点击 **启动应用** (Start)

### 4.2 查看日志

如果部署有问题，点击 **日志** (Logs) 查看错误信息。

---

## 第五步：自动部署设置

### 启用自动部署

1. 在 Node.js 应用设置中
2. 找到 **自动部署** (Auto Deploy) 选项
3. 开启：每次 push 到 GitHub 自动更新网站

### 更新网站流程

以后修改代码后，只需：

```bash
git add .
git commit -m "更新内容"
git push
```

Hostinger 会自动拉取代码并重新部署！

---

## 部署检查清单

| 检查项 | 状态 |
|--------|------|
| GitHub 仓库已创建 | ☐ |
| 代码已推送到 GitHub | ☐ |
| Hostinger 已连接 GitHub | ☐ |
| Node.js 应用已创建 | ☐ |
| 入口文件设为 `server.production.js` | ☐ |
| 环境变量已配置 | ☐ |
| 应用已启动 | ☐ |
| 网站可以访问 | ☐ |
| 询盘提交功能正常 | ☐ |
| 飞书通知正常（如配置）| ☐ |

---

## 常见问题

### Q: GitHub 授权失败？
A: 
1. 确保您已登录 GitHub
2. 尝试在 GitHub 设置中撤销 Hostinger 授权，重新授权
3. 检查 Hostinger 是否有权限访问该仓库

### Q: 找不到我的仓库？
A: 
1. 确保仓库已创建且不为空
2. 如果是私有仓库，确保在授权时选择了该仓库
3. 在 GitHub Settings → Applications 中检查 Hostinger 权限

### Q: 部署失败？
A: 
1. 检查 Node.js 版本是否为 18+
2. 检查入口文件是否正确
3. 查看部署日志找出具体错误

### Q: 网站显示 502 错误？
A: 
1. 检查应用是否正在运行
2. 检查环境变量是否正确配置
3. 查看应用日志

### Q: 如何查看应用日志？
A: 
在 Hostinger Node.js 应用页面点击 **Logs** 或 **日志**

---

## 获取 Supabase 密钥

如果您还没有 Supabase 密钥：

1. 访问 https://supabase.com
2. 注册/登录账号
3. 创建新项目
4. 进入项目 **Settings** → **API**
5. 复制：
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
