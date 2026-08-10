import assert from 'node:assert/strict';
import test from 'node:test';
import { composeHtml } from '../server/html-template.mjs';

const template = `<!doctype html><html><head>
<!-- app-head:start --><title>Padrao</title><meta name="description" content="Padrao" /><!-- app-head:end -->
</head><body><div id="root"></div></body></html>`;

test('composeHtml substitui metadados padrao no SSR sem duplicar titulo', () => {
  const html = composeHtml({
    template,
    appHtml: '<main>Login</main>',
    headTags: '<title>Entrar | Hortelan</title><link rel="canonical" href="https://hortelan.local/login" />',
    useSsr: true,
  });

  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.match(html, /<div id="root"><main>Login<\/main><\/div>/);
});

test('composeHtml preserva metadados padrao no fallback da SPA', () => {
  const html = composeHtml({ template, useSsr: false });

  assert.match(html, /<title>Padrao<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
});
