const AUTH_STORAGE_KEY = 'hortelan-auth';
const SESSION_STORAGE_KEY = 'hortelan-auth-session-id';
const ACTIVE_SESSIONS_KEY = 'hortelan-active-sessions';

const USERS = [
  {
    id: 'admin-1',
    email: 'admin@hortelan.com',
    password: 'admin123',
    name: 'Administrador Hortelan',
    role: 'administrator',
  },
];

const getLocalJson = (key, fallback) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const setCurrentSessionId = (sessionId, persistent) => {
  if (persistent) {
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

const getCurrentSessionId = () => sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);

const clearCurrentSessionId = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

const getActiveSessions = () => getLocalJson(ACTIVE_SESSIONS_KEY, []);

const saveActiveSessions = (sessions) => {
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
};

const getUserByCredentials = ({ email, password }) => USERS.find((user) => user.email === email && user.password === password);

const getCurrentSession = () => {
  const sessionId = getCurrentSessionId();

  if (!sessionId) {
    return null;
  }

  return getActiveSessions().find((session) => session.id === sessionId) || null;
};

const persistAuthUser = (user, persistent) => {
  if (persistent) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const loginWithEmailAndPassword = ({ email, password, remember }) => {
  const user = getUserByCredentials({ email, password });

  if (!user) {
    return { error: 'Credenciais inválidas. Use admin@hortelan.com / admin123.' };
  }

  const now = new Date().toISOString();
  const sessionId = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const nextSession = {
    id: sessionId,
    userId: user.id,
    email: user.email,
    createdAt: now,
    lastActiveAt: now,
    persistent: Boolean(remember),
    userAgent: navigator.userAgent,
  };

  const sessions = getActiveSessions().filter((session) => session.userId !== user.id || session.id !== sessionId);
  sessions.push(nextSession);

  saveActiveSessions(sessions);
  setCurrentSessionId(sessionId, remember);

  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  persistAuthUser(safeUser, remember);

  return { user: safeUser, session: nextSession };
};

export const getAuthenticatedUser = () => {
  const session = getCurrentSession();

  if (!session) {
    clearCurrentSessionId();
    return null;
  }

  const user = USERS.find((item) => item.id === session.userId);

  if (!user) {
    clearCurrentSessionId();
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
};

export const isAuthenticated = () => Boolean(getAuthenticatedUser());

export const logoutCurrentSession = () => {
  const currentSessionId = getCurrentSessionId();

  if (!currentSessionId) {
    clearCurrentSessionId();
    return;
  }

  const sessions = getActiveSessions().filter((session) => session.id !== currentSessionId);
  saveActiveSessions(sessions);
  clearCurrentSessionId();
};

export const getUserSessions = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const currentSessionId = getCurrentSessionId();

  return getActiveSessions()
    .filter((session) => session.userId === user.id)
    .sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt))
    .map((session) => ({
      ...session,
      isCurrent: session.id === currentSessionId,
    }));
};

export const logoutAllSessions = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    clearCurrentSessionId();
    return;
  }

  const sessions = getActiveSessions().filter((session) => session.userId !== user.id);
  saveActiveSessions(sessions);
  clearCurrentSessionId();
};

export const logoutOtherSessions = () => {
  const user = getAuthenticatedUser();
  const currentSessionId = getCurrentSessionId();

  if (!user || !currentSessionId) {
    return;
  }

  const sessions = getActiveSessions().filter(
    (session) => session.userId !== user.id || session.id === currentSessionId
  );

  saveActiveSessions(sessions);
};
