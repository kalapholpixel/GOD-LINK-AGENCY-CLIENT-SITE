#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_CONTENT_FILE = path.join(ROOT, 'hostinger-admin', 'data', 'site-content.json');
const UPLOADS_DIR = path.join(ROOT, 'images', 'uploads');
const MEDIA_PATTERN = /\.(png|jpe?g|webp|gif|svg|mp4|webm|ogv|mov)(\?.*)?(#.*)?$/i;

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
      if (entry.isDirectory()) {
        stack.push(full);
      } else {
        output.push(full);
      }
    }
  }

  return output;
}

function toRepoPath(fullPath) {
  return path.relative(ROOT, fullPath).replace(/\\/g, '/');
}

function main() {
  const asJson = process.argv.includes('--json');
  const content = readJson(SITE_CONTENT_FILE, {});
  const allStrings = [];
  walkStrings(content, allStrings);

  const mediaRefs = allStrings.filter(isLikelyMediaRef);
  const localRefs = new Set();
  const externalRefs = new Set();

  for (const ref of mediaRefs) {
    if (/^https?:\/\//i.test(ref)) {
      externalRefs.add(ref);
      continue;
    }

    const local = normalizeLocalPath(ref);
    if (local) localRefs.add(local);
  }

  const uploadFiles = listFilesRecursive(UPLOADS_DIR).map(toRepoPath);
  const referencedUploads = Array.from(localRefs).filter((ref) => ref.startsWith('images/uploads/'));
  const referencedUploadSet = new Set(referencedUploads);

  const missingLocal = Array.from(localRefs)
    .filter((localPath) => localPath.startsWith('images/'))
    .filter((localPath) => !fs.existsSync(path.join(ROOT, localPath)))
    .sort();

  const unusedUploads = uploadFiles
    .filter((filePath) => !referencedUploadSet.has(filePath))
    .sort();

  const summary = {
    siteContentFile: toRepoPath(SITE_CONTENT_FILE),
    totals: {
      mediaRefs: mediaRefs.length,
      localRefs: localRefs.size,
      externalRefs: externalRefs.size,
      uploadFiles: uploadFiles.length,
      referencedUploads: referencedUploads.length,
      missingLocal: missingLocal.length,
      unusedUploads: unusedUploads.length
    },
    missingLocal,
    unusedUploads,
    externalRefs: Array.from(externalRefs).sort()
  };

  if (asJson) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    return;
  }

  console.log('Media Audit Summary');
  console.log(`- Content file: ${summary.siteContentFile}`);
  console.log(`- Media references found: ${summary.totals.mediaRefs}`);
  console.log(`- Local references: ${summary.totals.localRefs}`);
  console.log(`- External references: ${summary.totals.externalRefs}`);
  console.log(`- Upload files on disk: ${summary.totals.uploadFiles}`);
  console.log(`- Referenced upload files: ${summary.totals.referencedUploads}`);
  console.log(`- Missing local media refs: ${summary.totals.missingLocal}`);
  console.log(`- Unused upload files: ${summary.totals.unusedUploads}`);

  if (missingLocal.length) {
    console.log('\nMissing local media references:');
    missingLocal.forEach((entry) => console.log(`- ${entry}`));
  }

  if (unusedUploads.length) {
    console.log('\nUnused upload files:');
    unusedUploads.forEach((entry) => console.log(`- ${entry}`));
  }

  if (externalRefs.size) {
    console.log('\nExternal media references:');
    Array.from(externalRefs).sort().forEach((entry) => console.log(`- ${entry}`));
  }
}

main();
