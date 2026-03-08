// scroll bar
import 'simplebar/dist/simplebar.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { Analytics } from '@vercel/analytics/react';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import { initReliabilityTelemetry } from './services/platformReliability';
import { AuthProvider } from './auth/AuthContext';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import ThemeProvider from './theme';
import AutoTranslateBootstrap from './components/localization/AutoTranslateBootstrap';

// ----------------------------------------------------------------------

const rootElement = document.getElementById('root');

const ERROR_ROUTE_PATH = '/404';
let hasRedirectedToErrorPage = false;

const NON_FATAL_ERROR_PATTERNS = [
  'aborterror',
  'the operation was aborted',
  'resizeobserver loop limit exceeded',
  'non-error promise rejection captured',
];

function shouldRedirectToErrorRoute(errorLike) {
  if (!errorLike) return false;

  const normalizedMessage = `${errorLike?.name || ''} ${errorLike?.message || errorLike}`.toLowerCase().trim();
  if (!normalizedMessage) return false;

  return !NON_FATAL_ERROR_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
}

function redirectToErrorPage() {
  if (window.location.pathname === ERROR_ROUTE_PATH || hasRedirectedToErrorPage) {
    return;
  }

  hasRedirectedToErrorPage = true;
  window.history.replaceState({}, '', ERROR_ROUTE_PATH);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

window.addEventListener('error', (event) => {
  if (shouldRedirectToErrorRoute(event.error || event.message)) {
    redirectToErrorPage();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (shouldRedirectToErrorRoute(event.reason)) {
    redirectToErrorPage();
  }
});

async function startApp() {
  if (import.meta.env.DEV && !isProduction()) {
    const { tryLoadAndStartRecorder } = await import('@alwaysmeticulous/recorder-loader');

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
      Sentry.browserTracingIntegration({
        tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
      }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.2),
    replaysSessionSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE || 0.05),
    replaysOnErrorSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE || 1.0),
  });
}

const appTree = (
  <HelmetProvider>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AutoTranslateBootstrap />
          <GlobalErrorBoundary>
            <App />
          </GlobalErrorBoundary>
          <Analytics />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appTree);
} else {
  createRoot(rootElement).render(appTree);
}

serviceWorker.unregister();
