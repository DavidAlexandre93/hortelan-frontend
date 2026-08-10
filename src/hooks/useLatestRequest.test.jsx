import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useLatestRequest from './useLatestRequest';

describe('useLatestRequest', () => {
  it('impede resposta antiga de substituir a leitura mais recente', async () => {
    const pending = [];
    const { result } = renderHook(() => useLatestRequest());

    let first;
    let second;
    await act(async () => {
      first = result.current(() => new Promise((resolve) => pending.push(() => resolve('antigo'))));
      second = result.current(() => Promise.resolve('novo'));
      await second;
    });

    pending[0]();
    await expect(second).resolves.toEqual({ current: true, data: 'novo' });
    await expect(first).resolves.toEqual({ current: false, data: undefined });
  });
});
