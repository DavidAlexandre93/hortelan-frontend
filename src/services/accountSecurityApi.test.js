// @vitest-environment node
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiUrl, server } from '../test/server';
import { API_ERROR_KINDS } from './apiClient';
import { accountSecurityApi } from './accountSecurityApi';

describe('account security API contracts', () => {
  it('validates MFA settings confirmed by the backend', async () => {
    server.use(
      http.put(apiUrl('/auth/mfa/settings'), async ({ request }) => {
        expect(await request.json()).toEqual({ enabled: true, method: 'authenticator' });
        return HttpResponse.json({
          success: true,
          settings: { enabled: true, method: 'authenticator' },
        });
      })
    );
    await expect(accountSecurityApi.updateTwoFactor({ enabled: true, method: 'authenticator' })).resolves.toMatchObject(
      {
        settings: { enabled: true, method: 'authenticator' },
      }
    );
  });

  it('rejects malformed security and profile responses', async () => {
    server.use(
      http.put(apiUrl('/auth/mfa/settings'), () =>
        HttpResponse.json({ success: true, settings: { enabled: true, method: 'sms' } })
      ),
      http.put(apiUrl('/profile'), () =>
        HttpResponse.json({ success: true, user: { id: '1', email: 'invalid', name: '' } })
      )
    );
    await expect(accountSecurityApi.updateTwoFactor({ enabled: true, method: 'email' })).rejects.toMatchObject({
      kind: API_ERROR_KINDS.CONTRACT,
    });
    await expect(accountSecurityApi.updateProfile({ name: 'Teste' })).rejects.toMatchObject({
      kind: API_ERROR_KINDS.CONTRACT,
    });
  });

  it('encodes trusted-device identifiers in mutation paths', async () => {
    server.use(
      http.delete(apiUrl('/auth/trusted-devices/device%2Funsafe'), () => HttpResponse.json({ success: true }))
    );
    await expect(accountSecurityApi.revokeTrustedDevice('device/unsafe')).resolves.toMatchObject({ success: true });
  });
});
