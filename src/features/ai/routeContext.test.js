import { describe, expect, it } from 'vitest';
import { buildAiRouteContext, describeAiContext, findAiContextDefinition, getAiContextRegistry } from './routeContext';

describe('AI route context', () => {
  it('reconhece apenas rotas aprovadas', () => {
    expect(findAiContextDefinition('/dashboard/alertas')).toMatchObject({ resourceType: 'alert' });
    expect(findAiContextDefinition('/dashboard/admin')).toBeNull();
    expect(getAiContextRegistry()).toHaveLength(6);
  });

  it('inclui somente campos allowlisted e primitivos limitados', () => {
    const context = buildAiRouteContext('/dashboard/alertas', {
      alertId: 'alert-42',
      gardenId: 'garden-7',
      range: '24h',
      password: 'nao pode sair',
      rawComponentState: { hidden: true },
      provenance: 'live',
      observedAt: '2026-08-31T12:00:00.000Z',
    });
    expect(context).toMatchObject({
      resourceType: 'alert',
      resourceId: 'alert-42',
      period: '24h',
      selectedFields: { alertId: 'alert-42', gardenId: 'garden-7', range: '24h' },
    });
    expect(JSON.stringify(context)).not.toContain('nao pode sair');
    expect(JSON.stringify(context)).not.toContain('rawComponentState');
    expect(describeAiContext(context)).toContain('alerta selecionado alert-42');
  });
});
