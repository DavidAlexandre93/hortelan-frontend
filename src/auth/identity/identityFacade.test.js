import { describe, expect, it, vi } from 'vitest';
import { createIdentityFacade } from './identityFacade';

describe('identity facade', () => {
  it('keeps backend identity authoritative when demo mode is unavailable', async () => {
    const backendError = new Error('backend unavailable');
    const facade = createIdentityFacade({
      backendAdapter: { updateConsents: vi.fn().mockRejectedValue(backendError) },
      resolveDemoAdapter: vi.fn().mockResolvedValue(null),
    });

    await expect(facade.updateConsents({ analytics: false })).rejects.toBe(backendError);
  });

  it('labels confirmed backend outcomes', async () => {
    const facade = createIdentityFacade({
      backendAdapter: { updateTwoFactor: vi.fn().mockResolvedValue({ success: true }) },
      resolveDemoAdapter: vi.fn(),
    });
    await expect(facade.updateTwoFactor({ enabled: true, method: 'email' })).resolves.toMatchObject({
      success: true,
      identitySource: 'backend',
    });
  });

  it('uses an explicitly supplied demo adapter only after backend failure', async () => {
    const demoOperation = vi.fn().mockResolvedValue({ success: true });
    const facade = createIdentityFacade({
      backendAdapter: { requestDeletion: vi.fn().mockRejectedValue(new Error('offline')) },
      resolveDemoAdapter: vi.fn().mockResolvedValue({ requestDeletion: demoOperation }),
    });
    await expect(facade.requestDeletion({ reason: 'teste' })).resolves.toMatchObject({ identitySource: 'demo' });
    expect(demoOperation).toHaveBeenCalledWith({ reason: 'teste' });
  });
});
