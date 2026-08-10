// @vitest-environment node
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { apiUrl, server } from '../test/server';
import { apiRequest, API_ERROR_KINDS } from './apiClient';

describe('apiClient', () => {
  it('valida o contrato de uma resposta bem-sucedida', async () => {
    server.use(http.get(apiUrl('/contract'), () => HttpResponse.json({ id: 42 })));
    const result = await apiRequest('/contract', { schema: z.object({ id: z.number() }) });
    expect(result).toEqual({ id: 42 });
  });

  it('classifica payload malformado como erro de contrato', async () => {
    server.use(
      http.get(
        apiUrl('/malformed'),
        () => new HttpResponse('not-json', { headers: { 'Content-Type': 'application/json' } })
      )
    );
    await expect(apiRequest('/malformed', { retryAttempts: 0 })).rejects.toMatchObject({
      kind: API_ERROR_KINDS.CONTRACT,
    });
  });

  it('distingue timeout de cancelamento', async () => {
    server.use(
      http.get(apiUrl('/slow'), async () => {
        await delay(100);
        return HttpResponse.json({ ok: true });
      })
    );
    await expect(apiRequest('/slow', { timeoutMs: 5, retryAttempts: 0 })).rejects.toMatchObject({
      kind: API_ERROR_KINDS.TIMEOUT,
    });

    const controller = new AbortController();
    const request = apiRequest('/slow', { signal: controller.signal, retryAttempts: 0 });
    controller.abort();
    await expect(request).rejects.toMatchObject({ kind: API_ERROR_KINDS.CANCELLATION });
  });

  it('repete uma leitura transitoria dentro do limite', async () => {
    let calls = 0;
    server.use(
      http.get(apiUrl('/retry'), () => {
        calls += 1;
        return calls === 1 ? HttpResponse.json({}, { status: 503 }) : HttpResponse.json({ ok: true });
      })
    );
    await expect(apiRequest('/retry', { retryAttempts: 1 })).resolves.toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('nunca repete uma mutacao nao idempotente', async () => {
    const handler = vi.fn(() => HttpResponse.json({}, { status: 503 }));
    server.use(http.post(apiUrl('/mutation'), handler));
    await expect(apiRequest('/mutation', { method: 'POST', retryAttempts: 3 })).rejects.toMatchObject({ status: 503 });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
