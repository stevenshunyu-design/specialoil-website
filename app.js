#!/usr/bin/env node
/**
 * Passenger 兼容入口文件
 * Hostinger 使用 Passenger 运行 Node.js 应用
 */

// 设置环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// 加载 dotenv
import('dotenv/config').then(() => {
  // 动态导入主服务器
  import('./server.production.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Failed to load dotenv:', err);
  // 即使 dotenv 加载失败，也尝试启动服务器
  import('./server.production.js').catch(e => {
    console.error('Failed to start server:', e);
    process.exit(1);
  });
});
