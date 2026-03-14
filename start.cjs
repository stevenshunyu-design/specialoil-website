// CommonJS 启动脚本
console.log('========================================');
console.log('Server starting...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Platform:', process.platform);
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('========================================');

// 检查关键环境变量
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'RESEND_API_KEY',
  'FROM_EMAIL'
];

console.log('Checking environment variables...');
for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  }
}

console.log('========================================');
console.log('Loading server.production.cjs...');

// 加载主服务器
try {
  require('./server.production.cjs');
} catch (error) {
  console.error('Failed to start server:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
}
