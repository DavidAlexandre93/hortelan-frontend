import { backendIdentityAdapter } from './backendIdentityAdapter';

export const demoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

async function resolveDemoAdapter() {
  if (!demoModeEnabled) return null;
  const module = await import('./demoIdentityAdapter');
  return module.demoIdentityAdapter;
}

async function execute(method, payload) {
  try {
    const result = await backendIdentityAdapter[method](payload);
    return result && typeof result === 'object' ? { ...result, identitySource: 'backend' } : result;
  } catch (backendError) {
    const demoAdapter = await resolveDemoAdapter();
    if (!demoAdapter) throw backendError;
    const result = await demoAdapter[method](payload);
    return result && typeof result === 'object' ? { ...result, identitySource: 'demo' } : result;
  }
}

export const identityFacade = {
  login: (payload) => execute('login', payload),
  socialLogin: (payload) => execute('socialLogin', payload),
};
