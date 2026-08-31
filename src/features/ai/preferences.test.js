import { describe, expect, it } from 'vitest';
import {
  AI_PREFERENCES_STORAGE_KEY,
  clearAiPreferences,
  hasAiConsent,
  readAiPreferences,
  writeAiPreferences,
} from './preferences';

describe('AI preferences', () => {
  it('persiste somente preferencias nao sensiveis aprovadas', () => {
    const preferences = writeAiPreferences({
      consentPolicyVersion: 'policy-v1',
      personalization: { operation: true },
      prompt: 'conteudo que nao pode ser persistido',
    });
    expect(preferences.personalization.operation).toBe(true);
    expect(hasAiConsent('policy-v1')).toBe(true);
    expect(window.localStorage.getItem(AI_PREFERENCES_STORAGE_KEY)).not.toContain('conteudo');
  });

  it('usa fallback neutro para storage invalido', () => {
    window.localStorage.setItem(AI_PREFERENCES_STORAGE_KEY, '{invalid');
    expect(readAiPreferences()).toMatchObject({
      consentPolicyVersion: null,
      personalization: { profile: false, operation: false, behavior: false },
    });
    clearAiPreferences();
    expect(window.localStorage.getItem(AI_PREFERENCES_STORAGE_KEY)).toBeNull();
  });
});
