import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const buildDir = path.join(root, 'build');
const manifestPath = path.join(buildDir, '.vite', 'manifest.json');

const budgets = {
  htmlGzipKb: 20,
  entryGzipKb: 225,
  routeGzipKb: 85,
  vendorGzipKb: 150,
  maxJavaScriptKb: 500,
  totalGzipKb: 760,
};

function read(relativePath) {
  return fs.readFileSync(path.join(buildDir, relativePath));
}

function kb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

function gzipKb(buffer) {
  return kb(gzipSync(buffer, { level: 9 }).length);
}

if (!fs.existsSync(manifestPath)) {
  throw new Error('Manifest de producao ausente. Execute npm run build antes do budget.');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const files = [...new Set(Object.values(manifest).flatMap((entry) => [entry.file, ...(entry.css || [])]))]
  .filter(Boolean)
  .map((file) => ({ file, content: read(file) }));
const failures = [];

const htmlGzip = gzipKb(read('index.html'));
if (htmlGzip > budgets.htmlGzipKb) failures.push(`HTML gzip ${htmlGzip} kB > ${budgets.htmlGzipKb} kB`);

const entryRecord = Object.values(manifest).find((entry) => entry.isEntry);
if (!entryRecord) failures.push('Entry principal nao encontrada no manifest.');
const entryGzip = entryRecord ? gzipKb(read(entryRecord.file)) : 0;
if (entryGzip > budgets.entryGzipKb) failures.push(`Entry gzip ${entryGzip} kB > ${budgets.entryGzipKb} kB`);

for (const item of files.filter(({ file }) => file.endsWith('.js'))) {
  const rawSize = kb(item.content.length);
  const compressedSize = gzipKb(item.content);
  const isRoute = /Page-|HelpCenter-/.test(item.file);
  const isVendor = /(mui|charts|react-|sentry|motion)/.test(item.file);

  if (rawSize > budgets.maxJavaScriptKb) failures.push(`${item.file} ${rawSize} kB > ${budgets.maxJavaScriptKb} kB`);
  if (isRoute && compressedSize > budgets.routeGzipKb)
    failures.push(`${item.file} gzip ${compressedSize} kB > ${budgets.routeGzipKb} kB`);
  if (isVendor && compressedSize > budgets.vendorGzipKb)
    failures.push(`${item.file} gzip ${compressedSize} kB > ${budgets.vendorGzipKb} kB`);
}

const totalGzip = Math.round(files.reduce((total, item) => total + gzipKb(item.content), 0) * 100) / 100;
if (totalGzip > budgets.totalGzipKb) failures.push(`Total gzip ${totalGzip} kB > ${budgets.totalGzipKb} kB`);

console.log('Bundle budget');
console.log(`HTML: ${htmlGzip} kB gzip | entry: ${entryGzip} kB gzip | total: ${totalGzip} kB gzip`);
console.log(
  `Maior JS: ${Math.max(...files.filter(({ file }) => file.endsWith('.js')).map(({ content }) => kb(content.length)))} kB`
);

if (failures.length) {
  console.error('\nBudgets excedidos:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Todos os budgets foram respeitados.');
