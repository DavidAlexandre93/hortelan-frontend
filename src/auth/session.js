const AUTH_STORAGE_KEY = 'hortelan-auth';
const SESSION_STORAGE_KEY = 'hortelan-auth-session-id';
const ACTIVE_SESSIONS_KEY = 'hortelan-active-sessions';
const USERS_STORAGE_KEY = 'hortelan-users';
const RESET_TOKENS_KEY = 'hortelan-reset-tokens';
const PASSWORD_HISTORY_KEY = 'hortelan-password-history';
const MFA_SETTINGS_KEY = 'hortelan-mfa-settings';
const MFA_CHALLENGES_KEY = 'hortelan-mfa-challenges';
const TRUSTED_DEVICES_KEY = 'hortelan-trusted-devices';
const CONSENTS_KEY = 'hortelan-consents';
const ACCOUNT_DELETION_REQUESTS_KEY = 'hortelan-account-deletion-requests';
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
    photoURL: '',
    bio: 'Cultivando alimentos e tecnologia para uma horta mais inteligente.',
    preferences: {
      language: 'pt-BR',
      measurementUnit: 'métrico',
      timezone: 'America/Sao_Paulo',
    },
    notifications: {
      irrigationAlerts: true,
      pestAlerts: true,
      weatherAlerts: true,
      communityUpdates: false,
      marketing: false,
    },
    savedAddresses: [
      {
        id: 'address-admin-1',
        label: 'Casa',
        addressLine: 'Rua das Hortas, 123 - São Paulo/SP',
      },
    ],
    cultivationLevel: 'intermediario',
    gardens: [
      {
        id: 'garden-admin-1',
        name: 'Horta da varanda',
        gardenType: 'vaso',
        location: 'São Paulo/SP - Vila Mariana',
        photoURL: '',
        sectors: [
          {
            id: 'sector-admin-1',
            name: 'Canteiro 1',
            dimensions: '2m x 1m',
            sectorType: 'sol_pleno',
          },
          {
            id: 'sector-admin-2',
            name: 'Bancada A',
            dimensions: '',
            sectorType: 'meia_sombra',
          },
        ],
      },
    ],
    subscription: {
      plan: 'free',
      status: 'active',
      billingCycle: 'monthly',
      renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      seats: 1,
      limits: {
        gardens: 1,
        devices: 2,
        dataHistoryDays: 30,
        aiPhotoDiagnostics: 10,
        advancedExports: 1,
      },
      usage: {
        gardens: 1,
        devices: 1,
        aiPhotoDiagnostics: 3,
        advancedExports: 0,
      },
      billingHistory: [
        {
          id: 'invoice-admin-1-001',
          date: new Date().toISOString(),
          description: 'Plano gratuito',
          amount: 0,
          status: 'paid',
        },
      ],
    },
  },
];

const buildSafeUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
  photoURL: user.photoURL || '',
  bio: user.bio || '',
  preferences: {
    language: user.preferences?.language || 'pt-BR',
    measurementUnit: user.preferences?.measurementUnit || 'métrico',
    timezone: user.preferences?.timezone || 'America/Sao_Paulo',
  },
  notifications: {
    irrigationAlerts: Boolean(user.notifications?.irrigationAlerts),
    pestAlerts: Boolean(user.notifications?.pestAlerts),
    weatherAlerts: Boolean(user.notifications?.weatherAlerts),
    communityUpdates: Boolean(user.notifications?.communityUpdates),
    marketing: Boolean(user.notifications?.marketing),
  },
  savedAddresses: (user.savedAddresses || []).map((address) => ({
    id: address.id,
    label: address.label,
    addressLine: address.addressLine,
  })),
  cultivationLevel: user.cultivationLevel || 'iniciante',
  gardens: (user.gardens || []).map((garden, index) => ({
    id: garden.id || `garden-${Date.now()}-${index}`,
    name: garden.name || `Horta ${index + 1}`,
    gardenType: garden.gardenType || 'solo',
    location: garden.location || '',
    photoURL: garden.photoURL || '',
    sectors: (garden.sectors || []).map((sector, sectorIndex) => ({
      id: sector.id || `sector-${Date.now()}-${index}-${sectorIndex}`,
      name: sector.name || `Setor ${sectorIndex + 1}`,
      dimensions: sector.dimensions || '',
      sectorType: sector.sectorType || 'sol_pleno',
    })),
  })),
  subscription: {
    plan: user.subscription?.plan || 'free',
    status: user.subscription?.status || 'active',
    billingCycle: user.subscription?.billingCycle || 'monthly',
    renewalDate: user.subscription?.renewalDate || null,
    seats: user.subscription?.seats || 1,
    limits: {
      gardens: user.subscription?.limits?.gardens || 1,
      devices: user.subscription?.limits?.devices || 2,
      dataHistoryDays: user.subscription?.limits?.dataHistoryDays || 30,
      aiPhotoDiagnostics: user.subscription?.limits?.aiPhotoDiagnostics || 10,
      advancedExports: user.subscription?.limits?.advancedExports || 1,
    },
    usage: {
      gardens: user.subscription?.usage?.gardens || user.gardens?.length || 0,
      devices: user.subscription?.usage?.devices || 0,
      aiPhotoDiagnostics: user.subscription?.usage?.aiPhotoDiagnostics || 0,
      advancedExports: user.subscription?.usage?.advancedExports || 0,
    },
    billingHistory: (user.subscription?.billingHistory || []).map((invoice, index) => ({
      id: invoice.id || `invoice-${Date.now()}-${index}`,
      date: invoice.date || new Date().toISOString(),
      description: invoice.description || 'Cobrança de assinatura',
      amount: Number(invoice.amount) || 0,
      status: invoice.status || 'paid',
    })),
  },
});

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

