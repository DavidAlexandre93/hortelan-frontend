import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { findRouteMetadata } from './routeManifest';
import { siteMetadata, toAbsoluteUrl } from '../seo/siteMetadata';

export function getRouteMetadata(pathname) {
  const route = findRouteMetadata(pathname);
  const canonicalPath = route?.canonicalPath || route?.path || pathname;

  return {
    title: route?.title ? `${route.title} | ${siteMetadata.siteName}` : siteMetadata.defaultTitle,
    description: route?.description || siteMetadata.description,
    canonicalUrl: toAbsoluteUrl(canonicalPath),
    previewImage: toAbsoluteUrl(siteMetadata.ogImage),
  };
}

export default function RouteMetadata() {
  const { pathname } = useLocation();
  const { title, description, canonicalUrl, previewImage } = getRouteMetadata(pathname);

  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteMetadata.siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={previewImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={previewImage} />
    </Helmet>
  );
}
