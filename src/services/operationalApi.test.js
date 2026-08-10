// @vitest-environment node
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiUrl, server } from '../test/server';
import { API_ERROR_KINDS } from './apiClient';
import { operationalApi } from './operationalApi';

const fixtures = {
  monitoring: {
    path: '/monitoring',
    valid: {
      generatedAt: '2026-08-10T10:00:00Z',
      freshness: 'live',
      sensors: [
        {
          id: 'sensor-1',
          name: 'Umidade do solo',
          status: 'online',
          value: 62,
          unit: '%',
          updatedAt: '2026-08-10T10:00:00Z',
        },
      ],
    },
    invalid: { generatedAt: 'agora', freshness: 'unknown', sensors: [] },
  },
  alerts: {
    path: '/alerts',
    valid: {
      generatedAt: '2026-08-10T10:00:00Z',
      alerts: [
        {
          id: 'alert-1',
          title: 'Reservatorio baixo',
          severity: 'high',
          status: 'active',
          createdAt: '2026-08-10T09:55:00Z',
        },
      ],
    },
    invalid: { generatedAt: 'agora', alerts: [{ severity: 'urgent' }] },
  },
  reports: {
    path: '/reports',
    valid: {
      reports: [
        {
          id: 'report-1',
          title: 'Resumo semanal',
          status: 'ready',
          generatedAt: '2026-08-10T09:00:00Z',
          downloadUrl: 'https://example.com/report.pdf',
        },
      ],
    },
    invalid: { reports: [{ id: 'report-1', title: '', status: 'done' }] },
  },
  subscription: {
    path: '/subscription',
    valid: {
      plan: { id: 'pro', name: 'Cultivo Pro', tier: 'professional' },
      status: 'active',
      renewalAt: '2026-09-10T10:00:00Z',
      limits: { gardens: 10 },
      usage: { gardens: 3 },
    },
    invalid: { plan: { id: 'pro' }, status: 'enabled', limits: {}, usage: {} },
  },
  integrations: {
    path: '/integrations',
    valid: {
      integrations: [{ id: 'weather', name: 'Clima', status: 'connected', lastSyncAt: '2026-08-10T10:00:00Z' }],
    },
    invalid: { integrations: [{ id: 'weather', name: 'Clima', status: 'ok' }] },
  },
};

describe.each(Object.entries(fixtures))('operationalApi.%s', (method, fixture) => {
  it('aceita a resposta completa do dominio', async () => {
    server.use(http.get(apiUrl(fixture.path), () => HttpResponse.json(fixture.valid)));
    await expect(operationalApi[`get${method[0].toUpperCase()}${method.slice(1)}`]()).resolves.toEqual(fixture.valid);
  });

  it('interrompe a renderizacao de um payload malformado', async () => {
    server.use(http.get(apiUrl(fixture.path), () => HttpResponse.json(fixture.invalid)));
    await expect(
      operationalApi[`get${method[0].toUpperCase()}${method.slice(1)}`]({ retryAttempts: 0 })
    ).rejects.toMatchObject({ kind: API_ERROR_KINDS.CONTRACT });
  });
});
