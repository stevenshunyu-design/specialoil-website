#!/usr/bin/env node
// Hostinger 启动入口文件
console.log('========================================');
console.log('Server starting...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Platform:', process.platform);
console.log('========================================');

// 检查关键环境变量
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'RESEND_API_KEY',
  'FROM_EMAIL'
];

console.log('Checking environment variables...');
const missingVars = [];
for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: NOT SET`);
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  }
}

if (missingVars.length > 0) {
  console.error('⚠️ Missing required environment variables:', missingVars.join(', '));
  // 不退出，继续尝试启动
}

console.log('========================================');
console.log('Loading server.production.js...');

// 动态导入 ESM 模块
import('./server.production.js').catch(error => {
  console.error('Failed to start server:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
});
