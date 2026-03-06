import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'build');
const reportPath = path.join(root, 'docs', 'performance-baseline.json');

function run(cmd, args) {
  const startedAt = Date.now();
  const output = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
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
      const stats = fs.statSync(file);
      return {
        file: path.relative(root, file).replaceAll(path.sep, '/'),
        sizeKb: bytesToKb(stats.size),
      };
    })
    .sort((a, b) => b.sizeKb - a.sizeKb);

  return {
    bundleCount: bundles.length,
    totalSizeKb: Math.round(bundles.reduce((acc, item) => acc + item.sizeKb, 0) * 100) / 100,
    topBundles: bundles.slice(0, 10),
  };
}

const build = run('npm', ['run', 'build']);
const audit = run('npm', ['run', 'audit:frontend']);

const report = {
  generatedAt: new Date().toISOString(),
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
