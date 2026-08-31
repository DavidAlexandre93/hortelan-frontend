import * as Sentry from '@sentry/react';

const ALLOWED_ATTRIBUTES = new Set([
  'operation',
  'taskProfile',
  'schemaVersion',
  'policyVersion',
  'providerRoute',
  'fallback',
  'sourceCount',
  'inputTokens',
  'outputTokens',
  'estimatedCost',
  'latencyMs',
  'status',
  'refusalCategory',
  'toolName',
  'incidentId',
  'route',
  'resultCount',
]);

const SENSITIVE_VALUE_PATTERN = /@|bearer\s|api.?key|password|senha|secret|token=/i;

export function sanitizeAiTelemetry(attributes = {}) {
  return Object.entries(attributes).reduce((safe, [key, value]) => {
    if (!ALLOWED_ATTRIBUTES.has(key) || value === undefined || value === null) return safe;
    if (!['string', 'number', 'boolean'].includes(typeof value)) return safe;
    const normalized = typeof value === 'string' ? value.slice(0, 160) : value;
    if (typeof normalized === 'string' && SENSITIVE_VALUE_PATTERN.test(normalized)) return safe;
    return { ...safe, [key]: normalized };
  }, {});
}

export function recordAiTelemetry(name, attributes = {}, level = 'info') {
  Sentry.addBreadcrumb({
    category: 'ai.operation',
    message: String(name || 'unknown').slice(0, 80),
    level,
    data: sanitizeAiTelemetry(attributes),
  });
}
