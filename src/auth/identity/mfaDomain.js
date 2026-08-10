const MFA_CODE_EXPIRY_MS = 5 * 60 * 1000;

export function isTrustedDeviceActive(devices, userId, deviceId, now = Date.now()) {
  return devices.some(
    (device) =>
      device.userId === userId &&
      device.deviceId === deviceId &&
      device.status !== 'compromised' &&
      new Date(device.expiresAt).getTime() > now
  );
}

export function createMfaChallenge({
  user,
  method = 'email',
  challenges = [],
  now = Date.now(),
  random = Math.random,
}) {
  const normalizedMethod = method === 'authenticator' ? 'authenticator' : 'email';
  const expiresAt = new Date(now + MFA_CODE_EXPIRY_MS).toISOString();
  const code = `${Math.floor(100000 + random() * 900000)}`;
  const challengeId = `mfa-${now}-${random().toString(36).slice(2, 8)}`;
  const deliveryHint =
    normalizedMethod === 'email' ? user.email.replace(/(^.).*(@.*$)/, '$1***$2') : 'App autenticador';

  const retainedChallenges = challenges.filter((challenge) => challenge.userId !== user.id || challenge.usedAt);
  const challenge = {
    id: challengeId,
    userId: user.id,
    method: normalizedMethod,
    code,
    createdAt: new Date(now).toISOString(),
    expiresAt,
    usedAt: null,
  };

  return {
    challenges: [...retainedChallenges, challenge],
    result: {
      requiresTwoFactor: true,
      challengeId,
      method: normalizedMethod,
      deliveryHint,
      expiresAt,
      demoCode: code,
    },
  };
}

export function verifyMfaChallenge({ challenges = [], challengeId, code, userId, now = Date.now() }) {
  if (!challengeId) {
    return { valid: false, error: 'Desafio de 2FA nao informado.', challenges };
  }

  const challenge = challenges.find((item) => item.id === challengeId);
  if (!challenge || challenge.userId !== userId) {
    return { valid: false, error: 'Desafio de 2FA invalido para este usuario.', challenges };
  }
  if (challenge.usedAt) {
    return { valid: false, error: 'Este codigo 2FA ja foi utilizado.', challenges };
  }
  if (new Date(challenge.expiresAt).getTime() <= now) {
    return { valid: false, error: 'Codigo 2FA expirado. Gere um novo codigo.', challenges };
  }
  if (challenge.code !== `${code}`) {
    return { valid: false, error: 'Codigo 2FA invalido.', challenges };
  }

  return {
    valid: true,
    method: challenge.method,
    challenges: challenges.map((item) =>
      item.id === challengeId ? { ...item, usedAt: new Date(now).toISOString() } : item
    ),
  };
}

export function rotateTrustedDevice(devices, { trustedDeviceId, userId, now = Date.now() }) {
  let found = false;
  const rotatedAt = new Date(now).toISOString();
  const nextDevices = devices.map((device) => {
    if (device.userId !== userId || device.id !== trustedDeviceId) return device;
    found = true;
    return {
      ...device,
      credentialVersion: Number(device.credentialVersion || 1) + 1,
      credentialRotatedAt: rotatedAt,
    };
  });
  return { found, devices: nextDevices };
}

export function compromiseTrustedDevice(
  devices,
  { trustedDeviceId, userId, reason = 'Comprometimento reportado', now = Date.now() }
) {
  let found = false;
  const revokedAt = new Date(now).toISOString();
  const nextDevices = devices.map((device) => {
    if (device.userId !== userId || device.id !== trustedDeviceId) return device;
    found = true;
    return {
      ...device,
      status: 'compromised',
      revokedAt,
      revokedReason: reason,
      expiresAt: revokedAt,
    };
  });
  return { found, devices: nextDevices };
}
