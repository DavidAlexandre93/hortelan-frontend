import { describe, expect, it, vi } from 'vitest';
import { AI_ERROR_KINDS } from './errors';
import { parseEventStream } from './streamParser';

function streamFrom(chunks) {
  const encoder = new globalThis.TextEncoder();
  return new globalThis.ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
}

const ack = 'event: ack\ndata: {"operationId":"operation-123","sequence":0,"messageId":"message-1"}\n\n';
const delta =
  'event: text_delta\ndata: {"operationId":"operation-123","sequence":1,"delta":"Resposta"}\n\n';
const completed =
  'event: completed\ndata: {"operationId":"operation-123","sequence":2,"messageId":"message-1","completedAt":"2026-08-31T12:00:00.000Z"}\n\n';

describe('parseEventStream', () => {
  it('reconstroi eventos separados entre chunks', async () => {
    const onEvent = vi.fn();
    const events = await parseEventStream(streamFrom([ack.slice(0, 22), ack.slice(22) + delta, completed]), { onEvent });
    expect(events.map((event) => event.kind)).toEqual(['ack', 'text_delta', 'completed']);
    expect(onEvent).toHaveBeenCalledTimes(3);
  });

  it('rejeita sequencia duplicada', async () => {
    const duplicate = delta.replace('"sequence":1', '"sequence":0');
    await expect(parseEventStream(streamFrom([ack, duplicate]))).rejects.toMatchObject({
      kind: AI_ERROR_KINDS.CONTRACT,
    });
  });

  it('rejeita JSON malformado', async () => {
    await expect(parseEventStream(streamFrom(['event: ack\ndata: {invalid}\n\n']))).rejects.toMatchObject({
      kind: AI_ERROR_KINDS.CONTRACT,
    });
  });

  it('limita o total consumido', async () => {
    await expect(parseEventStream(streamFrom([ack]), { maxBufferBytes: 20 })).rejects.toMatchObject({
      kind: AI_ERROR_KINDS.CONTRACT,
    });
  });

  it('respeita cancelamento antes de consumir', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(parseEventStream(streamFrom([ack]), { signal: controller.signal })).rejects.toMatchObject({
      kind: AI_ERROR_KINDS.CANCELLED,
    });
  });
});
