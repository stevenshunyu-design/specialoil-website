#!/bin/bash

# 安装依赖
pnpm install

# 启动 API 服务器（后台运行）
npx tsx server.ts &

# 启动 Vite 开发服务器
npx vite --port 5000 --host
