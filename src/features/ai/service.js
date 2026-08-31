import { z } from 'zod';
import { API_ERROR_KINDS, ApiError, apiRequest, createApiUrl } from '../../services/apiClient';
import { createId } from '../../utils/createId';
import {
  AI_AVAILABILITY,
  AI_EVENT_KINDS,
  aiCapabilitiesSchema,
  aiConversationListSchema,
  aiConversationSchema,
  aiFieldDiffListSchema,
  aiMessageRequestSchema,
  aiOperationResponseSchema,
  proactiveInsightsSchema,
  semanticQuerySchema,
  semanticResultsSchema,
  unavailableAiCapabilities,
  workflowPlanSchema,
} from './contracts';
import { AI_ERROR_KINDS, AiError, mapAiError } from './errors';
import { parseEventStream } from './streamParser';
import { recordAiTelemetry } from './telemetry';

const CAPABILITY_CACHE_MS = 60 * 1000;
const STREAM_TIMEOUT_MS = Number(import.meta.env.VITE_AI_TIMEOUT_MS) || 45000;
const AI_ENABLED = import.meta.env.VITE_ENABLE_AI_COPILOT === 'true';
const AI_FAKE_MODE = import.meta.env.DEV && import.meta.env.VITE_AI_FAKE_MODE === 'true';

const ENDPOINTS = Object.freeze({
  capabilities: '/ai/capabilities',
  conversations: '/ai/conversations',
  semanticDiscovery: '/ai/discovery',
  workflowPlan: '/ai/plans',
  formAssist: '/ai/forms/assist',
  insights: '/ai/insights',
  attachments: '/ai/attachments',
});

const conversationCreateSchema = aiConversationSchema.pick({ id: true, title: true, createdAt: true, updatedAt: true });
const attachmentSchema = z
  .object({
    id: z.string().min(1).max(160),
    name: z.string().min(1).max(240),
    contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
    size: z.number().int().positive(),
    expiresAt: z.string().min(1),
  })
  .passthrough();

let capabilityCache = null;

function isRuntimeEnabled() {
  return AI_ENABLED || AI_FAKE_MODE;
}

function fakeCapabilities() {
  return aiCapabilitiesSchema.parse({
    ...unavailableAiCapabilities,
    available: true,
    status: AI_AVAILABILITY.READY,
    modalities: ['text', 'image'],
    features: {
      chat: true,
      semanticDiscovery: true,
      workflowPlanning: true,
      formAssistance: true,
      proactiveInsights: true,
      imageAnalysis: true,
    },
    retention: {
      mode: 'none',
      summary: 'Modo local de demonstracao. O conteudo nao e enviado a um provedor externo.',
      deletionAvailable: false,
    },
    consent: {
      required: true,
      processorCategory: 'simulador local de desenvolvimento',
      policyVersion: 'dev-fake-v1',
    },
  });
}

function now() {
  return new Date().toISOString();
}

async function runFakeStream(request, onEvent, signal) {
  const operationId = request.operationId;
  const events = [
    { kind: AI_EVENT_KINDS.ACK, operationId, sequence: 0, messageId: createId('message') },
    {
      kind: AI_EVENT_KINDS.STATUS,
      operationId,
      sequence: 1,
      stage: 'retrieving',
      label: 'Consultando fontes aprovadas',
    },
    {
      kind: AI_EVENT_KINDS.TEXT_DELTA,
      operationId,
      sequence: 2,
      delta:
        'Este e um retorno de demonstracao local. Configure o gateway Hortelan para receber analises fundamentadas em dados autorizados e fontes agronomicas aprovadas.',
    },
    {
      kind: AI_EVENT_KINDS.CITATION,
      operationId,
      sequence: 3,
      citation: {
        id: 'hortelan-help-ai',
        title: 'Central de ajuda Hortelan',
        authority: 'Hortelan',
        url: '/dashboard/suporte',
        revision: 'dev-fake-v1',
        provenance: 'curated',
      },
    },
    { kind: AI_EVENT_KINDS.COMPLETED, operationId, sequence: 4, messageId: createId('message'), completedAt: now() },
  ];

  for (const event of events) {
    if (signal?.aborted) throw new AiError(AI_ERROR_KINDS.CANCELLED);
    await onEvent(event);
  }
  return events;
}

function operationOptions(operationId, options = {}) {
  return {
    ...options,
    headers: {
      'Idempotency-Key': operationId,
      'X-Client-Operation-Id': operationId,
      ...(options.headers || {}),
    },
    retryAttempts: 0,
  };
}

