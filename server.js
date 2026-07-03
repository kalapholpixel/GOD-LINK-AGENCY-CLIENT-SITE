const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.php': 'text/plain; charset=utf-8'
};

function isPathInsideRoot(targetPath) {
  const normalizedRoot = path.resolve(ROOT) + path.sep;
  const normalizedTarget = path.resolve(targetPath);
  return normalizedTarget.startsWith(normalizedRoot) || normalizedTarget === path.resolve(ROOT);
}

function resolveRequestedPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname || '/');
  const cleanPath = decoded === '/' ? '/index.html' : decoded;
  const fullPath = path.join(ROOT, cleanPath);

  if (!isPathInsideRoot(fullPath)) {
    return null;
  }

  return fullPath;
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const requested = resolveRequestedPath(url.pathname);

  if (!requested) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(requested, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(res, requested);
      return;
    }

    if (!err && stats.isDirectory()) {
      const indexPath = path.join(requested, 'index.html');
      sendFile(res, indexPath);
      return;
    }

    // Fallback to homepage for unknown routes.
    sendFile(res, path.join(ROOT, 'index.html'));
  });
});

server.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
