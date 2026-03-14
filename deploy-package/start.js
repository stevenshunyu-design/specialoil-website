// 启动调试脚本
console.log('========================================');
console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Environment variables check:');
console.log('- PORT:', process.env.PORT || 'not set');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'set' : 'NOT SET');
console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'set' : 'NOT SET');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'set' : 'NOT SET');
console.log('========================================');

// 动态导入主服务器
import('./server.production.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
