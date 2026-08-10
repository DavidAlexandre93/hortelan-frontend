import { loginWithBackend, socialLoginWithBackend } from '../../services/authApi';

export const backendIdentityAdapter = {
  name: 'backend',
  login: (payload) => loginWithBackend(payload),
  socialLogin: (payload) => socialLoginWithBackend(payload),
};
