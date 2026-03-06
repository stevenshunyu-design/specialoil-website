#!/bin/bash

# 自动部署脚本 - 用于将项目构建并部署到服务器
# 使用方法: npm run deploy 或 ./deploy.sh

# 配置变量 - 根据您的实际情况修改这些变量
REPO_URL="https://github.com/yourusername/your-repo-name.git" # 您的代码仓库地址
BRANCH="main" # 要部署的分支
REMOTE_USER="your-username" # 服务器用户名
REMOTE_HOST="your-server.com" # 服务器地址
REMOTE_PATH="/path/to/your/public_html" # 服务器上的部署路径

# 颜色定义
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # 无颜色

# 检查命令是否存在
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 显示错误并退出
error_exit() {
  echo -e "${RED}错误: $1${NC}"
  exit 1
}

# 检查必要的命令是否可用
check_dependencies() {
  echo -e "${YELLOW}检查必要的命令...${NC}"
  
  if ! command_exists git; then
    error_exit "未找到git命令，请先安装git"
  fi
  
  if ! command_exists npm && ! command_exists pnpm; then
    error_exit "未找到npm或pnpm命令，请先安装Node.js"
  fi
  
  if ! command_exists ssh; then
    error_exit "未找到ssh命令，请先安装ssh客户端"
  fi
  
  if ! command_exists scp; then
    error_exit "未找到scp命令，请先安装scp客户端"
  fi
  
  echo -e "${GREEN}所有必要的命令都已找到${NC}"
}

# 更新代码
update_code() {
  echo -e "${YELLOW}正在从仓库更新代码...${NC}"
  
  if [ -d ".git" ]; then
    # 已经有git仓库，执行pull操作
    git checkout $BRANCH || error_exit "切换到分支$BRANCH失败"
    git pull origin $BRANCH || error_exit "拉取最新代码失败"
  else
    # 没有git仓库，执行clone操作
    git clone -b $BRANCH $REPO_URL . || error_exit "克隆仓库失败"
  fi
  
  echo -e "${GREEN}代码更新完成${NC}"
}

# 安装依赖
install_dependencies() {
  echo -e "${YELLOW}正在安装依赖...${NC}"
  
  if command_exists pnpm; then
    pnpm install || error_exit "pnpm安装依赖失败"
  else
    npm install || error_exit "npm安装依赖失败"
  fi
  
  echo -e "${GREEN}依赖安装完成${NC}"
}

# 构建项目
build_project() {
  echo -e "${YELLOW}正在构建项目...${NC}"
  
  if command_exists pnpm; then
    pnpm run build:deploy || error_exit "pnpm构建失败"
  else
    npm run build:deploy || error_exit "npm构建失败"
  fi
  
  echo -e "${GREEN}项目构建完成${NC}"
}

# 部署到服务器
deploy_to_server() {
  echo -e "${YELLOW}正在部署到服务器...${NC}"
  
  # 检查dist目录是否存在
  if [ ! -d "dist" ]; then
    error_exit "构建输出目录dist不存在，请检查构建是否成功"
  fi
  
  # 使用scp将构建产物复制到服务器
  scp -r dist/* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH" || error_exit "部署到服务器失败"
  
  echo -e "${GREEN}项目部署成功${NC}"
}

# 创建.htaccess文件以支持SPA路由
create_htaccess() {
  echo -e "${YELLOW}正在创建.htaccess文件以支持SPA路由...${NC}"
  
  cat > dist/.htaccess << EOF
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
EOF
  
  echo -e "${GREEN}.htaccess文件创建完成${NC}"
}

# 主函数
main() {
  echo -e "${GREEN}======= 开始自动部署 =======${NC}"
  
  check_dependencies
  update_code
  install_dependencies
  build_project
  create_htaccess
  deploy_to_server
  
  echo -e "${GREEN}======= 自动部署完成 =======${NC}"
}

# 运行主函数
main