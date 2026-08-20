import { describe, expect, it, vi } from 'vitest';
import { createDemoIdentityAdapter } from './demoIdentityAdapter';

describe('demo identity adapter', () => {
  it('accepts the temporary fixed credential only through Vite development defaults', async () => {
    const persist = vi.fn((payload) => payload);
    const adapter = createDemoIdentityAdapter({ persist });

    const result = await adapter.login({
      email: 'davidfernandes@hortelanagtech.com',
      password: 'admin',
      remember: true,
    });

    expect(result.user).toMatchObject({ email: 'davidfernandes@hortelanagtech.com' });
    expect(result.user).not.toHaveProperty('password');
    expect(persist).toHaveBeenCalledOnce();
  });

  it('refuses demo login when no password was explicitly configured', async () => {
    const adapter = createDemoIdentityAdapter({
      email: '',
      password: '',
      emailHash: '',
      passwordHash: '',
      persist: vi.fn(),
    });
    await expect(adapter.login({ email: 'demo@hortelan.local', password: '' })).resolves.toMatchObject({
      error: expect.stringContaining('nao foram configuradas'),
    });
  });

  it('accepts a production-format demo credential through one-way verifiers', async () => {
    const persist = vi.fn((payload) => payload);
    const digest = vi.fn(async (value) => `hash:${value}`);
    const adapter = createDemoIdentityAdapter({
      email: '',
      password: '',
      emailHash: 'hash:davidfernandes@hortelanagtech.com',
      passwordHash: 'hash:admin',
      persist,
      digest,
    });

    await expect(
      adapter.canHandleLogin({ email: ' DavidFernandes@HortelanAgTech.com ', password: 'admin' })
    ).resolves.toBe(true);
    const result = await adapter.login({
      email: 'DavidFernandes@HortelanAgTech.com',
      password: 'admin',
      remember: true,
    });
    expect(result.user).toMatchObject({ email: 'davidfernandes@hortelanagtech.com' });
    expect(result.user).not.toHaveProperty('password');
    expect(persist).toHaveBeenCalledOnce();
  });

  it('fails closed when a credential verifier cannot run', async () => {
    const adapter = createDemoIdentityAdapter({
      email: '',
      password: '',
      emailHash: 'configured-email-hash',
      passwordHash: 'configured-password-hash',
      digest: vi.fn().mockRejectedValue(new Error('crypto unavailable')),
      persist: vi.fn(),
    });

    await expect(adapter.canHandleLogin({ email: 'demo@example.com', password: 'secret' })).resolves.toBe(false);
    await expect(adapter.login({ email: 'demo@example.com', password: 'secret' })).resolves.toMatchObject({
      error: expect.stringContaining('invalidas'),
    });
  });

  it('persists a safe demo identity only for matching configured credentials', async () => {
    const persist = vi.fn((payload) => payload);
    const adapter = createDemoIdentityAdapter({
      email: 'demo@hortelan.local',
      password: 'configured-secret',
      persist,
      now: () => Date.parse('2026-08-10T12:00:00.000Z'),
    });
    await expect(
      adapter.login({ email: 'wrong@hortelan.local', password: 'configured-secret' })
    ).resolves.toHaveProperty('error');
    const result = await adapter.login({
      email: 'demo@hortelan.local',
      password: 'configured-secret',
      remember: true,
    });
    expect(result.user).not.toHaveProperty('password');
    expect(persist).toHaveBeenCalledWith(expect.objectContaining({ remember: true }));
  });

  it('bounds supported social providers', async () => {
    const adapter = createDemoIdentityAdapter({ password: 'configured-secret', persist: vi.fn((payload) => payload) });
    await expect(adapter.socialLogin({ provider: 'unknown' })).resolves.toHaveProperty('error');
    await expect(adapter.socialLogin({ provider: 'google' })).resolves.toHaveProperty('user');
  });
});
