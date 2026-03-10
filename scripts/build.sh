#!/bin/bash

# 安装依赖
pnpm install

# 构建前端
npx vite build

# 构建后端服务器 (CommonJS 格式)
npx esbuild server.ts --outfile=server.production.cjs --platform=node --format=cjs --bundle --external:express --external:cors --external:helmet --external:express-rate-limit --external:@supabase/supabase-js --external:resend --external:ws --external:lru-cache --external:socket.io
