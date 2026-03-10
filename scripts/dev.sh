#!/bin/bash

# 加载环境变量
set -a
source ${COZE_WORKSPACE_PATH}/.env 2>/dev/null || true
set +a

# 显式导出飞书相关变量
export FEISHU_APP_ID="${FEISHU_CHAT_APP_ID}"
export FEISHU_APP_SECRET="${FEISHU_CHAT_APP_SECRET}"
export FEISHU_CHAT_ID="${FEISHU_CHAT_ID}"

# 安装依赖
pnpm install

# 设置端口为5000
export PORT=5000

# 启动 API 服务器（后台运行）
npx tsx server.ts &

# 启动 Vite 开发服务器（使用不同端口避免冲突）
npx vite --port 5001 --host
