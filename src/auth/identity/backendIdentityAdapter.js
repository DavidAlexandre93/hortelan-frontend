import { loginWithBackend, socialLoginWithBackend } from '../../services/authApi';
import { accountSecurityApi } from '../../services/accountSecurityApi';

export const backendIdentityAdapter = {
  name: 'backend',
  login: (payload) => loginWithBackend(payload),
  socialLogin: (payload) => socialLoginWithBackend(payload),
  updateTwoFactor: (payload) => accountSecurityApi.updateTwoFactor(payload),
  updateConsents: (payload) => accountSecurityApi.updateConsents(payload),
  requestDeletion: (payload) => accountSecurityApi.requestDeletion(payload),
  deactivateAccount: (payload) => accountSecurityApi.deactivateAccount(payload),
  exportPersonalData: () => accountSecurityApi.exportPersonalData(),
  updateProfile: (payload) => accountSecurityApi.updateProfile(payload),
  revokeTrustedDevice: ({ id }) => accountSecurityApi.revokeTrustedDevice(id),
  rotateTrustedDevice: ({ id }) => accountSecurityApi.rotateTrustedDevice(id),
  compromiseTrustedDevice: (payload) => accountSecurityApi.compromiseTrustedDevice(payload),
};
