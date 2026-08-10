import { compromiseTrustedDevice, rotateTrustedDevice } from './identity/mfaDomain';
import { normalizeGardenAccessControl } from './profileDomain';

const AUTH_STORAGE_KEY = 'hortelan-auth';
const SESSION_STORAGE_KEY = 'hortelan-auth-session-id';
const ACTIVE_SESSIONS_KEY = 'hortelan-active-sessions';
const USERS_STORAGE_KEY = 'hortelan-users';
const PASSWORD_HISTORY_KEY = 'hortelan-password-history';
const MFA_SETTINGS_KEY = 'hortelan-mfa-settings';
const TRUSTED_DEVICES_KEY = 'hortelan-trusted-devices';
const CONSENTS_KEY = 'hortelan-consents';
const ACCOUNT_DELETION_REQUESTS_KEY = 'hortelan-account-deletion-requests';
const CONSENT_LOGS_KEY = 'hortelan-consent-logs';
const SESSION_IDLE_TIMEOUT_MINUTES = 30;
const DATA_RETENTION_DAYS = 365;
const USERS = [];

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
    accessControl: normalizeGardenAccessControl(garden.accessControl),
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

const INITIAL_PASSWORD_HISTORY = [];
const INITIAL_MFA_SETTINGS = {};
const INITIAL_CONSENTS = {};

const getBrowserStorage = (storageName) => {
  if (typeof window === 'undefined') return null;

  try {
    return window[storageName];
  } catch {
    return null;
  }
};

