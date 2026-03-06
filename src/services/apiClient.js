import { registerApiMetric } from './platformReliability';

const DEFAULT_API_BASE_URL = 'http://localhost:3001';
const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_RETRY_ATTEMPTS = 2;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_RETRY_DELAY_MS = 1500;

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  DEFAULT_API_BASE_URL;

export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');

function shouldRetry(error, attempt, maxAttempts, method = 'GET') {
  if (attempt >= maxAttempts) {
    return false;
  }

  const normalizedMethod = method.toUpperCase();
  const idempotentMethod = ['GET', 'HEAD', 'OPTIONS'].includes(normalizedMethod);

  if (!idempotentMethod) {
    return false;
  }

  if (error?.name === 'AbortError') {
    return true;
  }

  return RETRYABLE_STATUS_CODES.has(error?.status);
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function safeParseJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
}

function calculateBackoffMs(attempt) {
  const exponentialDelay = Math.min(250 * 2 ** attempt, MAX_RETRY_DELAY_MS);
  const jitter = Math.floor(Math.random() * 120);
  return exponentialDelay + jitter;
}

function sanitizePath(path) {
  return String(path || '').split('?')[0] || 'unknown';
}

async function performRequest(path, options = {}, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = typeof window !== 'undefined' && window.performance?.now ? window.performance.now() : Date.now();

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });

    const payload = await safeParseJson(response);

    const finishedAt = typeof window !== 'undefined' && window.performance?.now ? window.performance.now() : Date.now();

    if (!response.ok) {
      const error = new Error(payload?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    registerApiMetric(sanitizePath(path), Math.round(finishedAt - startedAt), response.status, true);
    return payload;
  } catch (error) {
    const finishedAt = typeof window !== 'undefined' && window.performance?.now ? window.performance.now() : Date.now();
    registerApiMetric(sanitizePath(path), Math.round(finishedAt - startedAt), error.status || 0, false);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequest(path, options = {}) {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const retryAttempts = Number.isFinite(options.retryAttempts) ? options.retryAttempts : DEFAULT_RETRY_ATTEMPTS;
  const requestOptions = { ...options };
  delete requestOptions.timeoutMs;
  delete requestOptions.retryAttempts;

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await performRequest(path, requestOptions, timeoutMs);
    } catch (error) {
      if (!shouldRetry(error, attempt, retryAttempts, requestOptions.method || 'GET')) {
        throw error;
      }

      const backoffMs = calculateBackoffMs(attempt);
      await wait(backoffMs);
    }
  }
}
