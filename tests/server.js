const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function safePath(urlPath) {
  const clean = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relative = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  return file.startsWith(root) ? file : null;
}

const server = http.createServer((req, res) => {
  const file = safePath(req.url);
  if (!file) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(file, (err, stat) => {
    let target = file;
    if (!err && stat.isDirectory()) target = path.join(file, 'index.html');

    fs.readFile(target, (readErr, data) => {
      if (readErr) {
        res.writeHead(404);
        return res.end('Not found');
      }
      res.writeHead(200, {
        'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(data);
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`DK SHOP UI test server: http://127.0.0.1:${port}`);
});
