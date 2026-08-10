import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { SECURITY_HEADERS } from '../server/security-headers.mjs';

test('servidor e Vercel compartilham o mesmo contrato de headers', async () => {
  const vercelConfig = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const vercelHeaders = Object.fromEntries(vercelConfig.headers[0].headers.map(({ key, value }) => [key, value]));

  assert.deepEqual(vercelHeaders, SECURITY_HEADERS);
});

test('CSP bloqueia scripts inline, eval e framing', () => {
  const csp = SECURITY_HEADERS['Content-Security-Policy'];
  const scriptDirective = csp.split(';').find((directive) => directive.trim().startsWith('script-src'));

  assert.equal(scriptDirective.trim(), "script-src 'self'");
  assert.doesNotMatch(scriptDirective, /unsafe-inline|unsafe-eval/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.equal(SECURITY_HEADERS['X-Frame-Options'], 'DENY');
  assert.match(SECURITY_HEADERS['Strict-Transport-Security'], /includeSubDomains; preload/);
});
