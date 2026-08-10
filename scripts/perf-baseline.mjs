import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const distDir = path.join(root, 'build');
const reportPath = path.join(root, 'docs', 'performance-baseline.json');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(cmd, args) {
  const startedAt = Date.now();
  const output = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  const durationMs = Date.now() - startedAt;
  return { ...output, durationMs };
}

function readDirFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return readDirFiles(full);
    return [full];
  });
}

function bytesToKb(bytes) {
  return Math.round((bytes / 1024) * 100) / 100;
}

function summarizeDist() {
  const files = readDirFiles(distDir);
  const bundles = files
    .filter((file) => file.endsWith('.js') || file.endsWith('.css'))
    .map((file) => {
      const content = fs.readFileSync(file);
      return {
        file: path.relative(root, file).replaceAll(path.sep, '/'),
        sizeKb: bytesToKb(content.byteLength),
        gzipKb: bytesToKb(gzipSync(content).byteLength),
      };
    })
    .sort((a, b) => b.sizeKb - a.sizeKb);

  const htmlPath = path.join(distDir, 'index.html');
  const html = fs.readFileSync(htmlPath);
  const manifest = JSON.parse(fs.readFileSync(path.join(distDir, '.vite', 'manifest.json'), 'utf8'));
  const entry = Object.values(manifest).find((item) => item.isEntry);

  return {
    html: {
      sizeKb: bytesToKb(html.byteLength),
      gzipKb: bytesToKb(gzipSync(html).byteLength),
    },
    bundleCount: bundles.length,
    totalSizeKb: Math.round(bundles.reduce((acc, item) => acc + item.sizeKb, 0) * 100) / 100,
    totalGzipKb: Math.round(bundles.reduce((acc, item) => acc + item.gzipKb, 0) * 100) / 100,
    initialGraph: entry
      ? {
          entry: entry.file,
          imports: (entry.imports || []).map((key) => manifest[key]?.file || key),
          css: entry.css || [],
        }
      : null,
    topBundles: bundles.slice(0, 10),
  };
}

const build = run(npmCommand, ['run', 'build']);
const audit = run(npmCommand, ['run', 'audit:frontend']);

const report = {
  generatedAt: new Date().toISOString(),
  runtime: process.version,
  targetSLO: {
    frontendRouteP95Ms: 1500,
    frontendRouteP99Ms: 2500,
    apiErrorRatePercent: 1,
    buildTimeSeconds: 60,
  },
  checks: {
    build: {
      exitCode: build.status,
      durationMs: build.durationMs,
      durationSeconds: Math.round((build.durationMs / 1000) * 100) / 100,
    },
    frontendAudit: {
      exitCode: audit.status,
      durationMs: audit.durationMs,
      durationSeconds: Math.round((audit.durationMs / 1000) * 100) / 100,
    },
  },
  distSummary: summarizeDist(),
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('Performance baseline generated:', reportPath);
console.log(JSON.stringify(report, null, 2));

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
