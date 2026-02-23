import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAuthenticatedUser,
  getAccountDeletionRequest,
  getUserConsents,
  getTrustedDevices,
  getTwoFactorSettings,
  getUserSessions,
  isAuthenticated,
  loginWithEmailAndPassword,
  loginWithSocialProvider,
  logoutAllSessions,
  logoutCurrentSession,
  logoutOtherSessions,
  deactivateCurrentAccount,
  exportCurrentUserData,
  requestAccountDeletion,
  revokeTrustedDevice,
  updateUserConsents,
  updateAuthenticatedUserProfile,
  updateTwoFactorSettings,
} from './session';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuthenticatedUser());
  const [sessions, setSessions] = useState(() => getUserSessions());
  const [twoFactor, setTwoFactor] = useState(() => getTwoFactorSettings());
  const [trustedDevices, setTrustedDevices] = useState(() => getTrustedDevices());
  const [consents, setConsents] = useState(() => getUserConsents());
  const [deletionRequest, setDeletionRequest] = useState(() => getAccountDeletionRequest());

  const refreshAuthState = useCallback(() => {
    setUser(getAuthenticatedUser());
    setSessions(getUserSessions());
    setTwoFactor(getTwoFactorSettings());
    setTrustedDevices(getTrustedDevices());
    setConsents(getUserConsents());
    setDeletionRequest(getAccountDeletionRequest());
  }, []);

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  const login = useCallback(({ email, password, remember, trustDevice, deviceName, challengeId, twoFactorCode }) => {
    const result = loginWithEmailAndPassword({
      email,
      password,
      remember,
      trustDevice,
      deviceName,
      challengeId,
      twoFactorCode,
    });

    if (result.error || result.requiresTwoFactor) {
      return result;
    }

    refreshAuthState();
    return result;
  }, [refreshAuthState]);

  const logout = useCallback(() => {
    logoutCurrentSession();
    refreshAuthState();
  }, [refreshAuthState]);

  const logoutAll = useCallback(() => {
    logoutAllSessions();
    refreshAuthState();
  }, [refreshAuthState]);

  const logoutOthers = useCallback(() => {
    logoutOtherSessions();
    refreshAuthState();
  }, [refreshAuthState]);

  const loginWithSocial = useCallback(({ provider, remember, trustDevice, deviceName }) => {
    const result = loginWithSocialProvider({ provider, remember, trustDevice, deviceName });

    if (result.error || result.requiresTwoFactor) {
      return result;
    }

    refreshAuthState();
    return result;
  }, [refreshAuthState]);

  const update2FASettings = useCallback(({ enabled, method }) => {
    const result = updateTwoFactorSettings({ enabled, method });

    if (!result.error) {
      refreshAuthState();
    }

    return result;
  }, [refreshAuthState]);

  const removeTrustedDevice = useCallback((trustedDeviceId) => {
    revokeTrustedDevice(trustedDeviceId);
    refreshAuthState();
  }, [refreshAuthState]);

  const updateConsents = useCallback((nextConsents) => {
    const result = updateUserConsents(nextConsents);
  const updateProfile = useCallback((payload) => {
    const result = updateAuthenticatedUserProfile(payload);

    if (!result.error) {
      refreshAuthState();
    }

    return result;
  }, [refreshAuthState]);

  const requestDeletion = useCallback((payload) => {
    const result = requestAccountDeletion(payload);

    if (!result.error) {
      refreshAuthState();
    }

    return result;
  }, [refreshAuthState]);

  const deactivateAccount = useCallback((payload) => {
    const result = deactivateCurrentAccount(payload);

    refreshAuthState();
    return result;
  }, [refreshAuthState]);

  const exportPersonalData = useCallback(() => exportCurrentUserData(), []);

  const value = useMemo(
    () => ({
      user,
      sessions,
      twoFactor,
      trustedDevices,
      consents,
      deletionRequest,
      authenticated: isAuthenticated(),
      login,
      loginWithSocial,
      logout,
      logoutAll,
      logoutOthers,
      update2FASettings,
      removeTrustedDevice,
      updateConsents,
      requestDeletion,
      deactivateAccount,
      exportPersonalData,
      updateProfile,
      refreshAuthState,
    }),
    [
      user,
      sessions,
      twoFactor,
      trustedDevices,
      consents,
      deletionRequest,
      login,
      loginWithSocial,
      logout,
      logoutAll,
      logoutOthers,
      update2FASettings,
      removeTrustedDevice,
      updateConsents,
      requestDeletion,
      deactivateAccount,
      exportPersonalData,
      updateProfile,
      refreshAuthState,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
