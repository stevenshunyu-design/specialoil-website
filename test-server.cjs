// 最小化测试服务器 - 用于验证 Hostinger Node.js 环境
const http = require('http');

const PORT = process.env.PORT || 5000;

console.log('========================================');
console.log('Minimal Test Server Starting...');
console.log('Node version:', process.version);
console.log('PORT:', PORT);
console.log('Current directory:', process.cwd());
console.log('========================================');

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
    <head><title>Test Server</title></head>
    <body>
      <h1>✅ Server is running!</h1>
      <p>Node version: ${process.version}</p>
      <p>PORT: ${PORT}</p>
      <p>Time: ${new Date().toISOString()}</p>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on http://0.0.0.0:${PORT}`);
  console.log('Test with: curl http://localhost:' + PORT);
});
