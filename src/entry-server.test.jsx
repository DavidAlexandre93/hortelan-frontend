// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { render, shouldUseSsr } from './entry-server';

describe('public SSR entry', () => {
  it('restringe SSR às rotas públicas conhecidas', () => {
    expect(shouldUseSsr('/login?returnTo=%2Fdashboard%2Fapp')).toBe(true);
    expect(shouldUseSsr('/register/')).toBe(true);
    expect(shouldUseSsr('/dashboard/app')).toBe(false);
  });

  it('renderiza a página de login com metadados', () => {
    const result = render('/login');

    expect(result.appHtml).toContain('Acesse sua operacao');
    expect(result.appHtml).not.toContain('<title>');
    expect(result.headTags).toContain('<title>Entrar | Hortelan</title>');
    expect(result.headTags.match(/<title>/g) || []).toHaveLength(1);
  });
});
