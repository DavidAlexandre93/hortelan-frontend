import { describe, expect, it, vi } from 'vitest';
import { shouldShowIntro, SPLASH_STORAGE_KEY } from './App';

function buildBrowser({ reducedMotion = false, seen = null, storageError = false } = {}) {
  return {
    matchMedia: vi.fn(() => ({ matches: reducedMotion })),
    sessionStorage: {
      getItem: vi.fn(() => {
        if (storageError) throw new Error('storage blocked');
        return seen;
      }),
    },
  };
}

describe('intro splash policy', () => {
  it('shows only on the first animated client visit', () => {
    const browser = buildBrowser();
    expect(shouldShowIntro(false, browser)).toBe(true);
    expect(browser.sessionStorage.getItem).toHaveBeenCalledWith(SPLASH_STORAGE_KEY);
  });

  it('skips SSR, repeat visits and reduced-motion clients', () => {
    expect(shouldShowIntro(true, buildBrowser())).toBe(false);
    expect(shouldShowIntro(false, buildBrowser({ seen: 'true' }))).toBe(false);
    expect(shouldShowIntro(false, buildBrowser({ reducedMotion: true }))).toBe(false);
  });

  it('fails closed when browser storage is unavailable', () => {
    expect(shouldShowIntro(false, buildBrowser({ storageError: true }))).toBe(false);
  });
});
