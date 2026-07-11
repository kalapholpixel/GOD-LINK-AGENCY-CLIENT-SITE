const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'hostinger-admin', 'data');
const UPLOADS_DIR = path.join(ROOT, 'images', 'uploads');
const SITE_CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const ADMIN_AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
const ADMIN_DASHBOARD_KEY = String(process.env.ADMIN_DASHBOARD_KEY || '').trim();
const ADMIN_BASIC_USER = String(process.env.ADMIN_BASIC_USER || 'admin').trim() || 'admin';

const sseClients = new Set();

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

const ALLOWED_UPLOAD_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
]);

const MIME_EXTENSION_MAP = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
  'video/quicktime': '.mov'
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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization,x-api-key'
  });
  res.end(JSON.stringify(payload));
}

function parseBasicAuthorization(headerValue) {
  if (!headerValue || typeof headerValue !== 'string') return null;
  const prefix = 'Basic ';
  if (!headerValue.startsWith(prefix)) return null;

  try {
    const decoded = Buffer.from(headerValue.slice(prefix.length), 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) return null;
    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch (error) {
    return null;
  }
}

function isAdminAuthorized(req) {
  const credentials = getAdminCredentials();

  // If no key is configured, authentication is disabled for local/dev convenience.
  if (!credentials.password) return true;

  const headerKey = String(req.headers['x-admin-key'] || '').trim();
  if (headerKey && headerKey === credentials.password) return true;

  const basic = parseBasicAuthorization(req.headers.authorization);
  if (!basic) return false;

  return basic.username === credentials.username && basic.password === credentials.password;
}

function requireAdminAuth(req, res, options) {
  if (isAdminAuthorized(req)) return true;

  const wantsJson = options?.json === true;
  if (wantsJson) {
    sendJson(res, 401, {
      ok: false,
      authRequired: true,
      error: 'Unauthorized'
    });
    return false;
  }

  res.writeHead(401, {
    'Content-Type': 'text/plain; charset=utf-8',
    'WWW-Authenticate': `Basic realm="God Link Admin", charset="UTF-8"`
  });
  res.end('Authentication required');
  return false;
}

function readJsonFile(filePath, fallbackValue) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallbackValue;
  }
}

function getAdminCredentials() {
  const fallback = {
    username: ADMIN_BASIC_USER,
    password: ADMIN_DASHBOARD_KEY
  };

  const stored = readJsonFile(ADMIN_AUTH_FILE, fallback);
  const username = String(stored?.username || fallback.username || 'admin').trim() || 'admin';
  const password = String(stored?.password || fallback.password || '').trim();

  return { username, password };
}

function saveAdminCredentials(credentials) {
  writeJsonFile(ADMIN_AUTH_FILE, {
    username: String(credentials.username || 'admin').trim() || 'admin',
    password: String(credentials.password || '').trim()
  });
}

function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function parseBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        resolve(payload);
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function sanitizeUploadBaseName(input) {
  const normalized = String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'media';
}

