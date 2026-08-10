import { z } from 'zod';
import { apiRequest } from './apiClient';

const safeUserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    email: z.string().email(),
    name: z.string().min(1),
    role: z.string().optional(),
    photoURL: z.string().optional(),
  })
  .passthrough();

const actionSchema = z
  .object({
    success: z.boolean().optional(),
    message: z.string().optional(),
  })
  .passthrough();

const mfaSettingsSchema = actionSchema.extend({
  settings: z.object({ enabled: z.boolean(), method: z.enum(['email', 'authenticator']) }).optional(),
});

const consentSchema = actionSchema.extend({
  consents: z
    .object({
      cookies: z.boolean().optional(),
      notifications: z.boolean().optional(),
      marketing: z.boolean().optional(),
      analytics: z.boolean().optional(),
      communications: z.boolean().optional(),
      privacyMode: z.enum(['restricted', 'balanced', 'personalized']).optional(),
      updatedAt: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

const deviceSchema = z
  .object({
    id: z.string(),
    deviceName: z.string().optional(),
    trustedAt: z.string().optional(),
    expiresAt: z.string().optional(),
    credentialVersion: z.number().optional(),
    status: z.string().optional(),
  })
  .passthrough();

const deviceActionSchema = actionSchema.extend({ devices: z.array(deviceSchema).optional() });
const profileSchema = actionSchema.extend({ user: safeUserSchema.optional() });
const deletionSchema = actionSchema.extend({
  request: z.object({ id: z.string(), requestedAt: z.string(), status: z.string() }).passthrough().optional(),
});
const exportSchema = z.record(z.string(), z.unknown());

function mutation(path, method, payload, schema = actionSchema) {
  return apiRequest(path, {
    method,
    body: payload === undefined ? undefined : JSON.stringify(payload),
    schema,
    retryAttempts: 0,
  });
}

export const accountSecurityApi = {
  updateTwoFactor: (payload) => mutation('/auth/mfa/settings', 'PUT', payload, mfaSettingsSchema),
  updateConsents: (payload) => mutation('/auth/consents', 'PUT', payload, consentSchema),
  requestDeletion: (payload) => mutation('/auth/account/deletion-request', 'POST', payload, deletionSchema),
  deactivateAccount: (payload) => mutation('/auth/account/deactivate', 'POST', payload),
  exportPersonalData: () => apiRequest('/auth/account/export', { schema: exportSchema }),
  updateProfile: (payload) => mutation('/profile', 'PUT', payload, profileSchema),
  revokeTrustedDevice: (id) => mutation(`/auth/trusted-devices/${encodeURIComponent(id)}`, 'DELETE'),
  rotateTrustedDevice: (id) =>
    mutation(`/auth/trusted-devices/${encodeURIComponent(id)}/rotate`, 'POST', undefined, deviceActionSchema),
  compromiseTrustedDevice: ({ id, reason }) =>
    mutation(`/auth/trusted-devices/${encodeURIComponent(id)}/compromise`, 'POST', { reason }, deviceActionSchema),
};
