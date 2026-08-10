import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const buildDir = path.join(root, 'build');
const forbiddenPatterns = [
  { name: 'New Relic embutido', pattern: /NREUM|browser\.newrelic|nr-data\.net/i },
  { name: 'Meticulous em producao', pattern: /alwaysmeticulous|recorder-loader/i },
  { name: 'Faker em producao', pattern: /@faker-js\/faker|faker\.string\.uuid/i },
  { name: 'credencial demo historica', pattern: /davidfernandes@hortelanagtech\.com|password\s*[:=]\s*["']admin["']/i },
  {
    name: 'token privado embutido',
    pattern: /(?:api[_-]?key|secret|private[_-]?token)\s*[:=]\s*["'][A-Za-z0-9_-]{20,}["']/i,
  },
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

if (!fs.existsSync(buildDir)) throw new Error('Build ausente. Execute npm run build antes do scanner.');

const inspected = walk(buildDir).filter((file) => /\.(?:html|js|css|json|map)$/i.test(file));
const failures = [];

for (const file of inspected) {
  const content = fs.readFileSync(file, 'utf8');
  for (const forbidden of forbiddenPatterns) {
    if (forbidden.pattern.test(content)) {
      failures.push(`${forbidden.name}: ${path.relative(root, file).replaceAll(path.sep, '/')}`);
    }
  }
}

const html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) failures.push('index.html contem script inline.');
if (!/<html\s+lang="pt-BR"/i.test(html)) failures.push('index.html nao declara lang="pt-BR".');

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const headers = Object.fromEntries(vercel.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]));
const requiredHeaders = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
];
requiredHeaders.forEach((header) => {
  if (!headers[header]) failures.push(`Header ausente no Vercel: ${header}`);
});
if (/script-src[^;]*unsafe-inline/i.test(headers['content-security-policy'] || ''))
  failures.push('CSP permite script inline.');

if (failures.length) {
  console.error('Falhas no scanner de seguranca:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Scanner de seguranca aprovado em ${inspected.length} artefatos.`);