const readStorage = (storageName, key) => {
  try {
    return getBrowserStorage(storageName)?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const writeStorage = (storageName, key, value) => {
  try {
    getBrowserStorage(storageName)?.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const removeStorage = (storageName, key) => {
  try {
    getBrowserStorage(storageName)?.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const getLocalJson = (key, fallback) => {
  const value = readStorage('localStorage', key);

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
    writeStorage('localStorage', SESSION_STORAGE_KEY, sessionId);
    removeStorage('sessionStorage', SESSION_STORAGE_KEY);
    return;
  }

  writeStorage('sessionStorage', SESSION_STORAGE_KEY, sessionId);
  removeStorage('localStorage', SESSION_STORAGE_KEY);
};

const getCurrentSessionId = () =>
  readStorage('sessionStorage', SESSION_STORAGE_KEY) || readStorage('localStorage', SESSION_STORAGE_KEY);

const clearCurrentSessionId = () => {
  removeStorage('localStorage', SESSION_STORAGE_KEY);
  removeStorage('sessionStorage', SESSION_STORAGE_KEY);
  removeStorage('localStorage', AUTH_STORAGE_KEY);
  removeStorage('sessionStorage', AUTH_STORAGE_KEY);
};

const getActiveSessions = () => getLocalJson(ACTIVE_SESSIONS_KEY, []);

const getUsers = () => getLocalJson(USERS_STORAGE_KEY, USERS);

const saveUsers = (users) => {
  writeStorage('localStorage', USERS_STORAGE_KEY, JSON.stringify(users));
};

const getPasswordHistory = () => getLocalJson(PASSWORD_HISTORY_KEY, INITIAL_PASSWORD_HISTORY);

const getMfaSettingsMap = () => getLocalJson(MFA_SETTINGS_KEY, INITIAL_MFA_SETTINGS);

const saveMfaSettingsMap = (settings) => {
  writeStorage('localStorage', MFA_SETTINGS_KEY, JSON.stringify(settings));
};

const getTrustedDevicesStore = () => getLocalJson(TRUSTED_DEVICES_KEY, []);

const saveTrustedDevicesStore = (devices) => {
  writeStorage('localStorage', TRUSTED_DEVICES_KEY, JSON.stringify(devices));
};

const getConsentsMap = () => getLocalJson(CONSENTS_KEY, INITIAL_CONSENTS);

const saveConsentsMap = (consents) => {
  writeStorage('localStorage', CONSENTS_KEY, JSON.stringify(consents));
};

const getAccountDeletionRequestsStore = () => getLocalJson(ACCOUNT_DELETION_REQUESTS_KEY, []);

const saveAccountDeletionRequestsStore = (requests) => {
  writeStorage('localStorage', ACCOUNT_DELETION_REQUESTS_KEY, JSON.stringify(requests));
};

const getConsentLogsStore = () => getLocalJson(CONSENT_LOGS_KEY, []);

const saveConsentLogsStore = (logs) => {
  writeStorage('localStorage', CONSENT_LOGS_KEY, JSON.stringify(logs));
};

const saveActiveSessions = (sessions) => {
  writeStorage('localStorage', ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
};

const getCurrentSession = () => {
  const sessionId = getCurrentSessionId();

  if (!sessionId) {
    return null;
  }

  const sessions = getActiveSessions();
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    return null;
  }

  const lastActivityMs = new Date(session.lastActiveAt || session.createdAt).getTime();
  const timedOut = Date.now() - lastActivityMs > SESSION_IDLE_TIMEOUT_MINUTES * 60 * 1000;
  const expired = session.expiresAt ? new Date(session.expiresAt).getTime() <= Date.now() : false;

  if (timedOut || expired) {
    saveActiveSessions(sessions.filter((item) => item.id !== sessionId));
    clearCurrentSessionId();
    return null;
  }

  const updatedSession = {
    ...session,
    lastActiveAt: new Date().toISOString(),
  };

  saveActiveSessions(sessions.map((item) => (item.id === sessionId ? updatedSession : item)));
  return updatedSession;
};

const persistAuthUser = (user, persistent) => {
  if (persistent) {
    writeStorage('localStorage', AUTH_STORAGE_KEY, JSON.stringify(user));
    removeStorage('sessionStorage', AUTH_STORAGE_KEY);
    return;
  }

  writeStorage('sessionStorage', AUTH_STORAGE_KEY, JSON.stringify(user));
  removeStorage('localStorage', AUTH_STORAGE_KEY);
};

export function persistBackendIdentity({ user, session, remember = true }) {
  if (!user || typeof user !== 'object') return { user: null, session: null };

  const safeUser = buildSafeUser(user);
  const now = new Date().toISOString();
  const sessionId = typeof session?.id === 'string' ? session.id : `backend-session-${Date.now()}`;
  const safeSession = {
    id: sessionId,
    userId: safeUser.id,
    email: safeUser.email,
    createdAt: now,
    lastActiveAt: now,
    expiresAt: typeof session?.expiresAt === 'string' ? session.expiresAt : null,
    persistent: Boolean(remember),
    userAgent: typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent,
    authMethod: 'backend',
  };

  saveUsers([...getUsers().filter((item) => item.id !== safeUser.id), safeUser]);
  saveActiveSessions([...getActiveSessions().filter((item) => item.id !== sessionId), safeSession]);
  setCurrentSessionId(sessionId, remember);
  persistAuthUser(safeUser, remember);

  return { user: safeUser, session: safeSession };
}

export function persistBackendUserProfile(user) {
  if (!user || typeof user !== 'object') return null;
  const currentSession = getCurrentSession();
  if (!currentSession) return null;
  const safeUser = buildSafeUser(user);
  saveUsers([...getUsers().filter((item) => item.id !== safeUser.id), safeUser]);
  persistAuthUser(safeUser, Boolean(currentSession.persistent));
  return safeUser;
}

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
      cookies: false,
      marketing: false,
      analytics: false,
      communications: false,
      notifications: false,
      privacyMode: 'restricted',
      updatedAt: null,
    };
  }

  return (
    getConsentsMap()[user.id] || {
      cookies: true,
      marketing: false,
      analytics: true,
      communications: true,
      notifications: false,
      privacyMode: 'balanced',
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

  const consentLogs = getConsentLogsStore();
  consentLogs.push({
    id: `consent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: user.id,
    changedAt: new Date().toISOString(),
    payload: nextConsents,
    effectiveConsents: consents[user.id],
  });
  saveConsentLogsStore(consentLogs);

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
    retentionUntil: new Date(Date.now() + DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
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
    consentLogs: getConsentLogsStore().filter((entry) => entry.userId === fullUser.id),
    retentionPolicy: getDataRetentionPolicy(),
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
      accessControl: normalizeGardenAccessControl(garden.accessControl),
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
          payload.subscription?.limits?.aiPhotoDiagnostics ||
          currentUser.subscription?.limits?.aiPhotoDiagnostics ||
          10,
        advancedExports:
          payload.subscription?.limits?.advancedExports || currentUser.subscription?.limits?.advancedExports || 1,
      },
      usage: {
        gardens:
          payload.subscription?.usage?.gardens ||
          currentUser.subscription?.usage?.gardens ||
          payload.gardens?.length ||
          0,
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
  persistAuthUser(
    safeUser,
    Boolean(currentSession?.persistent || readStorage('localStorage', SESSION_STORAGE_KEY) === currentSessionId)
  );

  return { success: true, user: safeUser };
};

export const getPasswordChangeHistory = () =>
  getPasswordHistory().sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

export const getConsentAuditLogs = () => {
  const user = getAuthenticatedUser();

  if (!user) {
    return [];
  }

  return getConsentLogsStore()
    .filter((entry) => entry.userId === user.id)
    .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
};

export const getDataRetentionPolicy = () => ({
  retentionDays: DATA_RETENTION_DAYS,
  deletionWindowDays: 30,
  legalBasis: 'LGPD Art. 16',
});

export const rotateTrustedDeviceCredential = (trustedDeviceId) => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const result = rotateTrustedDevice(getTrustedDevicesStore(), { trustedDeviceId, userId: user.id });
  if (!result.found) return { error: 'Dispositivo confiavel nao encontrado.' };
  saveTrustedDevicesStore(result.devices);
  return { success: true };
};

export const revokeCompromisedDevice = (trustedDeviceId, reason = 'Comprometimento reportado') => {
  const user = getAuthenticatedUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const result = compromiseTrustedDevice(getTrustedDevicesStore(), {
    trustedDeviceId,
    userId: user.id,
    reason,
  });
  if (!result.found) return { error: 'Dispositivo confiavel nao encontrado.' };
  saveTrustedDevicesStore(result.devices);
  return { success: true };
};

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

  const devices = getTrustedDevicesStore().filter(
    (device) => !(device.userId === user.id && device.id === trustedDeviceId)
  );
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

export function cleanupLegacyIdentityStorage({ preserveDemoData = false } = {}) {
  if (typeof window === 'undefined' || preserveDemoData) return;
  const cleanupKey = 'hortelan-identity-cleanup-v2';
  if (readStorage('localStorage', cleanupKey) === 'complete') return;
  ['hortelan-reset-tokens', PASSWORD_HISTORY_KEY, 'hortelan-mfa-challenges', 'hortelan-login-rate-limit'].forEach(
    (key) => {
      removeStorage('localStorage', key);
      removeStorage('sessionStorage', key);
    }
  );
  try {
    const storedUsers = JSON.parse(readStorage('localStorage', USERS_STORAGE_KEY) || '[]');
    if (Array.isArray(storedUsers)) {
      const sanitizedUsers = storedUsers.map(({ password: _password, ...user }) => user);
      writeStorage('localStorage', USERS_STORAGE_KEY, JSON.stringify(sanitizedUsers));
    }
  } catch {
    removeStorage('localStorage', USERS_STORAGE_KEY);
  }
  writeStorage('localStorage', cleanupKey, 'complete');
}
