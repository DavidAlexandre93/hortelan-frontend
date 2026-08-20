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

async function sha256(value) {
  if (!globalThis.crypto?.subtle || typeof globalThis.TextEncoder === 'undefined') {
    throw new Error('SHA-256 indisponivel neste navegador.');
  }

  const encoded = new globalThis.TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function createDemoIdentityAdapter({
  email = import.meta.env.VITE_DEMO_EMAIL ||
    (import.meta.env.DEV ? 'davidfernandes@hortelanagtech.com' : 'demo@hortelan.local'),
  password = import.meta.env.VITE_DEMO_PASSWORD || (import.meta.env.DEV ? 'admin' : ''),
  emailHash = import.meta.env.VITE_DEMO_EMAIL_SHA256 || '',
  passwordHash = import.meta.env.VITE_DEMO_PASSWORD_SHA256 || '',
  persist = persistBackendIdentity,
  now = () => Date.now(),
  digest = sha256,
} = {}) {
  const hasPlaintextConfiguration = Boolean(email && password);
  const hasHashConfiguration = Boolean(emailHash && passwordHash);

  async function credentialsMatch({ email: submittedEmail = '', password: submittedPassword = '' }) {
    const normalizedEmail = submittedEmail.trim().toLowerCase();

    if (hasPlaintextConfiguration) {
      return normalizedEmail === email.toLowerCase() && submittedPassword === password;
    }

    if (!hasHashConfiguration) return false;

    try {
      const [submittedEmailHash, submittedPasswordHash] = await Promise.all([
        digest(normalizedEmail),
        digest(submittedPassword),
      ]);
      return submittedEmailHash === emailHash && submittedPasswordHash === passwordHash;
    } catch {
      return false;
    }
  }

  function establishDemoSession({ authenticatedEmail, remember = false } = {}) {
    return persist({
      user: buildDemoUser(authenticatedEmail),
      session: {
        id: createId('demo-session'),
        expiresAt: new Date(now() + 8 * 60 * 60 * 1000).toISOString(),
      },
      remember,
    });
  }

  return {
    name: 'demo',
    canHandleLogin: (payload) => credentialsMatch(payload),
    login: async ({ email: submittedEmail, password: submittedPassword, remember }) => {
      if (!hasPlaintextConfiguration && !hasHashConfiguration) {
        return { error: 'Credenciais de demonstracao nao foram configuradas.' };
      }

      if (!(await credentialsMatch({ email: submittedEmail, password: submittedPassword }))) {
        return { error: 'Credenciais de demonstracao invalidas.' };
      }

      return establishDemoSession({ authenticatedEmail: submittedEmail.trim().toLowerCase(), remember });
    },
    socialLogin: async ({ provider, remember }) => {
      if (!['google', 'apple'].includes(provider)) {
        return { error: 'Provedor social nao suportado.' };
      }

      return establishDemoSession({ authenticatedEmail: email, remember });
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
