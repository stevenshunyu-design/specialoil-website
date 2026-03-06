# 项目部署指南
本指南将详细说明如何生成可以直接部署的静态文件，并将其部署到Hostinger等托管平台，同时提供常见问题的解决方案。

## 生成静态文件

这个项目使用Vite构建工具，可以通过简单的命令生成完整的静态文件。以下是具体步骤：

### 前提条件

在开始之前，请确保您的计算机上已经安装了以下软件：

- **Node.js** (推荐版本 16.x 或更高)
- **npm** 或 **pnpm** 包管理器

### 生成静态文件步骤

1. **安装依赖**

   打开终端，导航到项目根目录，然后运行以下命令之一安装依赖：

   使用 npm:
   ```bash
   npm install
   ```

   或使用 pnpm:
   ```bash
   pnpm install
   ```

2. **生成静态文件**

   依赖安装完成后，运行以下命令生成生产环境的静态文件：

   使用 npm:
   ```bash
   npm run build:deploy
   ```

   或使用 pnpm:
   ```bash
   pnpm build:deploy
   ```

   这个命令会执行以下操作：
   - 删除旧的 `dist` 文件夹（如果存在）
   - 自动修复可能的 esbuild 执行权限问题
   - 使用 Vite 构建工具将源代码编译打包到 `dist` 目录
   - 直接在根目录生成所有静态文件，便于部署

3. **准备部署文件**

   构建完成后，您需要使用 `dist` 目录中的所有文件进行部署。这个目录包含了所有可以直接部署的静态文件，包括：
   - `index.html` - 主HTML文件
   - `assets/` 目录 - 包含所有编译后的CSS、JavaScript和图像等资源

## 部署到Hostinger

根据您之前的需求，这里提供详细的Hostinger部署步骤：

1. **选择正确的部署选项**

   在Hostinger控制面板中，您应该选择 **"Custom PHP/HTML website"** 选项来部署这个React应用，因为构建后的文件是纯静态的HTML、CSS和JavaScript文件。

2. **上传文件到Hostinger**

   有两种方式可以上传文件：

   **方法1：使用Hostinger文件管理器**
   - 登录到您的Hostinger账户
   - 选择您要部署网站的托管方案
   - 找到并打开"文件管理器"功能
   - 导航到网站的根目录（通常是 `public_html` 目录）
   - 将 `dist` 目录中的所有文件上传到这个根目录
   - 确保 `index.html` 文件位于根目录，而不是嵌套在子目录中

   **方法2：使用FTP客户端**
   - 使用Hostinger提供的FTP凭据连接到您的主机
   - 导航到 `public_html` 目录
   - 将 `dist` 目录中的所有文件上传到这个目录

3. **验证部署**

   上传完成后，您可以通过访问您的域名来验证网站是否成功部署。如果一切配置正确，您应该能够看到完整的网站内容。

## 修复常见部署问题

### 1. 构建失败 - EACCES 权限错误

**问题**：在Hostinger或其他平台构建时出现类似 `Error: The service was stopped: spawn ... esbuild EACCES` 的错误

**解决方法**：
- 项目已内置权限修复脚本，通常会自动解决此问题
- 如果在平台上构建，请尝试使用平台提供的Node.js版本
- 考虑在本地构建，然后上传构建好的`dist`目录

### 2. "Forbidden Access to this resource on the server is denied!" 错误

如果您在部署后遇到403 Forbidden错误，这通常是由以下原因造成的：

**文件和目录权限问题**
- 登录到Hostinger文件管理器
- 选择所有已上传的文件和目录
- 右键单击并选择"Change Permissions"或"更改权限"
- 将权限设置为：文件 - 644，目录 - 755
- 确保 `public_html` 目录的权限设置正确

### 3. 缺少适当的.htaccess文件（Apache服务器）

在您的网站根目录创建一个名为 `.htaccess` 的文件，内容如下：

```apache
# 启用RewriteEngine
RewriteEngine On

# 重写规则确保前端路由正常工作
RewriteBase /

# 如果文件或目录存在，直接提供
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# 否则重定向到index.html
RewriteRule ^(.*)$ index.html [L]

# 防止列出目录内容
Options -Indexes

# 设置正确的MIME类型
AddType application/javascript .js
AddType text/css .css
AddType image/png .png
AddType image/jpeg .jpg
AddType image/svg+xml .svg
```

### 4. Nginx服务器配置问题

如果您使用Nginx服务器，需要在服务器配置中添加以下代码：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 5. 单页应用(SPA)路由配置

React单页应用需要服务器配置来正确处理客户端路由。上述的.htaccess文件配置已经包含了必要的重写规则，确保所有请求都指向index.html，然后由React Router处理。

### 6. 检查Hostinger控制面板设置

- 确保您的域名已正确指向 `public_html` 目录
- 检查是否有任何安全设置阻止了访问
- 确认您的托管计划允许静态网站托管

## 自动部署脚本

这个项目已经包含了一个完整的自动部署脚本，可以帮助您简化部署流程。以下是使用方法：

### 使用自动部署脚本

1. **配置脚本**

   首先，需要修改 `src/deploy.sh` 文件中的配置变量，以匹配您的实际环境：

   ```bash
   REPO_URL="https://github.com/yourusername/your-repo-name.git" # 您的代码仓库地址
   BRANCH="main" # 要部署的分支
   REMOTE_USER="your-username" # 服务器用户名
   REMOTE_HOST="your-server.com" # 服务器地址
   REMOTE_PATH="/path/to/your/public_html" # 服务器上的部署路径
   ```

2. **添加执行权限**

   打开终端，导航到项目根目录，然后运行以下命令：

   ```bash
   chmod +x src/deploy.sh
   ```

3. **运行自动部署脚本**

   使用以下命令运行自动部署脚本：

   ```bash
   npm run deploy
   ```

   或直接运行：

   ```bash
   ./src/deploy.sh
   ```

### 脚本功能说明

自动部署脚本会执行以下操作：

1. **检查依赖**：确保您的系统上安装了必要的命令（git、npm/pnpm、ssh、scp）
2. **更新代码**：从指定的Git仓库拉取最新代码
3. **安装依赖**：使用npm或pnpm安装项目依赖
4. **构建项目**：使用Vite构建工具构建生产环境的静态文件
5. **创建.htaccess文件**：自动创建支持SPA路由的.htaccess文件
6. **部署到服务器**：使用scp将构建产物复制到您配置的服务器路径

## 注意事项

- 这个React应用构建后是纯静态前端应用，不需要Node.js服务器运行
- 使用自动部署脚本前，确保您已经设置了SSH密钥认证，这样不需要每次部署都输入密码
- 如果您的应用使用了React Router处理路由，自动部署脚本会自动创建必要的.htaccess文件
- 建议定期更新依赖并重新构建，以确保安全性和性能
- 如果问题仍然存在，请联系Hostinger支持团队，他们可以检查服务器端的具体配置问题

如需更多帮助，请联系技术支持或查阅相关文档。