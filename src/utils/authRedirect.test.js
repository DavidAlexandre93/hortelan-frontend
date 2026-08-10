import { describe, expect, it } from 'vitest';
import { DEFAULT_AUTH_REDIRECT, isSafeInternalDestination, resolvePostAuthDestination } from './authRedirect';

describe('authRedirect', () => {
  it('aceita somente destinos internos do dashboard', () => {
    expect(isSafeInternalDestination('/dashboard/profile?tab=privacy')).toBe(true);
    expect(isSafeInternalDestination('/login')).toBe(false);
    expect(isSafeInternalDestination('//evil.example/dashboard')).toBe(false);
    expect(isSafeInternalDestination('/dashboard\\evil')).toBe(false);
  });

  it('prioriza returnTo seguro da query string', () => {
    expect(resolvePostAuthDestination({ search: '?returnTo=%2Fdashboard%2Falertas' })).toBe('/dashboard/alertas');
  });

  it('usa o estado de navegacao quando seguro', () => {
    expect(resolvePostAuthDestination({ stateFrom: '/dashboard/relatorios?period=week' })).toBe(
      '/dashboard/relatorios?period=week'
    );
  });

  it('recusa redirecionamento externo', () => {
    expect(resolvePostAuthDestination({ search: '?returnTo=https://evil.example', stateFrom: '//evil.example' })).toBe(
      DEFAULT_AUTH_REDIRECT
    );
  });
});