function saveUploadedMedia(payload) {
  const mimeType = String(payload.mimeType || '').trim().toLowerCase();
  const base64Data = String(payload.base64Data || '').trim();
  const originalName = String(payload.originalName || '').trim();

  if (!ALLOWED_UPLOAD_MIME.has(mimeType)) {
    throw new Error('Unsupported file type. Upload JPG, PNG, WEBP, GIF, MP4, WEBM, OGV, or MOV.');
  }

  if (!base64Data) {
    throw new Error('Missing media data.');
  }

  const extension = MIME_EXTENSION_MAP[mimeType] || path.extname(originalName).toLowerCase() || '';
  if (!extension) {
    throw new Error('Could not determine a file extension for the upload.');
  }

  const bytes = Buffer.from(base64Data, 'base64');
  if (!bytes.length) {
    throw new Error('Uploaded media is empty.');
  }

  if (bytes.length > 80 * 1024 * 1024) {
    throw new Error('File is too large. Maximum upload size is 80MB.');
  }

  const baseName = sanitizeUploadBaseName(path.basename(originalName, path.extname(originalName)));
  const fileName = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}-${baseName}${extension}`;

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const targetPath = path.join(UPLOADS_DIR, fileName);
  fs.writeFileSync(targetPath, bytes);

  return `images/uploads/${fileName}`;
}

function getSiteContent() {
  return readJsonFile(SITE_CONTENT_FILE, {});
}

function getEnquiries() {
  const payload = readJsonFile(ENQUIRIES_FILE, { enquiries: [] });
  if (!Array.isArray(payload.enquiries)) {
    return { enquiries: [] };
  }
  return payload;
}

function publishContentUpdatedEvent() {
  const message = [
    'event: content-updated',
    `data: ${JSON.stringify({ updatedAt: new Date().toISOString() })}`,
    '',
    ''
  ].join('\n');

  for (const client of sseClients) {
    client.write(message);
  }
}

async function handleApi(req, res, url) {
  const method = req.method || 'GET';
  const pathname = url.pathname;

  if (method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization,x-api-key'
    });
    res.end();
    return true;
  }

  if (method === 'GET' && pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write('event: connected\ndata: {"status":"ok"}\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return true;
  }

  if (
    method === 'GET' && (
      pathname === '/api/data'
      || pathname === '/api/site-content'
      || pathname === '/api/public/site-content'
      || pathname === '/api/public/site-content.php'
    )
  ) {
    sendJson(res, 200, { siteContent: getSiteContent() });
    return true;
  }

  if (
    method === 'PUT' && (
      pathname === '/api/data'
      || pathname === '/api/site-content'
    )
  ) {
    if (!requireAdminAuth(req, res, { json: true })) {
      return true;
    }

    try {
      const payload = await parseBody(req);
      const nextContent = payload.siteContent || payload.data || payload;

      if (!nextContent || typeof nextContent !== 'object' || Array.isArray(nextContent)) {
        sendJson(res, 400, { error: 'siteContent payload must be a JSON object.' });
        return true;
      }

      writeJsonFile(SITE_CONTENT_FILE, nextContent);
      publishContentUpdatedEvent();
      sendJson(res, 200, { ok: true, siteContent: nextContent });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Failed to save content.' });
    }
    return true;
  }

  if (method === 'POST' && pathname === '/save') {
    if (!requireAdminAuth(req, res, { json: true })) {
      return true;
    }

    try {
      const payload = await parseBody(req);
      const nextContent = payload.siteContent || payload.data || payload;

      if (!nextContent || typeof nextContent !== 'object' || Array.isArray(nextContent)) {
        sendJson(res, 400, { error: 'siteContent payload must be a JSON object.' });
        return true;
      }

      writeJsonFile(SITE_CONTENT_FILE, nextContent);
      publishContentUpdatedEvent();
      sendJson(res, 200, { ok: true, version: Date.now(), siteContent: nextContent });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Failed to save content.' });
    }
    return true;
  }

  if (method === 'POST' && pathname === '/api/auth/verify') {
    const credentials = getAdminCredentials();

    if (!credentials.password) {
      sendJson(res, 200, { ok: true, authRequired: false });
      return true;
    }

    if (!isAdminAuthorized(req)) {
      sendJson(res, 401, { ok: false, authRequired: true, error: 'Unauthorized' });
      return true;
    }

    sendJson(res, 200, { ok: true, authRequired: true });
    return true;
  }

  if (method === 'POST' && pathname === '/api/upload') {
    if (!requireAdminAuth(req, res, { json: true })) {
      return true;
    }

    try {
      const payload = await parseBody(req, 120 * 1024 * 1024);
      const mediaPath = saveUploadedMedia(payload || {});
      sendJson(res, 201, { ok: true, path: mediaPath, url: `/${mediaPath}` });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message || 'Upload failed.' });
    }
    return true;
  }

  if (method === 'GET' && pathname === '/api/admin/credentials') {
    if (!requireAdminAuth(req, res, { json: true })) {
      return true;
    }

    const credentials = getAdminCredentials();
    sendJson(res, 200, {
      ok: true,
      authEnabled: Boolean(credentials.password),
      username: credentials.username
    });
    return true;
  }

  if (method === 'PUT' && pathname === '/api/admin/credentials') {
    if (!requireAdminAuth(req, res, { json: true })) {
      return true;
    }

    try {
      const payload = await parseBody(req);
      const current = getAdminCredentials();
      const currentPassword = String(payload.currentPassword || '').trim();
      const newUsername = String(payload.newUsername || '').trim();
      const newPassword = String(payload.newPassword || '').trim();

      if (current.password && currentPassword !== current.password) {
        sendJson(res, 400, { ok: false, error: 'Current password is incorrect.' });
        return true;
      }

      if (newUsername.length < 3) {
        sendJson(res, 400, { ok: false, error: 'New username must be at least 3 characters.' });
        return true;
      }

      if (newPassword.length < 8) {
        sendJson(res, 400, { ok: false, error: 'New password must be at least 8 characters.' });
        return true;
      }

      const nextCredentials = {
        username: newUsername,
        password: newPassword
      };

      saveAdminCredentials(nextCredentials);
      sendJson(res, 200, { ok: true, username: nextCredentials.username, authEnabled: true });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message || 'Failed to update admin credentials.' });
    }
    return true;
  }

  if (
    method === 'GET' && (
      pathname === '/api/enquiries'
      || pathname === '/api/public/enquiries'
      || pathname === '/api/public/enquiries.php'
    )
  ) {
    sendJson(res, 200, getEnquiries());
    return true;
  }

  if (
    method === 'POST' && (
      pathname === '/api/enquiries'
      || pathname === '/api/public/enquiries'
      || pathname === '/api/public/enquiries.php'
    )
  ) {
    try {
      const payload = await parseBody(req);
      const enquiry = {
        ...payload,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        receivedAt: new Date().toISOString()
      };

      const existing = getEnquiries();
      existing.enquiries.push(enquiry);
      writeJsonFile(ENQUIRIES_FILE, existing);

      sendJson(res, 201, { ok: true, enquiry });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Unable to save enquiry.' });
    }
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  handleApi(req, res, url).then((wasHandled) => {
    if (wasHandled) return;

    if (url.pathname === '/admin' || url.pathname === '/admin.html') {
      if (!requireAdminAuth(req, res)) {
        return;
      }
      sendFile(res, path.join(ROOT, 'admin.html'));
      return;
    }

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
  }).catch((error) => {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
  });
});

server.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
