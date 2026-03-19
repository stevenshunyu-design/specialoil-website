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

# 设置端口为 5000（预览系统期望的端口）
export PORT=5000

# 启动服务器（直接使用预编译的 dist 文件）
npx tsx server.ts
