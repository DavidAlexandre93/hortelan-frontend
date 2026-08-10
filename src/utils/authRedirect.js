const DEFAULT_AUTH_REDIRECT = '/dashboard/app';

export function isSafeInternalDestination(value) {
  if (typeof value !== 'string' || !value.startsWith('/dashboard')) return false;
  if (value.startsWith('//') || value.includes('\\') || /[\r\n]/.test(value)) return false;

  try {
    const parsed = new URL(value, 'https://hortelan.local');
    return parsed.origin === 'https://hortelan.local' && parsed.pathname.startsWith('/dashboard');
  } catch {
    return false;
  }
}

export function resolvePostAuthDestination({ search = '', stateFrom = '' } = {}) {
  const returnTo = new URLSearchParams(search).get('returnTo');
  if (isSafeInternalDestination(returnTo)) return returnTo;
  if (isSafeInternalDestination(stateFrom)) return stateFrom;
  return DEFAULT_AUTH_REDIRECT;
}

export { DEFAULT_AUTH_REDIRECT };