const INITIAL_CONSENTS = {
  'admin-1': {
    marketing: false,
    analytics: true,
    communications: true,
    updatedAt: new Date().toISOString(),
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

const getConsentsMap = () => getLocalJson(CONSENTS_KEY, INITIAL_CONSENTS);

const saveConsentsMap = (consents) => {
  localStorage.setItem(CONSENTS_KEY, JSON.stringify(consents));
};

const getAccountDeletionRequestsStore = () => getLocalJson(ACCOUNT_DELETION_REQUESTS_KEY, []);

const saveAccountDeletionRequestsStore = (requests) => {
  localStorage.setItem(ACCOUNT_DELETION_REQUESTS_KEY, JSON.stringify(requests));
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

  if (user.isActive === false) {
    return { error: 'Conta desativada. Entre em contato com o suporte para reativação.' };
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

  const safeUser = buildSafeUser(user);

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

  return buildSafeUser(user);
};

export const getUserConsents = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return {
      marketing: false,
      analytics: false,
      communications: false,
      updatedAt: null,
    };
  }

  return (
    getConsentsMap()[user.id] || {
      marketing: false,
      analytics: true,
      communications: true,
      updatedAt: null,
    }
  );
};

export const updateUserConsents = (nextConsents) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const consents = getConsentsMap();
  consents[user.id] = {
    ...getUserConsents(),
    ...nextConsents,
    updatedAt: new Date().toISOString(),
  };

  saveConsentsMap(consents);
  return { success: true, consents: consents[user.id] };
};

export const getAccountDeletionRequest = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return null;
  }

  return getAccountDeletionRequestsStore().find((request) => request.userId === user.id) || null;
};

