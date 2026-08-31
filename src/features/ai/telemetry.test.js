import { describe, expect, it } from 'vitest';
import { sanitizeAiTelemetry } from './telemetry';

describe('sanitizeAiTelemetry', () => {
  it('mantem somente atributos de baixa cardinalidade permitidos', () => {
    expect(
      sanitizeAiTelemetry({
        operation: 'conversation.message',
        status: 'completed',
        sourceCount: 3,
        prompt: 'conteudo privado',
        email: 'pessoa@example.com',
      })
    ).toEqual({ operation: 'conversation.message', status: 'completed', sourceCount: 3 });
  });

  it('remove valores com formato sensivel mesmo em chave permitida', () => {
    expect(sanitizeAiTelemetry({ route: 'user@example.com', status: 'apiKey=abc' })).toEqual({});
  });
});
