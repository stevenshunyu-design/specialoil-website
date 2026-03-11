#!/bin/bash

# 安装依赖
pnpm install

# 构建前端
npx vite build

# 构建后端生产文件
echo "Building backend production file..."
npx esbuild server.ts --bundle --platform=node --target=node20 --format=esm --outfile=server.production.js --external:@larksuiteoapi/node-sdk --external:@supabase/supabase-js --external:express --external:cors --external:dotenv --external:socket.io --external:helmet --external:express-rate-limit

echo "Build complete!"
