import { apiRequest } from './apiClient';

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  socialLogin: '/auth/social-login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  validateResetToken: '/auth/validate-reset-token',
};

export async function loginWithBackend(payload) {
  return apiRequest(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function socialLoginWithBackend(payload) {
  return apiRequest(AUTH_ENDPOINTS.socialLogin, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerWithBackend(payload) {
  return apiRequest(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestResetWithBackend(email) {
  return apiRequest(AUTH_ENDPOINTS.forgotPassword, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function validateResetTokenWithBackend(token) {
  if (!token) {
    return { valid: false, error: 'Token inválido' };
  }

  return apiRequest(`${AUTH_ENDPOINTS.validateResetToken}?token=${encodeURIComponent(token)}`);
}

export async function resetPasswordWithBackend({ token, password }) {
  return apiRequest(AUTH_ENDPOINTS.resetPassword, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}