async function parseErrorResponse(response) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  const code = payload?.error?.code || payload?.code || null;
  const diagnostics = payload?.error?.diagnostics || payload?.diagnostics || {};
  const errorKind = response.status === 401
    ? API_ERROR_KINDS.AUTHENTICATION
    : response.status === 403
      ? API_ERROR_KINDS.AUTHORIZATION
      : response.status === 429
        ? API_ERROR_KINDS.RATE_LIMIT
        : API_ERROR_KINDS.HTTP;
  return new ApiError(errorKind, {
    status: response.status,
    retryable: [408, 425, 429, 500, 502, 503, 504].includes(response.status),
    payload: {
      code,
      incidentId: diagnostics.incident_id || payload?.incidentId || null,
      requestId: diagnostics.request_id || null,
    },
  });
}

export function getAiRuntimeConfig() {
  return Object.freeze({ enabled: isRuntimeEnabled(), fakeMode: AI_FAKE_MODE });
}

export async function getAiCapabilities(options = {}) {
  if (!isRuntimeEnabled()) return unavailableAiCapabilities;
  if (AI_FAKE_MODE) return fakeCapabilities();

  const fresh = capabilityCache && Date.now() - capabilityCache.cachedAt < CAPABILITY_CACHE_MS;
  if (fresh && !options.force) return capabilityCache.value;

  try {
    const value = await apiRequest(ENDPOINTS.capabilities, {
      signal: options.signal,
      schema: aiCapabilitiesSchema,
      retryAttempts: 1,
      timeoutMs: Math.min(STREAM_TIMEOUT_MS, 12000),
    });
    capabilityCache = { cachedAt: Date.now(), value };
    return value;
  } catch (error) {
    const mapped = mapAiError(error);
    return {
      ...unavailableAiCapabilities,
      status: AI_AVAILABILITY.UNAVAILABLE,
      incidentId: mapped.incidentId,
    };
  }
}

export function clearAiCapabilityCache() {
  capabilityCache = null;
}

