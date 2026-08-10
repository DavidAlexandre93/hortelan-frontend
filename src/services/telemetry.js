import * as Sentry from '@sentry/react';

const ANONYMOUS_CONSENT_KEY = 'hortelan-cookie-consent-anon';

function readAnonymousAnalyticsConsent() {
  if (typeof window === 'undefined') return false;

  try {
    const value = JSON.parse(window.localStorage.getItem(ANONYMOUS_CONSENT_KEY) || 'null');
    return value?.analytics === true || value?.cookies === true;
  } catch {
    return false;
  }
}

function asRate(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback;
}

function traceTargets() {
  const configured = `${import.meta.env.VITE_SENTRY_TRACE_TARGETS || ''}`
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return ['localhost', ...configured];
}

export function initializeTelemetry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return false;

  const hasAnalyticsConsent = readAnonymousAnalyticsConsent();
  const replayIntegrations = hasAnalyticsConsent ? [Sentry.replayIntegration()] : [];

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration({ tracePropagationTargets: traceTargets() }),
      ...replayIntegrations,
    ],
    tracesSampleRate: asRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
    replaysSessionSampleRate: hasAnalyticsConsent
      ? asRate(import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE, 0)
      : 0,
    replaysOnErrorSampleRate: hasAnalyticsConsent ? asRate(import.meta.env.VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE, 0) : 0,
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.data;
      }
      return event;
    },
  });

  return true;
}

export async function initializeDevelopmentRecorder() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_METICULOUS !== 'true') return false;

  const { tryLoadAndStartRecorder } = await import('@alwaysmeticulous/recorder-loader');
  await tryLoadAndStartRecorder({
    projectId: '9RzrB10MByJLLtuC4PyNAlrQtV4yPeDdiOG0Wflo',
    isProduction: false,
  });
  return true;
}
