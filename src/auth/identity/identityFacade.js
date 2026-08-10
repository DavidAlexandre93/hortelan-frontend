import { backendIdentityAdapter } from './backendIdentityAdapter';

export const demoModeEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

async function resolveConfiguredDemoAdapter() {
  if (!demoModeEnabled) return null;
  const module = await import('./demoIdentityAdapter');
  return module.demoIdentityAdapter;
}

export function createIdentityFacade({
  backendAdapter = backendIdentityAdapter,
  resolveDemoAdapter = resolveConfiguredDemoAdapter,
} = {}) {
  async function execute(method, payload) {
    try {
      const result = await backendAdapter[method](payload);
      return result && typeof result === 'object' ? { ...result, identitySource: 'backend' } : result;
    } catch (backendError) {
      const demoAdapter = await resolveDemoAdapter();
      if (!demoAdapter) throw backendError;
      const result = await demoAdapter[method](payload);
      return result && typeof result === 'object' ? { ...result, identitySource: 'demo' } : result;
    }
  }

  return {
    login: (payload) => execute('login', payload),
    socialLogin: (payload) => execute('socialLogin', payload),
    updateTwoFactor: (payload) => execute('updateTwoFactor', payload),
    updateConsents: (payload) => execute('updateConsents', payload),
    requestDeletion: (payload) => execute('requestDeletion', payload),
    deactivateAccount: (payload) => execute('deactivateAccount', payload),
    exportPersonalData: () => execute('exportPersonalData'),
    updateProfile: (payload) => execute('updateProfile', payload),
    revokeTrustedDevice: ({ trustedDeviceId }) => execute('revokeTrustedDevice', { id: trustedDeviceId }),
    rotateTrustedDevice: ({ trustedDeviceId }) => execute('rotateTrustedDevice', { id: trustedDeviceId }),
    compromiseTrustedDevice: ({ trustedDeviceId, reason }) =>
      execute('compromiseTrustedDevice', { id: trustedDeviceId, reason }),
  };
}

export const identityFacade = createIdentityFacade();
