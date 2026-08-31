import { API_ERROR_KINDS, ApiError } from '../../services/apiClient';

export const AI_ERROR_KINDS = Object.freeze({
  DISABLED: 'disabled',
  OFFLINE: 'offline',
  TIMEOUT: 'timeout',
  CANCELLED: 'cancelled',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  QUOTA: 'quota',
  RATE_LIMIT: 'rate-limit',
  REFUSED: 'refused',
  CONTRACT: 'contract',
  PROVIDER: 'provider',
  INCOMPLETE: 'incomplete',
  UNKNOWN: 'unknown',
});

const MESSAGES = Object.freeze({
  [AI_ERROR_KINDS.DISABLED]: 'A inteligencia Hortelan ainda nao esta disponivel neste ambiente.',
  [AI_ERROR_KINDS.OFFLINE]: 'Voce esta offline. A conversa pode continuar quando a conexao voltar.',
  [AI_ERROR_KINDS.TIMEOUT]: 'A analise levou mais tempo que o esperado. Tente novamente.',
  [AI_ERROR_KINDS.CANCELLED]: 'A resposta foi interrompida.',
  [AI_ERROR_KINDS.UNAUTHORIZED]: 'Sua sessao expirou. Entre novamente para usar a inteligencia Hortelan.',
  [AI_ERROR_KINDS.FORBIDDEN]: 'Sua conta nao possui acesso a esta assistencia.',
  [AI_ERROR_KINDS.QUOTA]: 'O limite de inteligencia do periodo foi atingido.',
  [AI_ERROR_KINDS.RATE_LIMIT]: 'Muitas solicitacoes em pouco tempo. Aguarde antes de tentar novamente.',
  [AI_ERROR_KINDS.REFUSED]: 'Nao posso concluir esta solicitacao dentro dos limites de seguranca.',
  [AI_ERROR_KINDS.CONTRACT]: 'A resposta recebida nao passou pela validacao de seguranca.',
  [AI_ERROR_KINDS.PROVIDER]: 'O servico de inteligencia esta temporariamente indisponivel.',
  [AI_ERROR_KINDS.INCOMPLETE]: 'A resposta ficou incompleta e nao pode gerar acoes.',
  [AI_ERROR_KINDS.UNKNOWN]: 'Nao foi possivel concluir a solicitacao agora.',
});

export class AiError extends Error {
  constructor(kind, options = {}) {
    super(options.message || MESSAGES[kind] || MESSAGES[AI_ERROR_KINDS.UNKNOWN]);
    this.name = 'AiError';
    this.kind = kind;
    this.retryable = Boolean(options.retryable);
    this.incidentId = options.incidentId || null;
    this.retryAfterMs = options.retryAfterMs || 0;
    this.cause = options.cause;
  }
}

export function mapAiError(error) {
  if (error instanceof AiError) return error;
  if (!(error instanceof ApiError)) return new AiError(AI_ERROR_KINDS.UNKNOWN, { cause: error });

  const mappedKind = {
    [API_ERROR_KINDS.OFFLINE]: AI_ERROR_KINDS.OFFLINE,
    [API_ERROR_KINDS.TIMEOUT]: AI_ERROR_KINDS.TIMEOUT,
    [API_ERROR_KINDS.CANCELLATION]: AI_ERROR_KINDS.CANCELLED,
    [API_ERROR_KINDS.AUTHENTICATION]: AI_ERROR_KINDS.UNAUTHORIZED,
    [API_ERROR_KINDS.AUTHORIZATION]: AI_ERROR_KINDS.FORBIDDEN,
    [API_ERROR_KINDS.RATE_LIMIT]: AI_ERROR_KINDS.RATE_LIMIT,
    [API_ERROR_KINDS.CONTRACT]: AI_ERROR_KINDS.CONTRACT,
    [API_ERROR_KINDS.TRANSPORT]: AI_ERROR_KINDS.PROVIDER,
    [API_ERROR_KINDS.HTTP]: AI_ERROR_KINDS.PROVIDER,
  }[error.kind];

  const quota = error.status === 402 || error.payload?.code === 'AI_QUOTA_EXCEEDED';
  return new AiError(quota ? AI_ERROR_KINDS.QUOTA : mappedKind || AI_ERROR_KINDS.UNKNOWN, {
    retryable: error.retryable,
    retryAfterMs: error.retryAfterMs,
    incidentId: error.incidentId,
    cause: error,
  });
}
