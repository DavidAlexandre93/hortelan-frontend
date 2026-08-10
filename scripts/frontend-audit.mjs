import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const extensions = ['.js', '.jsx', '.mjs'];
const entries = [path.join(srcDir, 'index.js'), path.join(srcDir, 'entry-server.js')];

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(target);
    return extensions.includes(path.extname(entry.name)) ? [path.resolve(target)] : [];
  });
}

function isTestFile(file) {
  const normalized = file.replaceAll(path.sep, '/');
  return (
    /\.(?:test|spec)\.[jt]sx?$/.test(normalized) ||
    normalized.includes('/src/test/') ||
    normalized.endsWith('/src/setupTests.js')
  );
}

function resolveFile(basePath) {
  const candidates = [
    basePath,
    ...extensions.map((extension) => `${basePath}${extension}`),
    ...extensions.map((extension) => path.join(basePath, `index${extension}`)),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || null;
}

function extractSpecifiers(content, file) {
  const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const specifiers = new Set();

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.add(node.moduleSpecifier.text);
    }

    if (ts.isCallExpression(node) && node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      const dynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const commonJsRequire = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      if (dynamicImport || commonJsRequire) specifiers.add(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return [...specifiers];
}

function resolveSpecifier(fromFile, specifier) {
  if (specifier.startsWith('.')) return resolveFile(path.resolve(path.dirname(fromFile), specifier));
  if (specifier.startsWith('src/')) return resolveFile(path.resolve(root, specifier));
  if (specifier.startsWith('/src/')) return resolveFile(path.resolve(root, specifier.slice(1)));
  return null;
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

const files = listFiles(srcDir);
const productionFiles = files.filter((file) => !isTestFile(file));
const fileSet = new Set(productionFiles);
const graph = new Map();
const unresolved = [];

for (const file of productionFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const dependencies = [];
  for (const specifier of extractSpecifiers(content, file)) {
    const resolved = resolveSpecifier(file, specifier);
    if (resolved && fileSet.has(path.resolve(resolved))) dependencies.push(path.resolve(resolved));
    else if (specifier.startsWith('.') || specifier.startsWith('/src/') || specifier.startsWith('src/'))
      unresolved.push(`${relative(file)} -> ${specifier}`);
  }
  graph.set(file, dependencies);
}

const visited = new Set();
const queue = entries.map((entry) => path.resolve(entry));
while (queue.length) {
  const file = queue.shift();
  if (!file || visited.has(file) || !graph.has(file)) continue;
  visited.add(file);
  queue.push(...graph.get(file));
}

const orphans = productionFiles
  .filter((file) => !visited.has(file))
  .map(relative)
  .sort();
const oversized = productionFiles
  .map((file) => ({ file: relative(file), lines: fs.readFileSync(file, 'utf8').split(/\r?\n/).length }))
  .filter(({ lines }) => lines > 800)
  .sort((a, b) => b.lines - a.lines);

const hashes = new Map();
for (const file of productionFiles) {
  const normalized = fs.readFileSync(file, 'utf8').replace(/\s+/g, ' ').trim();
  const hash = crypto.createHash('sha1').update(normalized).digest('hex');
  hashes.set(hash, [...(hashes.get(hash) || []), relative(file)]);
}
const duplicates = [...hashes.values()].filter((group) => group.length > 1);

console.log('Frontend reachability audit');
console.log(`Production modules: ${productionFiles.length}`);
console.log(`Reachable from client/SSR entries: ${visited.size}`);
console.log(`Oversized modules (>800 lines): ${oversized.length}`);
oversized.forEach(({ file, lines }) => console.log(`- ${file}: ${lines} lines`));

if (duplicates.length) {
  console.log(`Duplicate-content groups: ${duplicates.length}`);
  duplicates.forEach((group) => console.log(`- ${group.join(', ')}`));
}

if (unresolved.length || orphans.length) {
  if (unresolved.length) {
    console.error('\nImports locais nao resolvidos:');
    unresolved.forEach((item) => console.error(`- ${item}`));
  }
  if (orphans.length) {
    console.error('\nModulos de producao inacessiveis:');
    orphans.forEach((file) => console.error(`- ${file}`));
  }
  process.exit(1);
}

console.log('Grafo de producao sem modulos orfaos ou imports quebrados.');
