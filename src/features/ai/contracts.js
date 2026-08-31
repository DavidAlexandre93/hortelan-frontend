import { z } from 'zod';

export const AI_EVENT_KINDS = Object.freeze({
  ACK: 'ack',
  STATUS: 'status',
  TEXT_DELTA: 'text_delta',
  CITATION: 'citation',
  ACTION_DRAFT: 'action_draft',
  USAGE: 'usage',
  COMPLETED: 'completed',
  REFUSED: 'refused',
  ERROR: 'error',
});

export const AI_AVAILABILITY = Object.freeze({
  READY: 'ready',
  DISABLED: 'disabled',
  DEGRADED: 'degraded',
  UNAVAILABLE: 'unavailable',
});

export const AI_PROVENANCE = Object.freeze({
  LIVE: 'live',
  STALE: 'stale',
  DEMO: 'demo',
  USER: 'user',
  CURATED: 'curated',
});

const identifierSchema = z.union([z.string().min(1).max(160), z.number().finite()]).transform(String);
const timestampSchema = z.string().datetime({ offset: true }).or(z.string().min(1).max(80));
const boundedTextSchema = z.string().trim().min(1).max(12000);
const operationSchema = z.string().min(8).max(160);
const sequenceSchema = z.number().int().nonnegative();

const safeUrlSchema = z
  .string()
  .max(2048)
  .refine((value) => {
    if (value.startsWith('/')) return !value.startsWith('//');
    try {
      const url = new URL(value);
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL de citacao nao permitida');

export const aiFeatureFlagsSchema = z
  .object({
    chat: z.boolean().default(false),
    semanticDiscovery: z.boolean().default(false),
    workflowPlanning: z.boolean().default(false),
    formAssistance: z.boolean().default(false),
    proactiveInsights: z.boolean().default(false),
    imageAnalysis: z.boolean().default(false),
  })
  .passthrough();

export const aiCapabilitiesSchema = z
  .object({
    version: z.string().min(1).max(40),
    available: z.boolean(),
    status: z.enum(Object.values(AI_AVAILABILITY)),
    modalities: z.array(z.enum(['text', 'image'])).default([]),
    features: aiFeatureFlagsSchema,
    limits: z
      .object({
        maxInputCharacters: z.number().int().positive().max(50000).default(4000),
        maxImageBytes: z.number().int().positive().max(25000000).default(5000000),
        maxImages: z.number().int().nonnegative().max(5).default(1),
        remainingRequests: z.number().int().nonnegative().nullable().optional(),
        resetsAt: timestampSchema.nullable().optional(),
      })
      .passthrough(),
    retention: z
      .object({
        mode: z.enum(['none', 'session', 'retained']),
        summary: z.string().min(1).max(500),
        deletionAvailable: z.boolean(),
      })
      .passthrough(),
    consent: z
      .object({
        required: z.boolean(),
        processorCategory: z.string().min(1).max(160),
        policyVersion: z.string().min(1).max(80),
      })
      .passthrough(),
    incidentId: z.string().max(160).nullable().optional(),
  })
  .passthrough();

export const unavailableAiCapabilities = Object.freeze({
  version: '1',
  available: false,
  status: AI_AVAILABILITY.DISABLED,
  modalities: [],
  features: {
    chat: false,
    semanticDiscovery: false,
    workflowPlanning: false,
    formAssistance: false,
    proactiveInsights: false,
    imageAnalysis: false,
  },
  limits: { maxInputCharacters: 4000, maxImageBytes: 5000000, maxImages: 1 },
  retention: {
    mode: 'none',
    summary: 'Conversas nao sao processadas enquanto a IA esta desativada.',
    deletionAvailable: false,
  },
  consent: { required: true, processorCategory: 'provedor de inteligencia artificial', policyVersion: '1' },
});

export const aiCitationSchema = z
  .object({
    id: identifierSchema,
    title: z.string().trim().min(1).max(240),
    authority: z.string().trim().min(1).max(160),
    url: safeUrlSchema,
    revision: z.string().max(80).nullable().optional(),
    publishedAt: timestampSchema.nullable().optional(),
    provenance: z.enum(Object.values(AI_PROVENANCE)),
  })
  .passthrough();

export const aiUsageSchema = z
  .object({
    inputTokens: z.number().int().nonnegative().optional(),
    outputTokens: z.number().int().nonnegative().optional(),
    estimatedCost: z.number().nonnegative().optional(),
    currency: z.string().length(3).optional(),
  })
  .passthrough();

export const aiActionDraftSchema = z
  .object({
    id: identifierSchema,
    type: z.enum(['task', 'note', 'filter', 'report_narrative']),
    title: z.string().trim().min(1).max(180),
    target: z.string().trim().min(1).max(240),
    consequence: z.string().trim().min(1).max(500),
    fields: z.record(z.string().max(80), z.unknown()),
    evidenceIds: z.array(identifierSchema).max(20),
    intentToken: z.string().min(8).max(500),
    expiresAt: timestampSchema,
  })
  .passthrough();

const eventBaseSchema = z.object({
  operationId: operationSchema,
  sequence: sequenceSchema,
});

export const aiStreamEventSchema = z.discriminatedUnion('kind', [
  eventBaseSchema.extend({ kind: z.literal(AI_EVENT_KINDS.ACK), messageId: identifierSchema }),
  eventBaseSchema.extend({
    kind: z.literal(AI_EVENT_KINDS.STATUS),
    stage: z.enum(['authorizing', 'retrieving', 'analyzing', 'generating', 'validating']),
    label: z.string().trim().min(1).max(160),
  }),
  eventBaseSchema.extend({ kind: z.literal(AI_EVENT_KINDS.TEXT_DELTA), delta: z.string().min(1).max(8000) }),
  eventBaseSchema.extend({ kind: z.literal(AI_EVENT_KINDS.CITATION), citation: aiCitationSchema }),
  eventBaseSchema.extend({ kind: z.literal(AI_EVENT_KINDS.ACTION_DRAFT), draft: aiActionDraftSchema }),
  eventBaseSchema.extend({ kind: z.literal(AI_EVENT_KINDS.USAGE), usage: aiUsageSchema }),
  eventBaseSchema.extend({
    kind: z.literal(AI_EVENT_KINDS.COMPLETED),
    messageId: identifierSchema,
    completedAt: timestampSchema,
  }),
  eventBaseSchema.extend({
    kind: z.literal(AI_EVENT_KINDS.REFUSED),
    category: z.enum(['scope', 'safety', 'privacy', 'policy']),
    message: z.string().trim().min(1).max(1200),
  }),
  eventBaseSchema.extend({
    kind: z.literal(AI_EVENT_KINDS.ERROR),
    code: z.string().min(1).max(80),
    message: z.string().trim().min(1).max(500),
    retryable: z.boolean(),
    incidentId: z.string().max(160).nullable().optional(),
  }),
]);

export const aiContextSchema = z
  .object({
    route: z.string().startsWith('/dashboard/').max(180),
    locale: z.literal('pt-BR'),
    provenance: z.enum(Object.values(AI_PROVENANCE)),
    resourceType: z.string().min(1).max(80).nullable(),
    resourceId: identifierSchema.nullable(),
    period: z.string().max(80).nullable(),
    selectedFields: z.record(z.string().max(80), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
    observedAt: timestampSchema,
  })
  .passthrough();

export const aiMessageRequestSchema = z
  .object({
    clientMessageId: operationSchema,
    operationId: operationSchema,
    text: boundedTextSchema,
    context: aiContextSchema.nullable(),
    attachmentIds: z.array(identifierSchema).max(3).default([]),
    consentPolicyVersion: z.string().min(1).max(80),
  })
  .strict();

export const aiConversationSummarySchema = z
  .object({
    id: identifierSchema,
    title: z.string().trim().min(1).max(160),
    updatedAt: timestampSchema,
    messageCount: z.number().int().nonnegative(),
  })
  .passthrough();

export const aiConversationListSchema = z.object({ conversations: z.array(aiConversationSummarySchema) }).passthrough();

export const aiConversationSchema = z
  .object({
    id: identifierSchema,
    title: z.string().trim().min(1).max(160),
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
    messages: z.array(
      z
        .object({
          id: identifierSchema,
          role: z.enum(['user', 'assistant']),
          content: z.string().max(50000),
          status: z.enum(['complete', 'incomplete', 'refused']),
          createdAt: timestampSchema,
          citations: z.array(aiCitationSchema).default([]),
        })
        .passthrough()
    ),
  })
  .passthrough();

export const aiOperationResponseSchema = z
  .object({
    success: z.boolean(),
    operationId: operationSchema.optional(),
    incidentId: z.string().max(160).nullable().optional(),
  })
  .passthrough();

export const semanticQuerySchema = z
  .object({ query: z.string().trim().min(2).max(500), context: aiContextSchema.nullable().optional() })
  .strict();

export const semanticResultSchema = z
  .object({
    id: identifierSchema,
    kind: z.enum(['route', 'record', 'help', 'species', 'agronomy']),
    title: z.string().min(1).max(240),
    description: z.string().max(600),
    destination: safeUrlSchema,
    matchType: z.enum(['direct', 'semantic']),
    reason: z.string().min(1).max(300),
    score: z.number().min(0).max(1),
    citation: aiCitationSchema.optional(),
  })
  .passthrough();

export const semanticResultsSchema = z
  .object({ queryId: identifierSchema, results: z.array(semanticResultSchema).max(30), refinement: z.string().max(300).nullable() })
  .passthrough();

export const workflowPlanSchema = z
  .object({
    id: identifierSchema,
    intent: z.enum(['navigate', 'filter', 'report', 'form_suggestion', 'task_draft', 'note_draft']),
    summary: z.string().min(1).max(500),
    target: z.string().min(1).max(240),
    parameters: z.record(z.string().max(80), z.unknown()),
    evidenceIds: z.array(identifierSchema).max(20),
    reviewLevel: z.enum(['none', 'review', 'confirmation']),
  })
  .passthrough();

export const aiFieldDiffSchema = z
  .object({
    field: z.string().regex(/^[a-zA-Z0-9_.-]{1,80}$/),
    previousValue: z.unknown(),
    proposedValue: z.unknown(),
    reason: z.string().min(1).max(500),
    evidenceIds: z.array(identifierSchema).max(20),
    valid: z.boolean(),
  })
  .strict();

export const aiFieldDiffListSchema = z.object({ suggestions: z.array(aiFieldDiffSchema).max(40) }).passthrough();

export const proactiveInsightSchema = z
  .object({
    id: identifierSchema,
    trigger: z.enum(['anomaly', 'recurring_alert', 'crop_stage', 'report_trend', 'knowledge_update']),
    title: z.string().min(1).max(180),
    summary: z.string().min(1).max(800),
    urgency: z.enum(['info', 'attention', 'important']),
    freshness: z.enum(['fresh', 'stale', 'withdrawn']),
    uncertainty: z.enum(['low', 'medium', 'high']),
    evidence: z.array(aiCitationSchema).max(10),
    reasonCode: z.string().min(1).max(80),
    createdAt: timestampSchema,
  })
  .passthrough();

export const proactiveInsightsSchema = z.object({ insights: z.array(proactiveInsightSchema).max(50) }).passthrough();
