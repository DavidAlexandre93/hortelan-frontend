import { describe, expect, it } from 'vitest';
import { normalizeAnimationEasing } from './useGSAP';

describe('normalizeAnimationEasing', () => {
  it('traduz easings do GSAP para valores validos da Web Animations API', () => {
    expect(normalizeAnimationEasing('sine.inOut')).toMatch(/^cubic-bezier/);
    expect(normalizeAnimationEasing('power3.out')).toMatch(/^cubic-bezier/);
  });

  it('preserva CSS valido e usa fallback para entradas desconhecidas', () => {
    expect(normalizeAnimationEasing('linear')).toBe('linear');
    expect(normalizeAnimationEasing('spring.out')).toBe('ease-out');
    expect(normalizeAnimationEasing()).toBe('ease-out');
  });
});
