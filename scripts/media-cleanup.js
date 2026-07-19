#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_CONTENT_FILE = path.join(ROOT, 'hostinger-admin', 'data', 'data.json');
const UPLOADS_DIR = path.join(ROOT, 'images', 'uploads');
const MEDIA_PATTERN = /\.(png|jpe?g|webp|gif|svg|mp4|webm|ogv|mov)(\?.*)?(#.*)?$/i;

function parseArgs(argv) {
  const flags = {
    apply: false,
    dryRun: true,
    olderThanDays: 30
  };

  for (const token of argv.slice(2)) {
    if (token === '--apply') {
      flags.apply = true;
      flags.dryRun = false;
      continue;
    }
    if (token === '--dry-run') {
      flags.dryRun = true;
      flags.apply = false;
      continue;
    }
    if (token.startsWith('--older-than-days=')) {
      const value = Number(token.split('=')[1]);
      if (Number.isFinite(value) && value >= 0) {
        flags.olderThanDays = value;
      }
    }
  }

  return flags;
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function walkStrings(value, out) {
  if (typeof value === 'string') {
    out.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => walkStrings(item, out));
    return;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => walkStrings(item, out));
  }
}

function normalizeLocalPath(value) {
  const cleaned = String(value || '')
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/[?#].*$/, '')
    .replace(/^\.\//, '')
    .replace(/^\//, '');

  try {
    return decodeURI(cleaned).replace(/\\/g, '/');
  } catch (error) {
    return cleaned.replace(/\\/g, '/');
  }
}

function isLikelyMediaRef(value) {
  if (!value) return false;
  if (value.startsWith('data:') || value.startsWith('blob:')) return false;
  return value.includes('images/') || MEDIA_PATTERN.test(value);
}

function listFilesRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const output = [];
  const stack = [dirPath];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else output.push(full);
    }
  }
  return output;
}

function toRepoPath(fullPath) {
  return path.relative(ROOT, fullPath).replace(/\\/g, '/');
}

function main() {
  const options = parseArgs(process.argv);
  const content = readJson(SITE_CONTENT_FILE, {});
  const strings = [];
  walkStrings(content, strings);

  const localRefs = new Set();
  for (const value of strings.filter(isLikelyMediaRef)) {
    if (/^https?:\/\//i.test(value)) continue;
    const local = normalizeLocalPath(value);
    if (local.startsWith('images/uploads/')) {
      localRefs.add(local);
    }
  }

  const now = Date.now();
  const minAgeMs = options.olderThanDays * 24 * 60 * 60 * 1000;
  const uploadFiles = listFilesRecursive(UPLOADS_DIR);

  const candidates = uploadFiles
    .filter((fullPath) => !localRefs.has(toRepoPath(fullPath)))
    .map((fullPath) => {
      const stat = fs.statSync(fullPath);
      const ageMs = now - stat.mtimeMs;
      return {
        fullPath,
        repoPath: toRepoPath(fullPath),
        sizeBytes: stat.size,
        ageDays: Math.floor(ageMs / (24 * 60 * 60 * 1000)),
        eligible: ageMs >= minAgeMs
      };
    })
    .sort((a, b) => b.ageDays - a.ageDays);

  const eligible = candidates.filter((item) => item.eligible);
  const totalBytes = eligible.reduce((sum, item) => sum + item.sizeBytes, 0);

  console.log('Media Cleanup Plan');
  console.log(`- Mode: ${options.dryRun ? 'dry-run' : 'apply'}`);
  console.log(`- Minimum age: ${options.olderThanDays} day(s)`);
  console.log(`- Unused uploads found: ${candidates.length}`);
  console.log(`- Eligible for cleanup: ${eligible.length}`);
  console.log(`- Reclaimable bytes: ${totalBytes}`);

  if (!eligible.length) {
    console.log('\nNo files eligible for cleanup.');
    return;
  }

  console.log('\nEligible files:');
  eligible.forEach((item) => {
    console.log(`- ${item.repoPath} (${item.sizeBytes} bytes, ${item.ageDays} day(s) old)`);
  });

  if (options.dryRun) {
    console.log('\nDry-run only. No files were deleted. Use --apply to remove eligible files.');
    return;
  }

  for (const item of eligible) {
    fs.unlinkSync(item.fullPath);
  }

  console.log(`\nDeleted ${eligible.length} file(s).`);
}

main();
