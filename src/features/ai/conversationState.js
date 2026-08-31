import { AI_EVENT_KINDS } from './contracts';

export const CONVERSATION_STATUS = Object.freeze({
  NEW: 'new',
  LOADING: 'loading',
  READY: 'ready',
  STREAMING: 'streaming',
  STOPPING: 'stopping',
  INCOMPLETE: 'incomplete',
  REFUSED: 'refused',
  FAILED: 'failed',
  DELETING: 'deleting',
  DELETED: 'deleted',
});

export function createConversationState() {
  return {
    status: CONVERSATION_STATUS.NEW,
    conversationId: null,
    operationId: null,
    messageId: null,
    text: '',
    stage: null,
    stageLabel: '',
    citations: [],
    actionDrafts: [],
    usage: null,
    error: null,
    completedAt: null,
  };
}

function appendUniqueById(items, item) {
  return items.some((existing) => existing.id === item.id) ? items : [...items, item];
}

export function conversationReducer(state, action) {
  switch (action.type) {
    case 'conversation/loading':
      return { ...state, status: CONVERSATION_STATUS.LOADING, error: null };
    case 'conversation/ready':
      return { ...state, status: CONVERSATION_STATUS.READY, conversationId: action.conversationId, error: null };
    case 'message/start':
      return {
        ...createConversationState(),
        status: CONVERSATION_STATUS.STREAMING,
        conversationId: state.conversationId,
        operationId: action.operationId,
      };
    case 'message/stop':
      return state.status === CONVERSATION_STATUS.STREAMING
        ? { ...state, status: CONVERSATION_STATUS.STOPPING }
        : state;
    case 'message/event': {
      const event = action.event;
      if (state.operationId && event.operationId !== state.operationId) return state;
      if (event.kind === AI_EVENT_KINDS.ACK) return { ...state, messageId: event.messageId };
      if (event.kind === AI_EVENT_KINDS.STATUS)
        return { ...state, stage: event.stage, stageLabel: event.label };
      if (event.kind === AI_EVENT_KINDS.TEXT_DELTA) return { ...state, text: `${state.text}${event.delta}` };
      if (event.kind === AI_EVENT_KINDS.CITATION)
        return { ...state, citations: appendUniqueById(state.citations, event.citation) };
      if (event.kind === AI_EVENT_KINDS.ACTION_DRAFT)
        return { ...state, actionDrafts: appendUniqueById(state.actionDrafts, event.draft) };
      if (event.kind === AI_EVENT_KINDS.USAGE) return { ...state, usage: event.usage };
      if (event.kind === AI_EVENT_KINDS.COMPLETED)
        return {
          ...state,
          status: CONVERSATION_STATUS.READY,
          messageId: event.messageId,
          completedAt: event.completedAt,
          stage: null,
          stageLabel: '',
        };
      if (event.kind === AI_EVENT_KINDS.REFUSED)
        return {
          ...state,
          status: CONVERSATION_STATUS.REFUSED,
          text: event.message,
          actionDrafts: [],
          stage: null,
          stageLabel: '',
        };
      if (event.kind === AI_EVENT_KINDS.ERROR)
        return {
          ...state,
          status: state.text ? CONVERSATION_STATUS.INCOMPLETE : CONVERSATION_STATUS.FAILED,
          error: event,
          actionDrafts: [],
          stage: null,
          stageLabel: '',
        };
      return state;
    }
    case 'message/cancelled':
      return {
        ...state,
        status: state.text ? CONVERSATION_STATUS.INCOMPLETE : CONVERSATION_STATUS.READY,
        actionDrafts: [],
        stage: null,
        stageLabel: '',
      };
    case 'message/failed':
      return {
        ...state,
        status: state.text ? CONVERSATION_STATUS.INCOMPLETE : CONVERSATION_STATUS.FAILED,
        actionDrafts: [],
        error: action.error,
        stage: null,
        stageLabel: '',
      };
    case 'conversation/deleting':
      return { ...state, status: CONVERSATION_STATUS.DELETING, error: null };
    case 'conversation/deleted':
      return { ...createConversationState(), status: CONVERSATION_STATUS.DELETED };
    case 'conversation/reset':
      return createConversationState();
    default:
      return state;
  }
}
