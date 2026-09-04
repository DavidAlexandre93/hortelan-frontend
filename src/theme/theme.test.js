import { describe, expect, it } from 'vitest';
import getPalette from './palette';
import typography from './typography';

describe('Hortelan visual foundation', () => {
  it('exposes semantic light and dark roles without gradients', () => {
    const light = getPalette('light');
    const dark = getPalette('dark');

    expect(light.surface.canvas).not.toBe(dark.surface.canvas);
    expect(light.action.primary).toBe(light.primary.main);
    expect(light.chartTokens.series).toBe(light.chart);
    expect(light.gradients).toBeUndefined();
    expect(dark.chartTokens.grid).not.toBe(light.chartTokens.grid);
  });

  it('keeps typography fixed, readable, and untracked', () => {
    expect(typography.body1.letterSpacing).toBe(0);
    expect(typography.button.letterSpacing).toBe(0);
    expect(typography.h1.fontSize).toBe('3rem');
  });
});