import { describe, expect, it } from 'vitest';
import { getSafeAliasDestination } from './routes';

describe('protected legacy aliases', () => {
  it('retains only bounded workflow parameters', () => {
    expect(
      getSafeAliasDestination(
        '/dashboard/hortelan-360',
        '?tab=overview&section=alerts&token=secret&tab%0d%0aevil=value'
      )
    ).toBe('/dashboard/hortelan-360?tab=overview&section=alerts');
  });

  it('drops malformed or unbounded values', () => {
    expect(getSafeAliasDestination('/dashboard/app', '?tab=../../admin&section=' + 'a'.repeat(50))).toBe(
      '/dashboard/app'
    );
  });
});
