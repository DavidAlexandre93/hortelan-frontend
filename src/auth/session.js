const AUTH_STORAGE_KEY = 'hortelan-auth';
const SESSION_STORAGE_KEY = 'hortelan-auth-session-id';
const ACTIVE_SESSIONS_KEY = 'hortelan-active-sessions';
const USERS_STORAGE_KEY = 'hortelan-users';
const RESET_TOKENS_KEY = 'hortelan-reset-tokens';
const PASSWORD_HISTORY_KEY = 'hortelan-password-history';
const MFA_SETTINGS_KEY = 'hortelan-mfa-settings';
const MFA_CHALLENGES_KEY = 'hortelan-mfa-challenges';
const TRUSTED_DEVICES_KEY = 'hortelan-trusted-devices';
const DEVICE_STORAGE_KEY = 'hortelan-device-id';
const RESET_TOKEN_EXPIRY_MINUTES = 30;
const MFA_CODE_EXPIRY_MINUTES = 5;
const TRUSTED_DEVICE_EXPIRY_DAYS = 30;

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

const INITIAL_MFA_SETTINGS = {
  'admin-1': {
    enabled: true,
    method: 'email',
  },
};

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

const getMfaSettingsMap = () => getLocalJson(MFA_SETTINGS_KEY, INITIAL_MFA_SETTINGS);

const saveMfaSettingsMap = (settings) => {
  localStorage.setItem(MFA_SETTINGS_KEY, JSON.stringify(settings));
};

const getMfaChallenges = () => getLocalJson(MFA_CHALLENGES_KEY, []);

const saveMfaChallenges = (challenges) => {
  localStorage.setItem(MFA_CHALLENGES_KEY, JSON.stringify(challenges));
};

const getTrustedDevicesStore = () => getLocalJson(TRUSTED_DEVICES_KEY, []);

