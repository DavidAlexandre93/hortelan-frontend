import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

async function findNodeTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? findNodeTests(entryPath) : [entryPath];
    })
  );

  return files.flat().filter((file) => file.endsWith('.test.mjs'));
}

const coverage = process.argv.includes('--coverage');
const testFiles = (await findNodeTests(path.resolve('test'))).sort();

if (testFiles.length === 0) {
  throw new Error('Nenhum teste Node *.test.mjs foi encontrado.');
}

const args = ['--test', ...(coverage ? ['--experimental-test-coverage'] : []), ...testFiles];
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });

process.exitCode = result.status ?? 1;
