import { describe, expect, it } from 'vitest';
import { getRouteMetadata } from './RouteMetadata';

describe('route metadata', () => {
  it('uses the most specific dashboard route and an absolute canonical URL', () => {
    expect(getRouteMetadata('/dashboard/integracoes/ops')).toMatchObject({
      title: 'Operacoes de integracao | Hortelan',
      canonicalUrl: 'https://hortelan-frontend.vercel.app/dashboard/integracoes/ops',
    });
  });

  it('falls back safely for an unknown path', () => {
    const metadata = getRouteMetadata('/unknown');
    expect(metadata.title).toBe('Hortelan');
    expect(metadata.canonicalUrl).toBe('https://hortelan-frontend.vercel.app/unknown');
    expect(metadata.description).toBeTruthy();
    expect(metadata.previewImage).toMatch(/^https:\/\//);
  });
});