const saveTrustedDevicesStore = (devices) => {
  localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
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

const getCurrentDeviceId = () => {
  const existingId = localStorage.getItem(DEVICE_STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const nextId = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(DEVICE_STORAGE_KEY, nextId);
  return nextId;
};

const getDefaultDeviceName = () => {
  const platform = navigator.platform || 'Plataforma desconhecida';
  const language = navigator.language || 'N/A';
  return `${platform} (${language})`;
};

const isTrustedDeviceForUser = (userId, deviceId) => {
  const now = Date.now();

  return getTrustedDevicesStore().some(
    (device) =>
      device.userId === userId &&
      device.deviceId === deviceId &&
      new Date(device.expiresAt).getTime() > now
  );
};

const buildTwoFactorChallenge = ({ user, method }) => {
  const now = Date.now();
  const expiresAt = new Date(now + MFA_CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();
  const code = `${Math.floor(100000 + Math.random() * 900000)}`;
  const challengeId = `mfa-${now}-${Math.random().toString(36).slice(2, 8)}`;
  const deliveryHint = method === 'email' ? user.email.replace(/(^.).*(@.*$)/, '$1***$2') : 'App autenticador';

  const nextChallenges = getMfaChallenges().filter(
    (challenge) => challenge.userId !== user.id || challenge.usedAt || new Date(challenge.expiresAt).getTime() > now
  );

  nextChallenges.push({
    id: challengeId,
    userId: user.id,
    method,
    code,
    createdAt: new Date(now).toISOString(),
    expiresAt,
    usedAt: null,
  });

  saveMfaChallenges(nextChallenges);

  return {
    requiresTwoFactor: true,
    challengeId,
    method,
    deliveryHint,
    expiresAt,
    demoCode: code,
  };
};

const validateTwoFactorChallenge = ({ challengeId, code, userId }) => {
  if (!challengeId) {
    return { valid: false, error: 'Desafio de 2FA não informado.' };
  }

  const challenge = getMfaChallenges().find((item) => item.id === challengeId);

  if (!challenge || challenge.userId !== userId) {
    return { valid: false, error: 'Desafio de 2FA inválido para este usuário.' };
  }

  if (challenge.usedAt) {
    return { valid: false, error: 'Este código 2FA já foi utilizado.' };
  }

  if (new Date(challenge.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'Código 2FA expirado. Gere um novo código.' };
  }

  if (challenge.code !== code) {
    return { valid: false, error: 'Código 2FA inválido.' };
  }

  const updatedChallenges = getMfaChallenges().map((item) =>
    item.id === challengeId ? { ...item, usedAt: new Date().toISOString() } : item
  );
  saveMfaChallenges(updatedChallenges);

  return { valid: true, method: challenge.method };
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

export const loginWithEmailAndPassword = ({
  email,
  password,
  remember,
  trustDevice,
  deviceName,
  challengeId,
  twoFactorCode,
}) => {
  const user = getUserByCredentials({ email, password });

  if (!user) {
    return { error: 'Credenciais inválidas. Use admin@hortelan.com / admin123.' };
  }

  const mfaSettings = getMfaSettingsMap()[user.id] || { enabled: false, method: 'email' };
  const currentDeviceId = getCurrentDeviceId();
  const trustedDevice = isTrustedDeviceForUser(user.id, currentDeviceId);

  if (mfaSettings.enabled && !trustedDevice) {
    if (!challengeId || !twoFactorCode) {
      return buildTwoFactorChallenge({ user, method: mfaSettings.method });
    }

    const challengeValidation = validateTwoFactorChallenge({
      challengeId,
      code: `${twoFactorCode}`,
      userId: user.id,
    });

    if (!challengeValidation.valid) {
      return { error: challengeValidation.error };
    }
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
    authMethod: 'password',
    trustedDeviceId: currentDeviceId,
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

  if (trustDevice) {
    const currentName = deviceName?.trim() || getDefaultDeviceName();
    const expiresAt = new Date(Date.now() + TRUSTED_DEVICE_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const devices = getTrustedDevicesStore().filter((item) => !(item.userId === user.id && item.deviceId === currentDeviceId));
    devices.push({
      id: `trusted-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      deviceId: currentDeviceId,
      deviceName: currentName,
      trustedAt: now,
      expiresAt,
      lastUsedAt: now,
      userAgent: navigator.userAgent,
    });
    saveTrustedDevicesStore(devices);
  }

  return { user: safeUser, session: nextSession };
};

export const loginWithSocialProvider = ({ provider, remember, trustDevice, deviceName }) => {
  const providerMap = {
    google: 'admin@hortelan.com',
    apple: 'admin@hortelan.com',
  };

  const email = providerMap[provider];

  if (!email) {
    return { error: 'Provedor social não suportado.' };
  }

  const user = getUsers().find((item) => item.email === email);

  if (!user) {
    return { error: 'Nenhuma conta vinculada para este provedor social.' };
  }

  return loginWithEmailAndPassword({
    email: user.email,
    password: user.password,
    remember,
    trustDevice,
    deviceName,
  });
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

export const getTwoFactorSettings = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { enabled: false, method: 'email' };
  }

  return getMfaSettingsMap()[user.id] || { enabled: false, method: 'email' };
};

export const updateTwoFactorSettings = ({ enabled, method }) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const settings = getMfaSettingsMap();
  settings[user.id] = {
    enabled: Boolean(enabled),
    method: method === 'authenticator' ? 'authenticator' : 'email',
  };

  saveMfaSettingsMap(settings);

  return { success: true, settings: settings[user.id] };
};

export const getTrustedDevices = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return [];
  }

  const now = Date.now();
  const devices = getTrustedDevicesStore()
    .filter((device) => device.userId === user.id && new Date(device.expiresAt).getTime() > now)
    .sort((a, b) => new Date(b.lastUsedAt || b.trustedAt) - new Date(a.lastUsedAt || a.trustedAt));

  return devices;
};

export const revokeTrustedDevice = (trustedDeviceId) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return;
  }

  const devices = getTrustedDevicesStore().filter((device) => !(device.userId === user.id && device.id === trustedDeviceId));
  saveTrustedDevicesStore(devices);
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
