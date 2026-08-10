let fallbackSequence = 0;

export function createId(prefix = 'item') {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  fallbackSequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${fallbackSequence.toString(36)}`;
}
