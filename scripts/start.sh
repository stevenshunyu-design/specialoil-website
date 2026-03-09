#!/bin/bash

# 启动 API 服务器（后台运行）
npx tsx server.ts &

# 启动静态文件服务器
npx serve dist -l 5000
