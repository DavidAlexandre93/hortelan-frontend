import { describe, expect, it } from 'vitest';
import { fDate, fDateTime } from './formatTime';

describe('formatters', () => {
  it('formata datas validas', () => {
    expect(fDate('2026-08-10T12:00:00Z')).toContain('2026');
    expect(fDateTime('2026-08-10T12:00:00Z')).toContain('2026');
  });
});
