const STORAGE_KEY = 'hortelan.platform.reliability';

const defaultState = {
  logs: {
    userActions: [
      {
        id: 'ua-1',
        actor: 'marina@hortelan.io',
        action: 'Atualizou limiar de umidade da Zona Sul para 41%',
        timestamp: '2026-02-24T10:12:00.000Z',
      },
    ],
    automations: [
      {
        id: 'auto-1',
        automation: 'Irrigação inteligente - Estufa A',
        status: 'success',
        detail: 'Execução concluída em 1m24s (2.3L).',
        timestamp: '2026-02-24T10:10:00.000Z',
      },
    ],
    integrationFailures: [
      {
        id: 'if-1',
        integration: 'Weather API',
        severity: 'high',
        detail: 'Timeout de 12s na coleta de previsão de chuva.',
        timestamp: '2026-02-24T09:58:00.000Z',
      },
    ],
  },
  observability: {
    frontendUsage: {
      sessionsToday: 128,
      activeUsers: 23,
      avgSessionMinutes: 11.4,
      actionsPerSession: 17,
    },
    jsErrors: [
      {
        id: 'js-1',
        message: 'TypeError: Cannot read property “id” of undefined',
        page: '/dashboard/app',
        timestamp: '2026-02-24T09:40:00.000Z',
      },
    ],
    pagePerformance: [
      { page: '/dashboard/app', p95Ms: 1120, cls: 0.04, ttfbMs: 260 },
      { page: '/dashboard/status', p95Ms: 820, cls: 0.02, ttfbMs: 210 },
      { page: '/dashboard/relatorios', p95Ms: 1320, cls: 0.05, ttfbMs: 300 },
    ],
    serviceAvailability: [
      { service: 'API Core', uptime: 99.97, latencyMs: 182, status: 'operational' },
      { service: 'Motor de automações', uptime: 99.75, latencyMs: 246, status: 'degraded' },
      { service: 'Webhook Gateway', uptime: 99.9, latencyMs: 198, status: 'operational' },
    ],
  },
  featureFlags: {
    flags: [
      {
        key: 'smart_irrigation_v2',
        name: 'Irrigação inteligente v2',
        enabled: true,
        groups: ['beta-farmers', 'enterprise'],
        rollout: 45,
        abTest: { variantA: 50, variantB: 50 },
      },
      {
        key: 'diagnostico_foto_ia',
        name: 'Diagnóstico por foto com IA',
        enabled: false,
        groups: ['internal'],
        rollout: 10,
        abTest: { variantA: 80, variantB: 20 },
      },
    ],
  },
  backupRecovery: {
    backups: [
      { id: 'bkp-981', scope: 'Banco transacional', status: 'success', startedAt: '2026-02-24T03:00:00.000Z', recoveryPoint: '15 min' },
      { id: 'bkp-982', scope: 'Eventos e logs', status: 'success', startedAt: '2026-02-24T03:30:00.000Z', recoveryPoint: '5 min' },
    ],
    incidents: [
      { id: 'inc-22', title: 'Queda no webhook de fornecedores', status: 'resolved', recoveryTimeMinutes: 32 },
      { id: 'inc-23', title: 'Latência alta no motor de regra', status: 'monitoring', recoveryTimeMinutes: 18 },
    ],
    criticalConfigVersions: [
      { name: 'automation-engine.yml', version: 'v1.23.4', changedBy: 'ops@hortelan.io', changedAt: '2026-02-23T16:11:00.000Z' },
      { name: 'integrations-secrets.json', version: 'v5.3.1', changedBy: 'security@hortelan.io', changedAt: '2026-02-23T12:40:00.000Z' },
    ],
  },
};

function readState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;

  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (error) {
    return defaultState;
  }
}

function persist(nextState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

export function getReliabilityState() {
  return readState();
}

export function logUserAction(action, actor = 'usuário atual') {
  const state = readState();
  state.logs.userActions.unshift({ id: `ua-${Date.now()}`, actor, action, timestamp: new Date().toISOString() });
  persist(state);
  return state;
}

export function logAutomationRun(automation, status, detail) {
  const state = readState();
  state.logs.automations.unshift({ id: `auto-${Date.now()}`, automation, status, detail, timestamp: new Date().toISOString() });
  persist(state);
  return state;
}

export function logIntegrationFailure(integration, severity, detail) {
  const state = readState();
  state.logs.integrationFailures.unshift({ id: `if-${Date.now()}`, integration, severity, detail, timestamp: new Date().toISOString() });
  persist(state);
  return state;
}

export function updateFeatureFlag(key, patch) {
  const state = readState();
  state.featureFlags.flags = state.featureFlags.flags.map((flag) => (flag.key === key ? { ...flag, ...patch } : flag));
  persist(state);
  return state;
}

export function registerJsTelemetry(message, page = window.location.pathname) {
  const state = readState();
  state.observability.jsErrors.unshift({ id: `js-${Date.now()}`, message, page, timestamp: new Date().toISOString() });
  state.observability.jsErrors = state.observability.jsErrors.slice(0, 30);
  persist(state);
}

export function registerFrontendUsage(actionCount = 1) {
  const state = readState();
  state.observability.frontendUsage.actionsPerSession += actionCount;
  persist(state);
}

export function initReliabilityTelemetry() {
  window.addEventListener('error', (event) => {
    registerJsTelemetry(event.message || 'Erro JavaScript desconhecido');
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason || 'Promise rejeitada sem tratamento';
    registerJsTelemetry(String(reason));
  });

  const perf = window.performance.getEntriesByType('navigation')[0];
  if (perf?.domComplete) {
    const state = readState();
    const page = window.location.pathname;
    const elapsed = Math.round(perf.domComplete - perf.startTime);
    const current = state.observability.pagePerformance.find((item) => item.page === page);

    if (current) {
      current.p95Ms = Math.round((current.p95Ms + elapsed) / 2);
      current.ttfbMs = Math.round((current.ttfbMs + perf.responseStart) / 2);
    } else {
      state.observability.pagePerformance.push({ page, p95Ms: elapsed, cls: 0.03, ttfbMs: Math.round(perf.responseStart) });
    }
    persist(state);
  }
}
