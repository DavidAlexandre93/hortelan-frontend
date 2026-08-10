import { loginWithEmailAndPassword, loginWithSocialProvider } from '../session';

export const demoIdentityAdapter = {
  name: 'demo',
  login: async (payload) => loginWithEmailAndPassword(payload),
  socialLogin: async (payload) => loginWithSocialProvider(payload),
};
