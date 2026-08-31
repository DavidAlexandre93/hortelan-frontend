import { describe, expect, it } from 'vitest';
import {
  AI_EVENT_KINDS,
  aiActionDraftSchema,
  aiCapabilitiesSchema,
  aiCitationSchema,
  aiFieldDiffSchema,
  aiMessageRequestSchema,
  aiStreamEventSchema,
  unavailableAiCapabilities,
} from './contracts';

describe('AI contracts', () => {
  it('valida a capacidade indisponivel padrao', () => {
    expect(aiCapabilitiesSchema.parse(unavailableAiCapabilities)).toMatchObject({
      available: false,
      status: 'disabled',
    });
  });

  it('aceita apenas citacoes internas ou HTTPS', () => {
    const base = {
      id: 'source-1',
      title: 'Fonte aprovada',
      authority: 'Hortelan',
      provenance: 'curated',
    };
    expect(aiCitationSchema.safeParse({ ...base, url: '/dashboard/suporte' }).success).toBe(true);
    expect(aiCitationSchema.safeParse({ ...base, url: 'https://example.org/agronomia' }).success).toBe(true);
    expect(aiCitationSchema.safeParse({ ...base, url: 'javascript:alert(1)' }).success).toBe(false);
    expect(aiCitationSchema.safeParse({ ...base, url: '//external.example' }).success).toBe(false);
  });

  it('rejeita tipos de acao consequenciais', () => {
    const draft = {
      id: 'draft-1',
      type: 'irrigation',
      title: 'Ligar irrigacao',
      target: 'Zona A',
      consequence: 'Acionamento direto',
      fields: {},
      evidenceIds: [],
      intentToken: 'intent-token-123',
      expiresAt: new Date().toISOString(),
    };
    expect(aiActionDraftSchema.safeParse(draft).success).toBe(false);
  });

  it('rejeita campos extras privilegiados na mensagem', () => {
    const request = {
      clientMessageId: 'message-client-123',
      operationId: 'operation-client-123',
      text: 'Explique o alerta atual',
      context: null,
      attachmentIds: [],
      consentPolicyVersion: 'policy-v1',
      model: 'provider-model-secret',
    };
    expect(aiMessageRequestSchema.safeParse(request).success).toBe(false);
  });

  it('valida eventos conhecidos e rejeita eventos desconhecidos', () => {
    expect(
      aiStreamEventSchema.safeParse({
        kind: AI_EVENT_KINDS.TEXT_DELTA,
        operationId: 'operation-123',
        sequence: 1,
        delta: 'Analise em andamento',
      }).success
    ).toBe(true);
    expect(
      aiStreamEventSchema.safeParse({
        kind: 'tool_execution',
        operationId: 'operation-123',
        sequence: 2,
      }).success
    ).toBe(false);
  });

  it('preserva diffs por campo sem permitir chave arbitraria', () => {
    expect(
      aiFieldDiffSchema.safeParse({
        field: 'garden.region',
        previousValue: 'Sul',
        proposedValue: 'Sudeste',
        reason: 'Local informado no perfil',
        evidenceIds: ['profile-region'],
        valid: true,
      }).success
    ).toBe(true);
    expect(
      aiFieldDiffSchema.safeParse({
        field: '<script>',
        previousValue: '',
        proposedValue: 'x',
        reason: 'x',
        evidenceIds: [],
        valid: true,
      }).success
    ).toBe(false);
  });
});
