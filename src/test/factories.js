export function buildUser(overrides = {}) {
  return {
    id: 'user-test-1',
    email: 'teste@hortelan.local',
    name: 'Pessoa de Teste',
    role: 'operator',
    ...overrides,
  };
}

export function buildSession(overrides = {}) {
  return {
    id: 'session-test-1',
    expiresAt: '2026-08-11T12:00:00.000Z',
    ...overrides,
  };
}

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
