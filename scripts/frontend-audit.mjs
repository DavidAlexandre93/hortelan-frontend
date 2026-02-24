import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const entryFile = path.join(srcDir, 'index.js');
const exts = ['.js', '.jsx'];
const IGNORE_ORPHAN_PATTERNS = [
  '/_mock/',
  '/setupTests.js',
  '/entry-server.js',
  '/serviceWorker.js',
  '/data/',
];

function listFiles(dir) {
  const output = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...listFiles(full));
      continue;
    }
    if (exts.includes(path.extname(entry.name))) {
      output.push(full);
    }
  }
  return output;
}

function findExistingFile(basePath) {
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) return basePath;
  for (const ext of exts) {
    if (fs.existsSync(`${basePath}${ext}`)) return `${basePath}${ext}`;
  }
  for (const ext of exts) {
    const indexFile = path.join(basePath, `index${ext}`);
    if (fs.existsSync(indexFile)) return indexFile;
  }
  return null;
}

function extractImports(content) {
  const imports = [];
  const re = /(?:import|export)\s+(?:[^'"\n]+?\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = re.exec(content))) {
    imports.push(match[1]);
  }
  return imports;
}

function toProjectPath(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

const files = listFiles(srcDir);
const fileSet = new Set(files.map((f) => path.resolve(f)));

const graph = new Map();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const imports = extractImports(content);
  const resolved = [];

  for (const spec of imports) {
    if (spec.startsWith('.')) {
      const target = findExistingFile(path.resolve(path.dirname(file), spec));
      if (target && fileSet.has(path.resolve(target))) {
        resolved.push(path.resolve(target));
      }
      continue;
    }

    if (spec.startsWith('src/')) {
      const target = findExistingFile(path.join(root, spec));
      if (target && fileSet.has(path.resolve(target))) {
        resolved.push(path.resolve(target));
      }
    }
  }

  graph.set(path.resolve(file), resolved);
}

const visited = new Set();
const queue = [path.resolve(entryFile)];

while (queue.length) {
  const current = queue.shift();
  if (!current || visited.has(current) || !graph.has(current)) continue;
  visited.add(current);
  for (const dep of graph.get(current) ?? []) {
    if (!visited.has(dep)) queue.push(dep);
  }
}

const orphanFiles = files
  .map((f) => path.resolve(f))
  .filter((f) => !visited.has(f))
  .map((f) => toProjectPath(f))
  .filter((f) => !IGNORE_ORPHAN_PATTERNS.some((pattern) => f.endsWith(pattern) || f.includes(pattern)));

const hashMap = new Map();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const normalized = content.replace(/\s+/g, ' ').trim();
  const hash = crypto.createHash('sha1').update(normalized).digest('hex');
  const bucket = hashMap.get(hash) ?? [];
  bucket.push(toProjectPath(file));
  hashMap.set(hash, bucket);
}

const duplicateGroups = [...hashMap.values()].filter((group) => group.length > 1);

console.log('Frontend audit summary');
console.log('======================');
console.log(`Scanned files: ${files.length}`);
console.log(`Reachable files from src/index.js: ${visited.size}`);
console.log(`Potential orphan files: ${orphanFiles.length}`);

if (orphanFiles.length) {
  console.log('\nPotential orphan files (review before removal):');
  orphanFiles.forEach((file) => console.log(`- ${file}`));
}

console.log(`\nDuplicate-content groups: ${duplicateGroups.length}`);
if (duplicateGroups.length) {
  duplicateGroups.forEach((group, idx) => {
    console.log(`\nGroup ${idx + 1}:`);
    group.forEach((file) => console.log(`- ${file}`));
  });
}
