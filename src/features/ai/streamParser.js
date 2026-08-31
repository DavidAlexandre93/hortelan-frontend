import { aiStreamEventSchema } from './contracts';
import { AI_ERROR_KINDS, AiError } from './errors';

export const DEFAULT_MAX_STREAM_BUFFER_BYTES = 256 * 1024;

function parseSseBlock(block) {
  let eventName = '';
  const data = [];

  block.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith(':')) return;
    const separator = line.indexOf(':');
    const field = separator === -1 ? line : line.slice(0, separator);
    const value = separator === -1 ? '' : line.slice(separator + 1).replace(/^ /, '');
    if (field === 'event') eventName = value;
    if (field === 'data') data.push(value);
  });

  if (!data.length) return null;

  let payload;
  try {
    payload = JSON.parse(data.join('\n'));
  } catch (cause) {
    throw new AiError(AI_ERROR_KINDS.CONTRACT, { cause });
  }

  if (eventName && !payload.kind) payload.kind = eventName;
  const parsed = aiStreamEventSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AiError(AI_ERROR_KINDS.CONTRACT, { cause: parsed.error });
  }
  return parsed.data;
}

function assertSequence(event, state) {
  if (state.operationId && state.operationId !== event.operationId) {
    throw new AiError(AI_ERROR_KINDS.CONTRACT);
  }
  if (event.sequence <= state.sequence) {
    throw new AiError(AI_ERROR_KINDS.CONTRACT);
  }
  state.operationId = event.operationId;
  state.sequence = event.sequence;
}

export async function parseEventStream(stream, options = {}) {
  if (!stream?.getReader) throw new AiError(AI_ERROR_KINDS.CONTRACT);

  const { signal, onEvent = () => {}, maxBufferBytes = DEFAULT_MAX_STREAM_BUFFER_BYTES } = options;
  const reader = stream.getReader();
  const decoder = new globalThis.TextDecoder();
  const sequenceState = { operationId: '', sequence: -1 };
  const events = [];
  let buffer = '';
  let bytesRead = 0;

  try {
    for (;;) {
      if (signal?.aborted) throw new AiError(AI_ERROR_KINDS.CANCELLED);
      const { value, done } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBufferBytes) throw new AiError(AI_ERROR_KINDS.CONTRACT);
      buffer += decoder.decode(value, { stream: true });

      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() || '';
      for (const block of blocks) {
        const event = parseSseBlock(block);
        if (!event) continue;
        assertSequence(event, sequenceState);
        events.push(event);
        await onEvent(event);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      const event = parseSseBlock(buffer);
      if (event) {
        assertSequence(event, sequenceState);
        events.push(event);
        await onEvent(event);
      }
    }
    return events;
  } catch (error) {
    if (signal?.aborted && !(error instanceof AiError)) {
      throw new AiError(AI_ERROR_KINDS.CANCELLED, { cause: error });
    }
    throw error;
  } finally {
    reader.releaseLock();
  }
}
