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

# 启动 API 服务器（后台运行，端口3001）
npx tsx server.ts &

# 启动 Vite 开发服务器（端口5000，预览系统期望的端口）
npx vite --port 5000 --host
