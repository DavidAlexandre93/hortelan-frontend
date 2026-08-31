import { AI_PROVENANCE, aiContextSchema } from './contracts';

const CONTEXT_BUILDERS = Object.freeze([
  { prefix: '/dashboard/app', resourceType: 'monitoring', fields: ['sensorId', 'gardenId', 'cropId', 'range'] },
  { prefix: '/dashboard/alertas', resourceType: 'alert', fields: ['alertId', 'gardenId', 'cropId', 'range'] },
  { prefix: '/dashboard/products', resourceType: 'species', fields: ['speciesId', 'gardenId', 'region', 'season'] },
  { prefix: '/dashboard/relatorios', resourceType: 'report', fields: ['reportId', 'gardenId', 'range'] },
  { prefix: '/dashboard/suporte', resourceType: 'help', fields: ['articleId', 'topic'] },
  { prefix: '/dashboard/hortelan-360', resourceType: 'workspace', fields: ['gardenId', 'cropId', 'range'] },
]);

const SECRET_FIELD_PATTERN = /password|senha|secret|token|credential|mfa|card|payment|api.?key/i;

function boundedPrimitive(value) {
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') return value.trim().slice(0, 240);
  return null;
}

export function findAiContextDefinition(pathname) {
  return CONTEXT_BUILDERS.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`)) || null;
}

export function buildAiRouteContext(pathname, input = {}) {
  const definition = findAiContextDefinition(pathname);
  if (!definition) return null;

  const selectedFields = definition.fields.reduce((result, field) => {
    if (SECRET_FIELD_PATTERN.test(field)) return result;
    const value = boundedPrimitive(input[field]);
    return value === undefined || value === '' ? result : { ...result, [field]: value };
  }, {});

  const resourceId = selectedFields[`${definition.resourceType}Id`] || input.resourceId || null;
  const context = {
    route: definition.prefix,
    locale: 'pt-BR',
    provenance: Object.values(AI_PROVENANCE).includes(input.provenance) ? input.provenance : AI_PROVENANCE.CURATED,
    resourceType: definition.resourceType,
    resourceId: boundedPrimitive(resourceId),
    period: boundedPrimitive(input.range || input.period),
    selectedFields,
    observedAt: input.observedAt || new Date().toISOString(),
  };

  const parsed = aiContextSchema.safeParse(context);
  return parsed.success ? parsed.data : null;
}

export function describeAiContext(context) {
  if (!context) return 'Sem dados adicionais desta pagina';
  const labels = {
    monitoring: 'monitoramento atual',
    alert: 'alerta selecionado',
    species: 'especie selecionada',
    report: 'relatorio selecionado',
    help: 'conteudo de ajuda',
    workspace: 'visao Hortelan 360',
  };
  const scope = labels[context.resourceType] || 'contexto atual';
  const id = context.resourceId ? ` ${context.resourceId}` : '';
  const period = context.period ? `, periodo ${context.period}` : '';
  return `Usar ${scope}${id}${period}`;
}

export function getAiContextRegistry() {
  return CONTEXT_BUILDERS.map(({ prefix, resourceType, fields }) => ({ prefix, resourceType, fields: [...fields] }));
}
