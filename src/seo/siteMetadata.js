const DEFAULT_SITE_URL = 'https://hortelan-frontend.vercel.app';
const DEFAULT_DESCRIPTION =
  'Hortelan: plataforma para monitoramento operacional, catálogo de espécies, integrações e inteligência para operações agrícolas em escala.';
const DEFAULT_OG_IMAGE = '/static/preview.jpg';

export const siteMetadata = {
  siteName: 'Hortelan',
  defaultTitle: 'Hortelan',
  description: DEFAULT_DESCRIPTION,
  siteUrl: (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
  ogImage: import.meta.env.VITE_OG_IMAGE || DEFAULT_OG_IMAGE,
  socialProfiles: ['https://www.linkedin.com'],
};

export function toAbsoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteMetadata.siteUrl}${normalizedPath}`;
}
