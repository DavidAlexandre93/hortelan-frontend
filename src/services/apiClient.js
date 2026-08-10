import { registerApiMetric } from './platformReliability';

const LOCAL_API_BASE_URL = 'http://localhost:3001';
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 12000;
const DEFAULT_RETRY_ATTEMPTS = 2;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const MAX_RETRY_DELAY_MS = 1500;

export const API_ERROR_KINDS = Object.freeze({
  HTTP: 'http',
  TRANSPORT: 'transport',
  OFFLINE: 'offline',
  TIMEOUT: 'timeout',
  CANCELLATION: 'cancellation',
  CONTRACT: 'contract',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  RATE_LIMIT: 'rate-limit',
});

const USER_MESSAGES = {
  [API_ERROR_KINDS.TRANSPORT]: 'Nao foi possivel conectar ao servico. Tente novamente.',
  [API_ERROR_KINDS.OFFLINE]: 'Voce esta offline. Verifique a conexao e tente novamente.',
  [API_ERROR_KINDS.TIMEOUT]: 'O servico demorou mais que o esperado. Tente novamente.',
  [API_ERROR_KINDS.CANCELLATION]: 'A solicitacao foi cancelada.',
  [API_ERROR_KINDS.CONTRACT]: 'Recebemos uma resposta inesperada. Tente novamente em instantes.',
  [API_ERROR_KINDS.AUTHENTICATION]: 'Sua sessao expirou ou as credenciais nao foram aceitas.',
  [API_ERROR_KINDS.AUTHORIZATION]: 'Sua conta nao possui permissao para esta acao.',
  [API_ERROR_KINDS.RATE_LIMIT]: 'Muitas tentativas em pouco tempo. Aguarde e tente novamente.',
  [API_ERROR_KINDS.HTTP]: 'O servico nao conseguiu concluir a solicitacao.',
};

class ApiError extends Error {
  constructor(kind, options = {}) {
    super(options.userMessage || USER_MESSAGES[kind] || USER_MESSAGES[API_ERROR_KINDS.HTTP]);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = options.status || 0;
    this.retryable = Boolean(options.retryable);
    this.retryAfterMs = options.retryAfterMs || 0;
    this.payload = options.payload || null;
    this.cause = options.cause;
  }
}

function resolveDefaultApiBaseUrl() {
  if (typeof window === 'undefined') return LOCAL_API_BASE_URL;
  const hostname = window.location?.hostname || '';
  return ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) ? LOCAL_API_BASE_URL : window.location.origin;
}

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || resolveDefaultApiBaseUrl();
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');

function sanitizePath(path) {
  return String(path || '').split('?')[0] || 'unknown';
}

function elapsedSince(startedAt) {
  const now = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  return Math.max(0, Math.round(now - startedAt));
}

function statusKind(status) {
  if (status === 401) return API_ERROR_KINDS.AUTHENTICATION;
  if (status === 403) return API_ERROR_KINDS.AUTHORIZATION;
  if (status === 429) return API_ERROR_KINDS.RATE_LIMIT;
  return API_ERROR_KINDS.HTTP;
}

function retryAfterMs(response) {
  const header = response.headers.get('retry-after');
  if (!header) return 0;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(header);
  return Number.isNaN(date) ? 0 : Math.max(0, date - Date.now());
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (cause) {
    if (response.ok) {
      throw new ApiError(API_ERROR_KINDS.CONTRACT, { status: response.status, cause });
    }
    return null;
  }
}

function validatePayload(payload, schema) {
  if (!schema) return payload;
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ApiError(API_ERROR_KINDS.CONTRACT, { cause: result.error });
  }
  return result.data;
}

function calculateBackoffMs(attempt, retryAfter = 0) {
  if (retryAfter) return Math.min(retryAfter, 10000);
  return Math.min(250 * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new ApiError(API_ERROR_KINDS.CANCELLATION));
      },
      { once: true }
    );
  });
}

function shouldRetry(error, attempt, maxAttempts, method) {
  return (
    attempt < maxAttempts &&
    IDEMPOTENT_METHODS.has(method) &&
    error.kind !== API_ERROR_KINDS.CANCELLATION &&
    error.kind !== API_ERROR_KINDS.CONTRACT &&
    (error.retryable || error.kind === API_ERROR_KINDS.TIMEOUT || error.kind === API_ERROR_KINDS.TRANSPORT)
  );
}

async function performRequest(path, options, timeoutMs, schema) {
  const controller = new AbortController();
  const callerSignal = options.signal;
  let timedOut = false;

  const cancelFromCaller = () => controller.abort();
  if (callerSignal?.aborted) controller.abort();
  else callerSignal?.addEventListener('abort', cancelFromCaller, { once: true });

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: options.credentials || 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
    });
    const payload = await parseResponse(response);

    if (!response.ok) {
      const kind = statusKind(response.status);
      throw new ApiError(kind, {
        status: response.status,
        retryable: RETRYABLE_STATUS_CODES.has(response.status),
        retryAfterMs: retryAfterMs(response),
        payload: payload && typeof payload === 'object' ? { code: payload.code || null } : null,
      });
    }

    return validatePayload(payload, schema);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (callerSignal?.aborted) throw new ApiError(API_ERROR_KINDS.CANCELLATION, { cause: error });
    if (timedOut) throw new ApiError(API_ERROR_KINDS.TIMEOUT, { retryable: true, cause: error });

    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    throw new ApiError(offline ? API_ERROR_KINDS.OFFLINE : API_ERROR_KINDS.TRANSPORT, {
      retryable: !offline,
      cause: error,
    });
  } finally {
    clearTimeout(timeoutId);
    callerSignal?.removeEventListener('abort', cancelFromCaller);
  }
}

export async function apiRequest(path, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retryAttempts = DEFAULT_RETRY_ATTEMPTS,
    schema,
    signal,
    ...requestOptions
  } = options;
  const method = String(requestOptions.method || 'GET').toUpperCase();
  const maxAttempts = Number.isFinite(retryAttempts) ? Math.max(0, retryAttempts) : DEFAULT_RETRY_ATTEMPTS;
  const startedAt = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  let attempt = 0;

  for (;;) {
    try {
      const result = await performRequest(path, { ...requestOptions, method, signal }, timeoutMs, schema);
      registerApiMetric(sanitizePath(path), elapsedSince(startedAt), 200, true, {
        kind: 'success',
        retryCount: attempt,
      });
      return result;
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(API_ERROR_KINDS.TRANSPORT, { cause: error });
      if (!shouldRetry(apiError, attempt, maxAttempts, method)) {
        registerApiMetric(sanitizePath(path), elapsedSince(startedAt), apiError.status, false, {
          kind: apiError.kind,
          retryCount: attempt,
        });
        throw apiError;
      }

      await wait(calculateBackoffMs(attempt, apiError.retryAfterMs), signal);
      attempt += 1;
    }
  }
}
