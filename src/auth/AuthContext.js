import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAuthenticatedUser,
  getAccountDeletionRequest,
  getUserConsents,
  getTrustedDevices,
  getTwoFactorSettings,
  getUserSessions,
  getConsentAuditLogs,
  getDataRetentionPolicy,
  rotateTrustedDeviceCredential,
  revokeCompromisedDevice,
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
import { loginWithBackend, socialLoginWithBackend } from '../services/authApi';

const ENABLE_DEMO_AUTH = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

export const AuthContext = createContext(null);

function isApiBaseUrlLikelyMisconfigured(error) {
  if (typeof window === 'undefined') {
    return false;
  }

  const currentHost = window.location?.hostname || '';
  const isLocalEnvironment = ['localhost', '127.0.0.1', '0.0.0.0'].includes(currentHost);

  if (isLocalEnvironment) {
    return false;
  }

  return error?.status === 404 || error?.status === 405;
}

function isRunningLocallyWithVite() {
  if (typeof window === 'undefined') {
    return false;
  }

  const currentHost = window.location?.hostname || '';
  const isLocalEnvironment = ['localhost', '127.0.0.1', '0.0.0.0'].includes(currentHost);

  return Boolean(import.meta.env.DEV) && isLocalEnvironment;
}

function canUseDemoAuthFallback(error) {
  if (ENABLE_DEMO_AUTH || isRunningLocallyWithVite()) {
    return true;
  }

  return isApiBaseUrlLikelyMisconfigured(error);
}


function getAuthPayload(result) {
  if (!result || typeof result !== 'object') {
    return { user: null, session: null };
  }

  if (result.user || result.session) {
    return {
      user: result.user || null,
      session: result.session || null,
    };
  }

  if (result.data && typeof result.data === 'object') {
    return {
      user: result.data.user || null,
      session: result.data.session || null,
    };
  }

  return { user: null, session: null };
}

function ensureAuthResultShape(result) {
  if (result && typeof result === 'object') {
    return result;
  }

  return { error: 'Resposta de autenticação inválida. Tente novamente.' };
}

