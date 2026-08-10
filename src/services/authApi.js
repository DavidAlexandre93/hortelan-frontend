import { z } from 'zod';
import { apiRequest } from './apiClient';

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  socialLogin: '/auth/social-login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  validateResetToken: '/auth/validate-reset-token',
};

const safeUserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    email: z.string().email(),
    name: z.string().min(1),
    role: z.string().optional(),
    photoURL: z.string().optional(),
  })
  .passthrough();

const sessionSchema = z
  .object({
    id: z.string(),
    expiresAt: z.string().optional(),
  })
  .passthrough();

const authResponseSchema = z
  .object({
    user: safeUserSchema.optional(),
    session: sessionSchema.optional(),
    requiresTwoFactor: z.boolean().optional(),
    challengeId: z.string().optional(),
    method: z.string().optional(),
    deliveryHint: z.string().optional(),
    data: z.object({ user: safeUserSchema.optional(), session: sessionSchema.optional() }).passthrough().optional(),
  })
  .passthrough();

const actionResponseSchema = z
  .object({
    message: z.string().optional(),
    success: z.boolean().optional(),
  })
  .passthrough();

const resetValidationSchema = z.object({ valid: z.boolean(), error: z.string().optional() }).passthrough();

export function loginWithBackend(payload) {
  return apiRequest(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload),
    schema: authResponseSchema,
    retryAttempts: 0,
  });
}

export function socialLoginWithBackend(payload) {
  return apiRequest(AUTH_ENDPOINTS.socialLogin, {
    method: 'POST',
    body: JSON.stringify(payload),
    schema: authResponseSchema,
    retryAttempts: 0,
  });
}

export function registerWithBackend(payload) {
  return apiRequest(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload),
    schema: actionResponseSchema,
    retryAttempts: 0,
  });
}

export function requestResetWithBackend(email) {
  return apiRequest(AUTH_ENDPOINTS.forgotPassword, {
    method: 'POST',
    body: JSON.stringify({ email }),
    schema: actionResponseSchema,
    retryAttempts: 0,
  });
}

export function validateResetTokenWithBackend(token, options = {}) {
  if (!token) return Promise.resolve({ valid: false, error: 'Token invalido' });
  return apiRequest(`${AUTH_ENDPOINTS.validateResetToken}?token=${encodeURIComponent(token)}`, {
    ...options,
    schema: resetValidationSchema,
  });
}

export function resetPasswordWithBackend({ token, password }) {
  return apiRequest(AUTH_ENDPOINTS.resetPassword, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
    schema: actionResponseSchema,
    retryAttempts: 0,
  });
}
