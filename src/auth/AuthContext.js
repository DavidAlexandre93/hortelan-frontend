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
  logoutAllSessions,
  logoutCurrentSession,
  logoutOtherSessions,
  cleanupLegacyIdentityStorage,
  persistBackendIdentity,
  persistBackendUserProfile,
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

async function runIdentityOperation(method, payload) {
  try {
    const result = await identityFacade[method](payload);
    return result && typeof result === 'object' ? result : { success: true };
  } catch (error) {
    return { error: error?.message || 'Nao foi possivel concluir a operacao. Tente novamente.' };
  }
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
    async ({ enabled, method }) => {
      const result = await runIdentityOperation('updateTwoFactor', { enabled, method });

      if (!result.error) {
        if (result.settings) setTwoFactor(result.settings);
        else refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const removeTrustedDevice = useCallback(
    async (trustedDeviceId) => {
      const result = await runIdentityOperation('revokeTrustedDevice', { trustedDeviceId });
      if (!result.error) {
        if (result.devices) setTrustedDevices(result.devices);
        else refreshAuthState();
      }
      return result;
    },
    [refreshAuthState]
  );

  const updateConsents = useCallback(
    async (nextConsents) => {
      const result = await runIdentityOperation('updateConsents', nextConsents);

      if (!result.error) {
        if (result.consents) setConsents(result.consents);
        else refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const updateProfile = useCallback(
    async (payload) => {
      const result = await runIdentityOperation('updateProfile', payload);

      if (!result.error) {
        if (result.user) {
          const safeUser = persistBackendUserProfile(result.user) || result.user;
          setUser(safeUser);
        } else {
          refreshAuthState();
        }
      }

      return result;
    },
    [refreshAuthState]
  );

  const requestDeletion = useCallback(
    async (payload) => {
      const result = await runIdentityOperation('requestDeletion', payload);

      if (!result.error) {
        if (result.request) setDeletionRequest(result.request);
        else refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const deactivateAccount = useCallback(
    async (payload) => {
      const result = await runIdentityOperation('deactivateAccount', payload);
      if (!result.error) {
        logoutAllSessions();
        refreshAuthState();
      }
      return result;
    },
    [refreshAuthState]
  );

  const exportPersonalData = useCallback(() => runIdentityOperation('exportPersonalData'), []);

  const rotateDeviceCredential = useCallback(
    async (trustedDeviceId) => {
      const result = await runIdentityOperation('rotateTrustedDevice', { trustedDeviceId });

      if (!result.error) {
        if (result.devices) setTrustedDevices(result.devices);
        else refreshAuthState();
      }

      return result;
    },
    [refreshAuthState]
  );

  const revokeCompromised = useCallback(
    async (trustedDeviceId, reason) => {
      const result = await runIdentityOperation('compromiseTrustedDevice', { trustedDeviceId, reason });

      if (!result.error) {
        if (result.devices) setTrustedDevices(result.devices);
        else refreshAuthState();
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
