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
  const withIdentitySource = (result, identitySource) =>
    result && typeof result === 'object' ? { ...result, identitySource } : result;

  async function execute(method, payload, configuredDemoAdapter) {
    try {
      const result = await backendAdapter[method](payload);
      return withIdentitySource(result, 'backend');
    } catch (backendError) {
      const demoAdapter = configuredDemoAdapter === undefined ? await resolveDemoAdapter() : configuredDemoAdapter;
      if (!demoAdapter) throw backendError;
      const result = await demoAdapter[method](payload);
      return withIdentitySource(result, 'demo');
    }
  }

  async function login(payload) {
    const demoAdapter = await resolveDemoAdapter();

    if (demoAdapter?.canHandleLogin && (await demoAdapter.canHandleLogin(payload))) {
      return withIdentitySource(await demoAdapter.login(payload), 'demo');
    }

    return execute('login', payload, demoAdapter);
  }

  async function socialLogin(payload) {
    const demoAdapter = await resolveDemoAdapter();

    if (demoAdapter) {
      return withIdentitySource(await demoAdapter.socialLogin(payload), 'demo');
    }

    return execute('socialLogin', payload, null);
  }

  return {
    login,
    socialLogin,
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
