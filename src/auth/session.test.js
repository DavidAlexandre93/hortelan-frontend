import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanupLegacyIdentityStorage,
  deactivateCurrentAccount,
  exportCurrentUserData,
  getAccountDeletionRequest,
  getAuthenticatedUser,
  getConsentAuditLogs,
  getUserSessions,
  logoutAllSessions,
  logoutCurrentSession,
  logoutOtherSessions,
  persistBackendIdentity,
  requestAccountDeletion,
  updateUserConsents,
} from './session';

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

  it('encerra a sessao atual sem manter identidade residual', () => {
    persistBackendIdentity({ user: backendUser, session: { id: 'current-session' }, remember: true });
    logoutCurrentSession();
    expect(getAuthenticatedUser()).toBeNull();
    expect(getUserSessions()).toEqual([]);
  });

  it('preserva apenas a sessao atual ao encerrar as demais', () => {
    persistBackendIdentity({ user: backendUser, session: { id: 'older-session' }, remember: true });
    persistBackendIdentity({ user: backendUser, session: { id: 'current-session' }, remember: true });
    expect(getUserSessions()).toHaveLength(2);
    logoutOtherSessions();
    expect(getUserSessions()).toEqual([expect.objectContaining({ id: 'current-session', isCurrent: true })]);
  });

  it('encerra todas as sessoes do usuario', () => {
    persistBackendIdentity({ user: backendUser, session: { id: 'session-a' }, remember: true });
    persistBackendIdentity({ user: backendUser, session: { id: 'session-b' }, remember: true });
    logoutAllSessions();
    expect(getAuthenticatedUser()).toBeNull();
    expect(localStorage.getItem('hortelan-active-sessions')).toBe('[]');
  });

  it('mantem o resultado seguro quando o navegador bloqueia persistencia', () => {
    const blockedStorage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage indisponivel', 'SecurityError');
    });

    expect(() =>
      persistBackendIdentity({
        user: { ...backendUser, password: 'nao-persistir', accessToken: 'nao-persistir' },
        session: { id: 'memory-session' },
      })
    ).not.toThrow();

    const result = persistBackendIdentity({ user: backendUser, session: { id: 'memory-session-2' } });
    expect(result.user).toMatchObject(backendUser);
    blockedStorage.mockRestore();
  });

  it('audita consentimentos, exporta dados seguros e conclui a desativacao', () => {
    persistBackendIdentity({
      user: { ...backendUser, password: 'segredo', accessToken: 'token-interno' },
      session: { id: 'privacy-session' },
      remember: true,
    });

    expect(updateUserConsents({ analytics: false, marketing: false })).toMatchObject({ success: true });
    expect(getConsentAuditLogs()).toEqual([
      expect.objectContaining({ payload: { analytics: false, marketing: false } }),
    ]);

    expect(requestAccountDeletion({ reason: 'Solicitacao de teste' })).toEqual({ success: true });
    expect(getAccountDeletionRequest()).toMatchObject({ reason: 'Solicitacao de teste', status: 'pending' });

    const exportedData = exportCurrentUserData();
    expect(exportedData.user).toMatchObject({ id: backendUser.id, email: backendUser.email });
    expect(JSON.stringify(exportedData)).not.toContain('segredo');
    expect(JSON.stringify(exportedData)).not.toContain('token-interno');

    expect(deactivateCurrentAccount({ reason: 'Encerramento confirmado' })).toEqual({ success: true });
    expect(getAuthenticatedUser()).toBeNull();
  });
});
