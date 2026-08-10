import { createId } from '../../utils/createId';
import {
  deactivateCurrentAccount,
  exportCurrentUserData,
  persistBackendIdentity,
  requestAccountDeletion,
  revokeCompromisedDevice,
  revokeTrustedDevice,
  rotateTrustedDeviceCredential,
  updateAuthenticatedUserProfile,
  updateTwoFactorSettings,
  updateUserConsents,
} from '../session';
import { buildDemoUser } from './demoFixtures';

export function createDemoIdentityAdapter({
  email = import.meta.env.VITE_DEMO_EMAIL ||
    (import.meta.env.DEV ? 'davidfernandes@hortelanagtech.com' : 'demo@hortelan.local'),
  password = import.meta.env.VITE_DEMO_PASSWORD || (import.meta.env.DEV ? 'admin' : ''),
  persist = persistBackendIdentity,
  now = () => Date.now(),
} = {}) {
  function establishDemoSession({ remember = false } = {}) {
    return persist({
      user: buildDemoUser(email),
      session: {
        id: createId('demo-session'),
        expiresAt: new Date(now() + 8 * 60 * 60 * 1000).toISOString(),
      },
      remember,
    });
  }

  return {
    name: 'demo',
    login: async ({ email: submittedEmail, password: submittedPassword, remember }) => {
      if (!password) {
        return { error: 'Credenciais de demonstracao nao foram configuradas.' };
      }

      if (submittedEmail.trim().toLowerCase() !== email.toLowerCase() || submittedPassword !== password) {
        return { error: 'Credenciais de demonstracao invalidas.' };
      }

      return establishDemoSession({ remember });
    },
    socialLogin: async ({ provider, remember }) => {
      if (!['google', 'apple'].includes(provider)) {
        return { error: 'Provedor social nao suportado.' };
      }

      return establishDemoSession({ remember });
    },
    updateTwoFactor: async (payload) => updateTwoFactorSettings(payload),
    updateConsents: async (payload) => updateUserConsents(payload),
    requestDeletion: async (payload) => requestAccountDeletion(payload),
    deactivateAccount: async (payload) => deactivateCurrentAccount(payload),
    exportPersonalData: async () => exportCurrentUserData(),
    updateProfile: async (payload) => updateAuthenticatedUserProfile(payload),
    revokeTrustedDevice: async ({ id }) => {
      revokeTrustedDevice(id);
      return { success: true };
    },
    rotateTrustedDevice: async ({ id }) => rotateTrustedDeviceCredential(id),
    compromiseTrustedDevice: async ({ id, reason }) => revokeCompromisedDevice(id, reason),
  };
}

export const demoIdentityAdapter = createDemoIdentityAdapter();
