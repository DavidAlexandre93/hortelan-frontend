import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from './server';

export function createAiCapabilitiesHandler(overrides = {}) {
  return http.get(apiUrl('/ai/capabilities'), () =>
    HttpResponse.json({
      version: '1',
      available: true,
      status: 'ready',
      modalities: ['text', 'image'],
      features: {
        chat: true,
        semanticDiscovery: true,
        workflowPlanning: true,
        formAssistance: true,
        proactiveInsights: true,
        imageAnalysis: true,
      },
      limits: { maxInputCharacters: 4000, maxImageBytes: 5000000, maxImages: 1 },
      retention: { mode: 'session', summary: 'Retencao durante a sessao.', deletionAvailable: true },
      consent: {
        required: true,
        processorCategory: 'provedor de inteligencia artificial',
        policyVersion: 'policy-v1',
      },
      ...overrides,
    })
  );
}

function sse(events) {
  return events.map((event) => `event: ${event.kind}\ndata: ${JSON.stringify(event)}\n\n`).join('');
}

export function createAiMessageHandler(events, options = {}) {
  return http.post(apiUrl('/ai/conversations/:conversationId/messages'), async () => {
    if (options.delayMs) await delay(options.delayMs);
    return new HttpResponse(sse(events), { headers: { 'Content-Type': 'text/event-stream' } });
  });
}

export function createAiFailureHandler(status = 503, code = 'AI_PROVIDER_UNAVAILABLE') {
  return http.post(apiUrl('/ai/conversations/:conversationId/messages'), () =>
    HttpResponse.json(
      { error: { code, diagnostics: { incident_id: 'incident-ai-1', request_id: 'request-ai-1' } } },
      { status }
    )
  );
}

export const AI_TEST_EVENTS = Object.freeze({
  completed: [
    { kind: 'ack', operationId: 'operation-test-1', sequence: 0, messageId: 'message-test-1' },
    {
      kind: 'status',
      operationId: 'operation-test-1',
      sequence: 1,
      stage: 'retrieving',
      label: 'Consultando fontes',
    },
    { kind: 'text_delta', operationId: 'operation-test-1', sequence: 2, delta: 'Resposta fundamentada.' },
    {
      kind: 'citation',
      operationId: 'operation-test-1',
      sequence: 3,
      citation: {
        id: 'source-test-1',
        title: 'Fonte aprovada',
        authority: 'Hortelan',
        url: '/dashboard/suporte',
        provenance: 'curated',
      },
    },
    {
      kind: 'completed',
      operationId: 'operation-test-1',
      sequence: 4,
      messageId: 'message-test-1',
      completedAt: '2026-08-31T12:00:00.000Z',
    },
  ],
  refused: [
    { kind: 'ack', operationId: 'operation-test-2', sequence: 0, messageId: 'message-test-2' },
    {
      kind: 'refused',
      operationId: 'operation-test-2',
      sequence: 1,
      category: 'safety',
      message: 'Esta orientacao exige revisao profissional.',
    },
  ],
  interrupted: [
    { kind: 'ack', operationId: 'operation-test-3', sequence: 0, messageId: 'message-test-3' },
    { kind: 'text_delta', operationId: 'operation-test-3', sequence: 1, delta: 'Resposta parcial' },
    {
      kind: 'error',
      operationId: 'operation-test-3',
      sequence: 2,
      code: 'PROVIDER_INTERRUPTED',
      message: 'Resposta interrompida.',
      retryable: true,
      incidentId: 'incident-ai-2',
    },
  ],
});