export async function createAiConversation(options = {}) {
  const operationId = options.operationId || createId('ai-conversation');
  if (AI_FAKE_MODE) {
    const timestamp = now();
    return { id: createId('conversation'), title: 'Nova conversa', createdAt: timestamp, updatedAt: timestamp };
  }
  try {
    return await apiRequest(ENDPOINTS.conversations, {
      ...operationOptions(operationId, options),
      method: 'POST',
      body: JSON.stringify({ operationId }),
      schema: conversationCreateSchema,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function listAiConversations(options = {}) {
  if (AI_FAKE_MODE) return { conversations: [] };
  try {
    return await apiRequest(ENDPOINTS.conversations, { ...options, schema: aiConversationListSchema });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function getAiConversation(conversationId, options = {}) {
  if (AI_FAKE_MODE) {
    const timestamp = now();
    return {
      id: String(conversationId),
      title: 'Conversa de demonstracao',
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [],
    };
  }
  try {
    return await apiRequest(`${ENDPOINTS.conversations}/${encodeURIComponent(conversationId)}`, {
      ...options,
      schema: aiConversationSchema,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function renameAiConversation(conversationId, title, options = {}) {
  const operationId = options.operationId || createId('ai-rename');
  if (AI_FAKE_MODE) return { success: true, operationId };
  try {
    return await apiRequest(`${ENDPOINTS.conversations}/${encodeURIComponent(conversationId)}`, {
      ...operationOptions(operationId, options),
      method: 'PATCH',
      body: JSON.stringify({ operationId, title: String(title).trim().slice(0, 160) }),
      schema: aiOperationResponseSchema,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function deleteAiConversation(conversationId, options = {}) {
  const operationId = options.operationId || createId('ai-delete');
  if (AI_FAKE_MODE) return { success: true, operationId };
  try {
    return await apiRequest(`${ENDPOINTS.conversations}/${encodeURIComponent(conversationId)}`, {
      ...operationOptions(operationId, options),
      method: 'DELETE',
      body: JSON.stringify({ operationId }),
      schema: aiOperationResponseSchema,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function submitAiMessage(conversationId, input, options = {}) {
  if (!isRuntimeEnabled()) throw new AiError(AI_ERROR_KINDS.DISABLED);
  const operationId = input.operationId || createId('ai-operation');
  const payload = aiMessageRequestSchema.parse({
    ...input,
    operationId,
    clientMessageId: input.clientMessageId || createId('ai-message'),
  });
  const onEvent = options.onEvent || (() => {});
  const startedAt = performance.now();

  if (AI_FAKE_MODE) return runFakeStream(payload, onEvent, options.signal);

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  else options.signal?.addEventListener('abort', abortFromCaller, { once: true });
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || STREAM_TIMEOUT_MS);

  try {
    const response = await fetch(
      createApiUrl(`${ENDPOINTS.conversations}/${encodeURIComponent(conversationId)}/messages`),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'text/event-stream',
          'Content-Type': 'application/json',
          'Idempotency-Key': operationId,
          'X-Client-Operation-Id': operationId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    if (!response.ok) throw await parseErrorResponse(response);
    if (!response.body || !response.headers.get('content-type')?.includes('text/event-stream')) {
      throw new AiError(AI_ERROR_KINDS.CONTRACT);
    }

    const events = await parseEventStream(response.body, { signal: controller.signal, onEvent });
    recordAiTelemetry('message.completed', {
      operation: 'conversation.message',
      schemaVersion: '1',
      latencyMs: Math.round(performance.now() - startedAt),
      status: 'completed',
    });
    return events;
  } catch (error) {
    const timedOut = controller.signal.aborted && !options.signal?.aborted;
    const mapped = timedOut ? new AiError(AI_ERROR_KINDS.TIMEOUT, { retryable: true, cause: error }) : mapAiError(error);
    recordAiTelemetry(
      'message.failed',
      {
        operation: 'conversation.message',
        schemaVersion: '1',
        latencyMs: Math.round(performance.now() - startedAt),
        status: mapped.kind,
        incidentId: mapped.incidentId,
      },
      mapped.kind === AI_ERROR_KINDS.CANCELLED ? 'info' : 'warning'
    );
    throw mapped;
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

export async function submitAiFeedback(messageId, rating, comment, options = {}) {
  const operationId = options.operationId || createId('ai-feedback');
  if (AI_FAKE_MODE) return { success: true, operationId };
  try {
    return await apiRequest(`/ai/messages/${encodeURIComponent(messageId)}/feedback`, {
      ...operationOptions(operationId, options),
      method: 'POST',
      body: JSON.stringify({ operationId, rating, comment: String(comment || '').trim().slice(0, 500) || undefined }),
      schema: aiOperationResponseSchema,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function discoverWithAi(input, options = {}) {
  const payload = semanticQuerySchema.parse(input);
  try {
    return await apiRequest(ENDPOINTS.semanticDiscovery, {
      ...options,
      method: 'POST',
      body: JSON.stringify(payload),
      schema: semanticResultsSchema,
      retryAttempts: 0,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function createWorkflowPlan(input, options = {}) {
  try {
    return await apiRequest(ENDPOINTS.workflowPlan, {
      ...options,
      method: 'POST',
      body: JSON.stringify(input),
      schema: workflowPlanSchema,
      retryAttempts: 0,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function requestFormAssistance(input, options = {}) {
  try {
    return await apiRequest(ENDPOINTS.formAssist, {
      ...options,
      method: 'POST',
      body: JSON.stringify(input),
      schema: aiFieldDiffListSchema,
      retryAttempts: 0,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function listProactiveInsights(options = {}) {
  try {
    return await apiRequest(ENDPOINTS.insights, { ...options, schema: proactiveInsightsSchema });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function updateProactiveInsight(insightId, action, options = {}) {
  const operationId = options.operationId || createId('ai-insight');
  try {
    return await apiRequest(`${ENDPOINTS.insights}/${encodeURIComponent(insightId)}`, {
      ...operationOptions(operationId, options),
      method: 'PATCH',
      body: JSON.stringify({ operationId, action }),
      schema: aiOperationResponseSchema,
    });
  } catch (error) {
    throw mapAiError(error);
  }
}

export async function uploadAiImage(file, options = {}) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file?.type)) throw new AiError(AI_ERROR_KINDS.CONTRACT);
  if (!file.size || file.size > (options.maxBytes || 5000000)) throw new AiError(AI_ERROR_KINDS.CONTRACT);
  if (!options.confirmed) throw new AiError(AI_ERROR_KINDS.FORBIDDEN);

  const operationId = options.operationId || createId('ai-attachment');
  if (AI_FAKE_MODE) {
    return {
      id: createId('attachment'),
      name: file.name,
      contentType: file.type,
      size: file.size,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }
  const form = new FormData();
  form.append('file', file);
  form.append('operationId', operationId);

  try {
    const response = await fetch(createApiUrl(ENDPOINTS.attachments), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Idempotency-Key': operationId, 'X-Client-Operation-Id': operationId },
      body: form,
      signal: options.signal,
    });
    if (!response.ok) throw await parseErrorResponse(response);
    const parsed = attachmentSchema.safeParse(await response.json());
    if (!parsed.success) throw new AiError(AI_ERROR_KINDS.CONTRACT, { cause: parsed.error });
    return parsed.data;
  } catch (error) {
    throw mapAiError(error);
  }
}
