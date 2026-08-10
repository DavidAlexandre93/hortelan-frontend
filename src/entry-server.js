import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import AppProviders from './app/AppProviders';
import { ssrRoutePaths } from './routing/routeManifest';
import { getRouteMetadata } from './routing/RouteMetadata';
import { siteMetadata } from './seo/siteMetadata';

export function shouldUseSsr(url) {
  const path = url.split('?')[0].replace(/\/$/, '') || '/';
  return ssrRoutePaths.has(path);
}

export function render(url) {
  const helmetContext = {};
  const appHtml = renderToString(
    <AppProviders helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <App ssr />
      </StaticRouter>
    </AppProviders>
  );

  const pathname = new URL(url, 'https://hortelan.local').pathname;
  const { title, description, canonicalUrl, previewImage } = getRouteMetadata(pathname);
  const headTags = renderToStaticMarkup(
    <>
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
    </>
  );

  return {
    appHtml,
    headTags,
  };
}
