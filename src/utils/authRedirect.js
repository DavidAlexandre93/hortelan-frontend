const DEFAULT_AUTH_REDIRECT = '/dashboard/app';

export function resolvePostAuthDestination(candidatePath) {
  if (typeof candidatePath !== 'string') {
    return DEFAULT_AUTH_REDIRECT;
  }

  const sanitizedPath = candidatePath.trim();

  if (!sanitizedPath || sanitizedPath === '/404') {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!sanitizedPath.startsWith('/')) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return sanitizedPath;
}

export { DEFAULT_AUTH_REDIRECT };
