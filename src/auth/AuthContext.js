import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo, useState } from 'react';
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
  cleanupLegacyIdentityStorage,
  persistBackendIdentity,
} from './session';
import { demoModeEnabled, identityFacade } from './identity/identityFacade';

const ENABLE_DEMO_AUTH = demoModeEnabled;

export const AuthContext = createContext(null);

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
  const isBrowser = typeof window !== 'undefined';

  useState(() => {
    if (isBrowser) cleanupLegacyIdentityStorage({ preserveDemoData: ENABLE_DEMO_AUTH });
    return true;
  });

  const [user, setUser] = useState(() => (isBrowser ? getAuthenticatedUser() : null));
  const [sessions, setSessions] = useState(() => (isBrowser ? getUserSessions() : []));
  const [twoFactor, setTwoFactor] = useState(() => (isBrowser ? getTwoFactorSettings() : { enabled: false }));
  const [trustedDevices, setTrustedDevices] = useState(() => (isBrowser ? getTrustedDevices() : []));
  const [consents, setConsents] = useState(() => (isBrowser ? getUserConsents() : {}));
  const [deletionRequest, setDeletionRequest] = useState(() => (isBrowser ? getAccountDeletionRequest() : null));
  const [consentLogs, setConsentLogs] = useState(() => (isBrowser ? getConsentAuditLogs() : []));
  const [retentionPolicy, setRetentionPolicy] = useState(() => (isBrowser ? getDataRetentionPolicy() : {}));

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

  const login = useCallback(
    async ({ email, password, remember, trustDevice, deviceName, challengeId, twoFactorCode }) => {
      let result;

      try {
        result = await identityFacade.login({
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
        } else {
          return { error: 'Serviço de autenticação indisponível. Tente novamente em instantes.' };
        }
      }

      result = ensureAuthResultShape(result);

      if (result.error || result.requiresTwoFactor) {
        return result;
      }

      let { user: authenticatedUser, session } = getAuthPayload(result);

      if (result.identitySource === 'backend' && authenticatedUser) {
        const persisted = persistBackendIdentity({ user: authenticatedUser, session, remember });
        authenticatedUser = persisted.user;
        session = persisted.session;
      }

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
    },
    []
  );

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
      result = await identityFacade.socialLogin({ provider, remember, trustDevice, deviceName });
    } catch (error) {
      const backendResult = getAuthResultFromBackendError(error);

      if (backendResult) {
        result = backendResult;
      } else {
        return { error: 'Serviço de autenticação social indisponível. Tente novamente em instantes.' };
      }
    }

    result = ensureAuthResultShape(result);

    if (result.error || result.requiresTwoFactor) {
      return result;
    }

    let { user: authenticatedUser, session } = getAuthPayload(result);

    if (result.identitySource === 'backend' && authenticatedUser) {
      const persisted = persistBackendIdentity({ user: authenticatedUser, session, remember });
      authenticatedUser = persisted.user;
      session = persisted.session;
    }

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

  const update2FASettings = useCallback(
    ({ enabled, method }) => {
      const result = updateTwoFactorSettings({ enabled, method });

      if (!result.error) {
        refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const removeTrustedDevice = useCallback(
    (trustedDeviceId) => {
      revokeTrustedDevice(trustedDeviceId);
      refreshAuthState();
    },
    [refreshAuthState]
  );

  const updateConsents = useCallback(
    (nextConsents) => {
      const result = updateUserConsents(nextConsents);

      if (!result.error) {
        refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const updateProfile = useCallback(
    (payload) => {
      const result = updateAuthenticatedUserProfile(payload);

      if (!result.error) {
        refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const requestDeletion = useCallback(
    (payload) => {
      const result = requestAccountDeletion(payload);

      if (!result.error) {
        refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const deactivateAccount = useCallback(
    (payload) => {
      const result = deactivateCurrentAccount(payload);

      refreshAuthState();
      return result;
    },
    [refreshAuthState]
  );

  const exportPersonalData = useCallback(() => exportCurrentUserData(), []);

  const rotateDeviceCredential = useCallback(
    (trustedDeviceId) => {
      const result = rotateTrustedDeviceCredential(trustedDeviceId);

      if (!result.error) {
        refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const revokeCompromised = useCallback(
    (trustedDeviceId, reason) => {
      const result = revokeCompromisedDevice(trustedDeviceId, reason);

      if (!result.error) {
        refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

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
      initialized: true,
      demoMode: ENABLE_DEMO_AUTH,
      authenticated: Boolean(user),
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
