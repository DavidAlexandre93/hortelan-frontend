import { describe, expect, it } from 'vitest';
import { dashboardRoutes, findDashboardContext, legacyAliases, publicRoutes, ssrRoutePaths } from './routeManifest';

describe('routeManifest', () => {
  it('mantem caminhos canonicos unicos e metadados completos', () => {
    const paths = dashboardRoutes.map((route) => route.canonicalPath);
    expect(new Set(paths).size).toBe(paths.length);
    dashboardRoutes.forEach((route) => {
      expect(route).toMatchObject({ access: 'private' });
      expect(route.title).toBeTruthy();
      expect(route.description).toBeTruthy();
      expect(route.Component).toBeTruthy();
    });
  });

  it('define cadastro como workflow anonimo proprio', () => {
    const register = publicRoutes.find((route) => route.path === '/register');
    const login = publicRoutes.find((route) => route.path === '/login');
    expect(register.Component).not.toBe(login.Component);
    expect(register.access).toBe('anonymous');
  });

  it('seleciona metadados de subrotas e aliases protegidos', () => {
    expect(findDashboardContext('/dashboard/integracoes/ops').title).toBe('Operacoes de integracao');
    expect(legacyAliases.every((alias) => alias.destination.startsWith('/dashboard/'))).toBe(true);
  });

  it('limita SSR a rotas publicas conhecidas', () => {
    expect(ssrRoutePaths.has('/login')).toBe(true);
    expect(ssrRoutePaths.has('/dashboard/app')).toBe(false);
  });
});