function getAuthResultFromBackendError(error) {
  const payload = error?.payload;

  if (payload && typeof payload === 'object') {
    if (payload.requiresTwoFactor) {
      return payload;
    }

    if (payload.data && typeof payload.data === 'object' && payload.data.requiresTwoFactor) {
      return payload.data;
    }

    if (payload.error) {
      return { error: payload.error };
    }

    if (payload.message) {
      return { error: payload.message };
    }
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuthenticatedUser());
  const [sessions, setSessions] = useState(() => getUserSessions());
  const [twoFactor, setTwoFactor] = useState(() => getTwoFactorSettings());
  const [trustedDevices, setTrustedDevices] = useState(() => getTrustedDevices());
  const [consents, setConsents] = useState(() => getUserConsents());
  const [deletionRequest, setDeletionRequest] = useState(() => getAccountDeletionRequest());
  const [consentLogs, setConsentLogs] = useState(() => getConsentAuditLogs());
  const [retentionPolicy, setRetentionPolicy] = useState(() => getDataRetentionPolicy());

  const refreshAuthState = useCallback(() => {
    setUser(getAuthenticatedUser());
    setSessions(getUserSessions());
    setTwoFactor(getTwoFactorSettings());
    setTrustedDevices(getTrustedDevices());
    setConsents(getUserConsents());
    setDeletionRequest(getAccountDeletionRequest());
    setConsentLogs(getConsentAuditLogs());
    setRetentionPolicy(getDataRetentionPolicy());
  }, []);

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  const login = useCallback(async ({ email, password, remember, trustDevice, deviceName, challengeId, twoFactorCode }) => {
    let result;

    try {
      result = await loginWithBackend({
        email,
        password,
        remember,
        trustDevice,
        deviceName,
        challengeId,
        twoFactorCode,
      });
    } catch (error) {
      const backendResult = getAuthResultFromBackendError(error);

      if (backendResult) {
        result = backendResult;
      } else if (!canUseDemoAuthFallback(error)) {
        return { error: 'Serviço de autenticação indisponível. Tente novamente em instantes.' };
      } else {
        result = loginWithEmailAndPassword({
          email,
          password,
          remember,
          trustDevice,
          deviceName,
          challengeId,
          twoFactorCode,
        });
      }
    }

    result = ensureAuthResultShape(result);

    if (result.error || result.requiresTwoFactor) {
      return result;
    }

    const { user: authenticatedUser, session } = getAuthPayload(result);

    if (authenticatedUser) {
      setUser(authenticatedUser);
    } else {
      setUser(getAuthenticatedUser());
    }

    if (session) {
      setSessions((previousSessions) => {
        const nextSessions = previousSessions.filter((item) => item.id !== session.id);
        return [...nextSessions, session];
      });
    } else {
      setSessions(getUserSessions());
    }

    setTwoFactor(getTwoFactorSettings());
    setTrustedDevices(getTrustedDevices());
    setConsents(getUserConsents());
    setDeletionRequest(getAccountDeletionRequest());
    setConsentLogs(getConsentAuditLogs());
    setRetentionPolicy(getDataRetentionPolicy());

    return result;
  }, []);

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

  const loginWithSocial = useCallback(async ({ provider, remember, trustDevice, deviceName }) => {
    let result;

    try {
      result = await socialLoginWithBackend({ provider, remember, trustDevice, deviceName });
    } catch (error) {
      const backendResult = getAuthResultFromBackendError(error);

      if (backendResult) {
        result = backendResult;
      } else if (!canUseDemoAuthFallback(error)) {
        return { error: 'Serviço de autenticação social indisponível. Tente novamente em instantes.' };
      } else {
        result = loginWithSocialProvider({ provider, remember, trustDevice, deviceName });
      }
    }

    result = ensureAuthResultShape(result);

    if (result.error || result.requiresTwoFactor) {
      return result;
    }

    const { user: authenticatedUser, session } = getAuthPayload(result);

    if (authenticatedUser) {
      setUser(authenticatedUser);
    } else {
      setUser(getAuthenticatedUser());
    }

    if (session) {
      setSessions((previousSessions) => {
        const nextSessions = previousSessions.filter((item) => item.id !== session.id);
        return [...nextSessions, session];
      });
    } else {
      setSessions(getUserSessions());
    }

    setTwoFactor(getTwoFactorSettings());
    setTrustedDevices(getTrustedDevices());
    setConsents(getUserConsents());
    setDeletionRequest(getAccountDeletionRequest());
    setConsentLogs(getConsentAuditLogs());
    setRetentionPolicy(getDataRetentionPolicy());

    return result;
  }, []);

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

    if (!result.error) {
      refreshAuthState();
    }

    return result;
  }, [refreshAuthState]);

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


  const rotateDeviceCredential = useCallback((trustedDeviceId) => {
    const result = rotateTrustedDeviceCredential(trustedDeviceId);

    if (!result.error) {
      refreshAuthState();
    }

    return result;
  }, [refreshAuthState]);

  const revokeCompromised = useCallback((trustedDeviceId, reason) => {
    const result = revokeCompromisedDevice(trustedDeviceId, reason);

    if (!result.error) {
      refreshAuthState();
    }

    return result;
  }, [refreshAuthState]);

  const value = useMemo(
    () => ({
      user,
      sessions,
      twoFactor,
      trustedDevices,
      consents,
      deletionRequest,
      consentLogs,
      retentionPolicy,
      authenticated: Boolean(user) || isAuthenticated(),
      login,
      loginWithSocial,
      logout,
      logoutAll,
      logoutOthers,
      update2FASettings,
      removeTrustedDevice,
      rotateDeviceCredential,
      revokeCompromised,
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
      consentLogs,
      retentionPolicy,
      login,
      loginWithSocial,
      logout,
      logoutAll,
      logoutOthers,
      update2FASettings,
      removeTrustedDevice,
      rotateDeviceCredential,
      revokeCompromised,
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
