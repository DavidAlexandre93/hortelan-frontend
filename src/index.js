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
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

// ----------------------------------------------------------------------

const rootElement = document.getElementById('root');

const ERROR_ROUTE_PATH = '/404';
let hasRedirectedToErrorPage = false;

function redirectToErrorPage() {
  if (window.location.pathname === ERROR_ROUTE_PATH || hasRedirectedToErrorPage) {
    return;
  }

  hasRedirectedToErrorPage = true;
  window.history.replaceState({}, '', ERROR_ROUTE_PATH);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

window.addEventListener('error', () => {
  redirectToErrorPage();
});

window.addEventListener('unhandledrejection', () => {
  redirectToErrorPage();
});

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

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.2),
    replaysSessionSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE || 0.05),
    replaysOnErrorSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE || 1.0),
  });
}

const appTree = (
  <HelmetProvider>
    <AuthProvider>
      <BrowserRouter>
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
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
