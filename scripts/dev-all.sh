#!/bin/bash

# 安装依赖
pnpm install

# 启动 API 服务器和前端开发服务器
npx concurrently "npx tsx server.ts" "npx vite --port 5000 --host"
