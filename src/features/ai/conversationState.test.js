import { describe, expect, it } from 'vitest';
import { conversationReducer, CONVERSATION_STATUS, createConversationState } from './conversationState';

describe('conversationReducer', () => {
  it('monta uma resposta concluida com citacoes sem duplicar', () => {
    let state = conversationReducer(createConversationState(), {
      type: 'message/start',
      operationId: 'operation-123',
    });
    const citation = {
      id: 'source-1',
      title: 'Fonte',
      authority: 'Hortelan',
      url: '/dashboard/suporte',
      provenance: 'curated',
    };
    state = conversationReducer(state, {
      type: 'message/event',
      event: { kind: 'text_delta', operationId: 'operation-123', sequence: 1, delta: 'Resposta' },
    });
    state = conversationReducer(state, {
      type: 'message/event',
      event: { kind: 'citation', operationId: 'operation-123', sequence: 2, citation },
    });
    state = conversationReducer(state, {
      type: 'message/event',
      event: { kind: 'citation', operationId: 'operation-123', sequence: 3, citation },
    });
    state = conversationReducer(state, {
      type: 'message/event',
      event: {
        kind: 'completed',
        operationId: 'operation-123',
        sequence: 4,
        messageId: 'message-1',
        completedAt: '2026-08-31T12:00:00.000Z',
      },
    });
    expect(state.status).toBe(CONVERSATION_STATUS.READY);
    expect(state.text).toBe('Resposta');
    expect(state.citations).toHaveLength(1);
  });

  it('marca resposta parcial como incompleta e remove drafts', () => {
    const initial = {
      ...createConversationState(),
      status: CONVERSATION_STATUS.STREAMING,
      operationId: 'operation-123',
      text: 'Parcial',
      actionDrafts: [{ id: 'draft-1' }],
    };
    const state = conversationReducer(initial, {
      type: 'message/event',
      event: {
        kind: 'error',
        operationId: 'operation-123',
        sequence: 3,
        code: 'PROVIDER_INTERRUPTED',
        message: 'Interrompido',
        retryable: true,
      },
    });
    expect(state.status).toBe(CONVERSATION_STATUS.INCOMPLETE);
    expect(state.actionDrafts).toEqual([]);
  });

  it('ignora evento atrasado de outra operacao', () => {
    const state = {
      ...createConversationState(),
      status: CONVERSATION_STATUS.STREAMING,
      operationId: 'current-operation',
    };
    expect(
      conversationReducer(state, {
        type: 'message/event',
        event: { kind: 'text_delta', operationId: 'old-operation', sequence: 8, delta: 'atrasado' },
      })
    ).toBe(state);
  });
});
