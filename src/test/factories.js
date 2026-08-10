export function buildAuthContext(overrides = {}) {
  return {
    user: null,
    authenticated: false,
    initialized: true,
    demoMode: false,
    login: async () => ({}),
    loginWithSocial: async () => ({}),
    ...overrides,
  };
}
