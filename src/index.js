// scroll bar
import 'simplebar/dist/simplebar.css';
import '@fontsource-variable/manrope/wght.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

//
import App from './App';
import { initReliabilityTelemetry } from './services/platformReliability';
import { initializeDevelopmentRecorder, initializeTelemetry } from './services/telemetry';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import AppProviders from './app/AppProviders';

// ----------------------------------------------------------------------

const rootElement = document.getElementById('root');

initializeDevelopmentRecorder().catch(() => {});
initReliabilityTelemetry();
initializeTelemetry();

const appTree = (
  <AppProviders>
    <BrowserRouter>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
      {import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && <Analytics />}
    </BrowserRouter>
  </AppProviders>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appTree);
} else {
  createRoot(rootElement).render(appTree);
}
