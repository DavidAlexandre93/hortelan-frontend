import { describe, expect, it } from 'vitest';
import { buildInitialActuators, buildInitialAlerts, greenhouseAreas } from './model';

describe('platform status model', () => {
  it('deriva alertas com severidade e identidade da area', () => {
    const alerts = buildInitialAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts).toEqual(
      expect.arrayContaining([expect.objectContaining({ areaId: 'B1', severity: 'error', acknowledgedAt: null })])
    );
  });

  it('mantem apenas dispositivos atuadores na lista de comandos', () => {
    const actuators = buildInitialActuators();
    expect(actuators.every((device) => device.type === 'device')).toBe(true);
    expect(actuators.length).toBeLessThan(greenhouseAreas.flatMap((area) => area.devices).length);
  });
});