export const requestAccountDeletion = ({ reason }) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const now = new Date().toISOString();
  const requests = getAccountDeletionRequestsStore().filter((request) => request.userId !== user.id);
  requests.push({
    id: `deletion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: user.id,
    email: user.email,
    reason: reason?.trim() || 'Não informado',
    requestedAt: now,
    status: 'pending',
  });
  saveAccountDeletionRequestsStore(requests);

  return { success: true };
};

export const deactivateCurrentAccount = ({ reason }) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const users = getUsers();
  const updatedUsers = users.map((item) =>
    item.id === user.id
      ? {
          ...item,
          isActive: false,
          deactivatedAt: new Date().toISOString(),
          deactivationReason: reason?.trim() || 'Não informado',
        }
      : item
  );
  saveUsers(updatedUsers);

  logoutAllSessions();
  return { success: true };
};

export const exportCurrentUserData = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const fullUser = getUsers().find((item) => item.id === user.id);

  if (!fullUser) {
    return { error: 'Dados de usuário não encontrados.' };
  }

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      isActive: fullUser.isActive !== false,
      deactivatedAt: fullUser.deactivatedAt || null,
    },
    consents: getConsentsMap()[fullUser.id] || null,
    twoFactor: getMfaSettingsMap()[fullUser.id] || null,
    sessions: getActiveSessions().filter((session) => session.userId === fullUser.id),
    trustedDevices: getTrustedDevicesStore().filter((device) => device.userId === fullUser.id),
    passwordHistory: getPasswordHistory().filter((entry) => entry.userId === fullUser.id),
    accountDeletionRequest: getAccountDeletionRequestsStore().find((request) => request.userId === fullUser.id) || null,
    profile: {
      bio: fullUser.bio || '',
      preferences: fullUser.preferences || null,
      notifications: fullUser.notifications || null,
      savedAddresses: fullUser.savedAddresses || [],
      cultivationLevel: fullUser.cultivationLevel || null,
      gardens: fullUser.gardens || [],
      subscription: fullUser.subscription || null,
    },
  };
};

export const updateAuthenticatedUserProfile = (payload) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const users = getUsers();
  const currentUser = users.find((item) => item.id === user.id);

  if (!currentUser) {
    return { error: 'Usuário não encontrado.' };
  }

  const nextUser = {
    ...currentUser,
    name: payload.name?.trim() || currentUser.name,
    photoURL: payload.photoURL?.trim() || '',
    bio: payload.bio?.trim() || '',
    preferences: {
      language: payload.preferences?.language || currentUser.preferences?.language || 'pt-BR',
      measurementUnit: payload.preferences?.measurementUnit || currentUser.preferences?.measurementUnit || 'métrico',
      timezone: payload.preferences?.timezone || currentUser.preferences?.timezone || 'America/Sao_Paulo',
    },
    notifications: {
      irrigationAlerts: Boolean(payload.notifications?.irrigationAlerts),
      pestAlerts: Boolean(payload.notifications?.pestAlerts),
      weatherAlerts: Boolean(payload.notifications?.weatherAlerts),
      communityUpdates: Boolean(payload.notifications?.communityUpdates),
      marketing: Boolean(payload.notifications?.marketing),
    },
    savedAddresses: (payload.savedAddresses || []).map((address, index) => ({
      id: address.id || `address-${Date.now()}-${index}`,
      label: address.label?.trim() || `Endereço ${index + 1}`,
      addressLine: address.addressLine?.trim() || '',
    })),
    cultivationLevel: payload.cultivationLevel || currentUser.cultivationLevel || 'iniciante',
    gardens: (payload.gardens || []).map((garden, index) => ({
      id: garden.id || `garden-${Date.now()}-${index}`,
      name: garden.name?.trim() || `Horta ${index + 1}`,
      gardenType: garden.gardenType || 'solo',
      location: garden.location?.trim() || '',
      photoURL: garden.photoURL?.trim() || '',
      sectors: (garden.sectors || []).map((sector, sectorIndex) => ({
        id: sector.id || `sector-${Date.now()}-${index}-${sectorIndex}`,
        name: sector.name?.trim() || `Setor ${sectorIndex + 1}`,
        dimensions: sector.dimensions?.trim() || '',
        sectorType: sector.sectorType || 'sol_pleno',
      })),
    })),
    subscription: {
      plan: payload.subscription?.plan || currentUser.subscription?.plan || 'free',
      status: payload.subscription?.status || currentUser.subscription?.status || 'active',
      billingCycle: payload.subscription?.billingCycle || currentUser.subscription?.billingCycle || 'monthly',
      renewalDate: payload.subscription?.renewalDate || currentUser.subscription?.renewalDate || null,
      seats: payload.subscription?.seats || currentUser.subscription?.seats || 1,
      limits: {
        gardens: payload.subscription?.limits?.gardens || currentUser.subscription?.limits?.gardens || 1,
        devices: payload.subscription?.limits?.devices || currentUser.subscription?.limits?.devices || 2,
        dataHistoryDays:
          payload.subscription?.limits?.dataHistoryDays || currentUser.subscription?.limits?.dataHistoryDays || 30,
        aiPhotoDiagnostics:
          payload.subscription?.limits?.aiPhotoDiagnostics || currentUser.subscription?.limits?.aiPhotoDiagnostics || 10,
        advancedExports:
          payload.subscription?.limits?.advancedExports || currentUser.subscription?.limits?.advancedExports || 1,
      },
      usage: {
        gardens: payload.subscription?.usage?.gardens || currentUser.subscription?.usage?.gardens || payload.gardens?.length || 0,
        devices: payload.subscription?.usage?.devices || currentUser.subscription?.usage?.devices || 0,
        aiPhotoDiagnostics:
          payload.subscription?.usage?.aiPhotoDiagnostics || currentUser.subscription?.usage?.aiPhotoDiagnostics || 0,
        advancedExports:
          payload.subscription?.usage?.advancedExports || currentUser.subscription?.usage?.advancedExports || 0,
      },
      billingHistory: (payload.subscription?.billingHistory || currentUser.subscription?.billingHistory || []).map(
        (invoice, index) => ({
          id: invoice.id || `invoice-${Date.now()}-${index}`,
          date: invoice.date || new Date().toISOString(),
          description: invoice.description || 'Cobrança de assinatura',
          amount: Number(invoice.amount) || 0,
          status: invoice.status || 'paid',
        })
      ),
    },
  };

  const updatedUsers = users.map((item) => (item.id === currentUser.id ? nextUser : item));
  saveUsers(updatedUsers);

  const safeUser = buildSafeUser(nextUser);
  const currentSessionId = getCurrentSessionId();
  const currentSession = getCurrentSession();
  persistAuthUser(safeUser, Boolean(currentSession?.persistent || localStorage.getItem(SESSION_STORAGE_KEY) === currentSessionId));

  return { success: true, user: safeUser };
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
