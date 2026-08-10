import { describe, expect, it } from 'vitest';
import {
  compromiseTrustedDevice,
  createMfaChallenge,
  isTrustedDeviceActive,
  rotateTrustedDevice,
  verifyMfaChallenge,
} from './mfaDomain';

const user = { id: 'user-1', email: 'pessoa@hortelan.local' };
const now = Date.parse('2026-08-10T12:00:00.000Z');

describe('MFA and trusted-device domain', () => {
  it('creates one bounded challenge and masks the delivery address', () => {
    const previous = { id: 'old', userId: user.id, usedAt: null, expiresAt: new Date(now + 60_000).toISOString() };
    const result = createMfaChallenge({ user, challenges: [previous], now, random: () => 0.5 });
    expect(result.challenges).toHaveLength(1);
    expect(result.result).toMatchObject({
      requiresTwoFactor: true,
      method: 'email',
      deliveryHint: 'p***@hortelan.local',
    });
    expect(result.result.demoCode).toHaveLength(6);
  });

  it('accepts a valid code exactly once', () => {
    const created = createMfaChallenge({ user, now, random: () => 0.25 });
    const first = verifyMfaChallenge({
      challenges: created.challenges,
      challengeId: created.result.challengeId,
      code: created.result.demoCode,
      userId: user.id,
      now: now + 1_000,
    });
    expect(first.valid).toBe(true);
    expect(
      verifyMfaChallenge({
        challenges: first.challenges,
        challengeId: created.result.challengeId,
        code: created.result.demoCode,
        userId: user.id,
        now: now + 2_000,
      })
    ).toMatchObject({ valid: false, error: expect.stringContaining('utilizado') });
  });

  it('rejects expired and foreign challenges', () => {
    const created = createMfaChallenge({ user, now, random: () => 0.1 });
    expect(
      verifyMfaChallenge({
        challenges: created.challenges,
        challengeId: created.result.challengeId,
        code: created.result.demoCode,
        userId: user.id,
        now: now + 6 * 60_000,
      })
    ).toMatchObject({ valid: false, error: expect.stringContaining('expirado') });
    expect(
      verifyMfaChallenge({
        challenges: created.challenges,
        challengeId: created.result.challengeId,
        code: created.result.demoCode,
        userId: 'another-user',
        now,
      })
    ).toMatchObject({ valid: false, error: expect.stringContaining('invalido') });
  });

  it('rotates and compromises only an owned trusted device', () => {
    const devices = [
      {
        id: 'device-1',
        userId: user.id,
        deviceId: 'browser-1',
        status: 'active',
        credentialVersion: 1,
        expiresAt: new Date(now + 60_000).toISOString(),
      },
    ];
    expect(isTrustedDeviceActive(devices, user.id, 'browser-1', now)).toBe(true);
    const rotated = rotateTrustedDevice(devices, { trustedDeviceId: 'device-1', userId: user.id, now });
    expect(rotated.devices[0].credentialVersion).toBe(2);
    const compromised = compromiseTrustedDevice(rotated.devices, {
      trustedDeviceId: 'device-1',
      userId: user.id,
      reason: 'teste',
      now,
    });
    expect(compromised.devices[0]).toMatchObject({ status: 'compromised', revokedReason: 'teste' });
    expect(isTrustedDeviceActive(compromised.devices, user.id, 'browser-1', now)).toBe(false);
  });
});
