import { beforeEach, describe, expect, it } from 'vitest';
import { cleanupLegacyIdentityStorage, getAuthenticatedUser, persistBackendIdentity } from './session';

const backendUser = {
  id: 'session-user',
  email: 'session@hortelan.local',
  name: 'Operação Hortelan',
  role: 'operator',
};

describe('production session storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('persiste apenas identidade segura e uma sessão válida', () => {
    persistBackendIdentity({
      user: { ...backendUser, password: 'Senha!123', accessToken: 'token-privado' },
      session: { id: 'valid-session', expiresAt: new Date(Date.now() + 60_000).toISOString() },
      remember: true,
    });

    expect(getAuthenticatedUser()).toMatchObject(backendUser);
    const storage = JSON.stringify({ ...localStorage, ...sessionStorage });
    expect(storage).not.toContain('Senha!123');
    expect(storage).not.toContain('token-privado');
  });

  it('expira a sessão absoluta e remove os ponteiros de autenticação', () => {
    persistBackendIdentity({
      user: backendUser,
      session: { id: 'expired-session', expiresAt: new Date(Date.now() - 1_000).toISOString() },
      remember: true,
    });

    expect(getAuthenticatedUser()).toBeNull();
    expect(localStorage.getItem('hortelan-auth')).toBeNull();
    expect(localStorage.getItem('hortelan-auth-session-id')).toBeNull();
  });

  it('limpa tokens, histórico, desafios e senhas legados em uma única passagem', () => {
    localStorage.setItem('hortelan-reset-tokens', '["reset-secret"]');
    localStorage.setItem('hortelan-password-history', '["old-password"]');
    localStorage.setItem('hortelan-mfa-challenges', '["123456"]');
    localStorage.setItem('hortelan-login-rate-limit', '{"blocked":true}');
    localStorage.setItem('hortelan-users', JSON.stringify([{ ...backendUser, password: 'legacy-password' }]));

    cleanupLegacyIdentityStorage();

    expect(localStorage.getItem('hortelan-reset-tokens')).toBeNull();
    expect(localStorage.getItem('hortelan-password-history')).toBeNull();
    expect(localStorage.getItem('hortelan-mfa-challenges')).toBeNull();
    expect(localStorage.getItem('hortelan-login-rate-limit')).toBeNull();
    expect(localStorage.getItem('hortelan-users')).not.toContain('legacy-password');
    expect(localStorage.getItem('hortelan-identity-cleanup-v2')).toBe('complete');
  });
});
