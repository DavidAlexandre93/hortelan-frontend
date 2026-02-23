import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAuthenticatedUser,
  getUserSessions,
  isAuthenticated,
  loginWithEmailAndPassword,
  logoutAllSessions,
  logoutCurrentSession,
  logoutOtherSessions,
} from './session';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuthenticatedUser());
  const [sessions, setSessions] = useState(() => getUserSessions());

  const refreshAuthState = useCallback(() => {
    setUser(getAuthenticatedUser());
    setSessions(getUserSessions());
  }, []);

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  const login = useCallback(({ email, password, remember }) => {
    const result = loginWithEmailAndPassword({ email, password, remember });

    if (result.error) {
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

  const value = useMemo(
    () => ({
      user,
      sessions,
      authenticated: isAuthenticated(),
      login,
      logout,
      logoutAll,
      logoutOthers,
      refreshAuthState,
    }),
    [user, sessions, login, logout, logoutAll, logoutOthers, refreshAuthState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
