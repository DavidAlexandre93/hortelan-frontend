// scroll bar
import 'simplebar/src/simplebar.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import { tryLoadAndStartRecorder } from '@alwaysmeticulous/recorder-loader';
import { initReliabilityTelemetry } from './services/platformReliability';
import { AuthProvider } from './auth/AuthContext';

// ----------------------------------------------------------------------

const rootElement = document.getElementById('root');

const ERROR_ROUTE_PATH = '/404';

function redirectToErrorPage() {
  if (window.location.pathname === ERROR_ROUTE_PATH) {
    return;
  }

  window.location.replace(ERROR_ROUTE_PATH);
}

window.addEventListener('error', redirectToErrorPage);
window.addEventListener('unhandledrejection', redirectToErrorPage);

async function startApp() {
  if (!isProduction()) {
    await tryLoadAndStartRecorder({
      projectId: '9RzrB10MByJLLtuC4PyNAlrQtV4yPeDdiOG0Wflo',
      isProduction: false,
    });
  }
}

function isProduction() {
  return window.location.hostname.includes('hortelan-frontend.vercel.app');
}

startApp();
initReliabilityTelemetry();

Sentry.init({
  dsn: 'https://f7d0115af398cb54893ae4664e744519@o4506036623114240.ingest.sentry.io/4506036634976256',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const appTree = (
  <HelmetProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appTree);
} else {
  createRoot(rootElement).render(appTree);
}

serviceWorker.unregister();
