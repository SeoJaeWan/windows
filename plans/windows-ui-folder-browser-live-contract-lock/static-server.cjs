// static-server.cjs — simple static file server for storybook-static
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];
const port = parseInt(process.argv[3]) || 6019;

if (!dir) { console.error('Usage: node static-server.cjs <dir> <port>'); process.exit(1); }

http.createServer((req, res) => {
  let filePath = path.join(dir, req.url.split('?')[0]);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.mjs': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.json': 'application/json',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
      '.ico': 'image/x-icon',
      '.txt': 'text/plain',
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
  }
}).listen(port, () => {
  process.stdout.write('SERVER_READY\n');
});
