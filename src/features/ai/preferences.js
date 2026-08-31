import { z } from 'zod';

const STORAGE_KEY = 'hortelan.ai.preferences.v1';

const preferencesSchema = z.object({
  consentPolicyVersion: z.string().max(80).nullable().default(null),
  personalization: z
    .object({
      profile: z.boolean().default(false),
      operation: z.boolean().default(false),
      behavior: z.boolean().default(false),
    })
    .default({ profile: false, operation: false, behavior: false }),
  mutedInsightTriggers: z
    .array(z.enum(['anomaly', 'recurring_alert', 'crop_stage', 'report_trend', 'knowledge_update']))
    .max(5)
    .default([]),
});

const DEFAULT_PREFERENCES = Object.freeze(preferencesSchema.parse({}));

export function readAiPreferences(storage = typeof window === 'undefined' ? null : window.localStorage) {
  if (!storage) return DEFAULT_PREFERENCES;
  try {
    const parsed = preferencesSchema.safeParse(JSON.parse(storage.getItem(STORAGE_KEY) || 'null'));
    return parsed.success ? parsed.data : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function writeAiPreferences(patch, storage = typeof window === 'undefined' ? null : window.localStorage) {
  const current = readAiPreferences(storage);
  const next = preferencesSchema.parse({
    ...current,
    ...patch,
    personalization: { ...current.personalization, ...(patch.personalization || {}) },
  });
  storage?.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function hasAiConsent(policyVersion, storage) {
  return readAiPreferences(storage).consentPolicyVersion === policyVersion;
}

export function clearAiPreferences(storage = typeof window === 'undefined' ? null : window.localStorage) {
  storage?.removeItem(STORAGE_KEY);
}

export const AI_PREFERENCES_STORAGE_KEY = STORAGE_KEY;
