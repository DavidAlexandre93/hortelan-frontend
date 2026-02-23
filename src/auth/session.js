const AUTH_STORAGE_KEY = 'hortelan-auth';
const SESSION_STORAGE_KEY = 'hortelan-auth-session-id';
const ACTIVE_SESSIONS_KEY = 'hortelan-active-sessions';
const USERS_STORAGE_KEY = 'hortelan-users';
const RESET_TOKENS_KEY = 'hortelan-reset-tokens';
const PASSWORD_HISTORY_KEY = 'hortelan-password-history';
const RESET_TOKEN_EXPIRY_MINUTES = 30;

const USERS = [
  {
    id: 'admin-1',
    email: 'admin@hortelan.com',
    password: 'admin123',
    name: 'Administrador Hortelan',
    role: 'administrator',
  },
];

const INITIAL_PASSWORD_HISTORY = [
  {
    id: `pwd-history-${Date.now()}`,
    userId: 'admin-1',
    userEmail: 'admin@hortelan.com',
    changedAt: new Date().toISOString(),
    method: 'seed',
    changedBy: 'system',
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

const getUsers = () => getLocalJson(USERS_STORAGE_KEY, USERS);

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getResetTokens = () => getLocalJson(RESET_TOKENS_KEY, []);

const saveResetTokens = (tokens) => {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
};

const getPasswordHistory = () => getLocalJson(PASSWORD_HISTORY_KEY, INITIAL_PASSWORD_HISTORY);

const savePasswordHistory = (history) => {
  localStorage.setItem(PASSWORD_HISTORY_KEY, JSON.stringify(history));
};

const appendPasswordHistory = ({ user, method, changedBy }) => {
  const history = getPasswordHistory();
  history.push({
    id: `pwd-history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId: user.id,
    userEmail: user.email,
    changedAt: new Date().toISOString(),
    method,
    changedBy,
  });
  savePasswordHistory(history);
};

const saveActiveSessions = (sessions) => {
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
};

const getUserByCredentials = ({ email, password }) =>
  getUsers().find((user) => user.email === email && user.password === password);

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

  const user = getUsers().find((item) => item.id === session.userId);

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

export const requestPasswordReset = (email) => {
  const user = getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return {
      message:
        'Se o e-mail existir, você receberá um link para redefinir sua senha.',
      resetLink: null,
    };
  }

  const now = Date.now();
  const expiresAt = new Date(now + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();
  const token = `rst-${now}-${Math.random().toString(36).slice(2, 10)}`;

  const activeTokens = getResetTokens().filter((item) => item.userId !== user.id || item.usedAt);
  activeTokens.push({
    token,
    userId: user.id,
    createdAt: new Date(now).toISOString(),
    expiresAt,
    usedAt: null,
  });
  saveResetTokens(activeTokens);

  return {
    message: 'Link de redefinição gerado com sucesso.',
    resetLink: `${window.location.origin}/reset-password?token=${token}`,
    expiresAt,
  };
};

export const validatePasswordResetToken = (token) => {
  if (!token) {
    return { valid: false, error: 'Token não informado.' };
  }

  const tokenEntry = getResetTokens().find((item) => item.token === token);

  if (!tokenEntry) {
    return { valid: false, error: 'Token inválido.' };
  }

  if (tokenEntry.usedAt) {
    return { valid: false, error: 'Este token já foi utilizado.' };
  }

  if (new Date(tokenEntry.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'Token expirado. Solicite um novo link.' };
  }

  return { valid: true, tokenEntry };
};

export const resetPasswordWithToken = ({ token, newPassword }) => {
  const validation = validatePasswordResetToken(token);

  if (!validation.valid) {
    return { error: validation.error };
  }

  const { tokenEntry } = validation;
  const users = getUsers();
  const user = users.find((item) => item.id === tokenEntry.userId);

  if (!user) {
    return { error: 'Usuário não encontrado para este token.' };
  }

  const updatedUsers = users.map((item) => (item.id === user.id ? { ...item, password: newPassword } : item));
  saveUsers(updatedUsers);

  const updatedTokens = getResetTokens().map((item) =>
    item.token === token ? { ...item, usedAt: new Date().toISOString() } : item
  );
  saveResetTokens(updatedTokens);

  appendPasswordHistory({
    user,
    method: 'reset-token',
    changedBy: user.email,
  });

  return { success: true };
};

export const getPasswordChangeHistory = () =>
  getPasswordHistory().sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

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
