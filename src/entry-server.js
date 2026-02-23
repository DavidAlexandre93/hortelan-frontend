import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const SSR_ROUTES = ['/login', '/register', '/forgot-password'];

export function shouldUseSsr(url) {
  const path = url.split('?')[0];
  return SSR_ROUTES.includes(path);
}

export function render(url) {
  const helmetContext = {};
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  return {
    appHtml,
    headTags: helmetContext.helmet ? `${helmetContext.helmet.title.toString()}${helmetContext.helmet.meta.toString()}` : '',
  };
}
