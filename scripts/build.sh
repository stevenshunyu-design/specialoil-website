#!/bin/bash

# 设置环境变量
export NODE_ENV=production

# 检测包管理器
if command -v pnpm &> /dev/null; then
  echo "Using pnpm..."
  pnpm install
else
  echo "pnpm not found, using npm..."
  npm install
fi

# 修复 esbuild 权限问题
if [ -f "node_modules/.bin/esbuild" ]; then
  chmod +x node_modules/.bin/esbuild 2>/dev/null || true
fi

# 构建前端
echo "Building frontend..."
npx vite build

# 构建后端生产文件
echo "Building backend production file..."
npx esbuild server.ts --bundle --platform=node --target=node20 --format=esm --outfile=server.production.js --external:@larksuiteoapi/node-sdk --external:@supabase/supabase-js --external:express --external:cors --external:dotenv --external:socket.io --external:helmet --external:express-rate-limit --external:multer --external:coze-coding-dev-sdk

echo "Build complete!"
