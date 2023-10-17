// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { tryLoadAndStartRecorder } from '@alwaysmeticulous/recorder-loader'

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

async function startApp() {
    // Record all sessions on localhost, staging stacks and preview URLs
    if (!isProduction()) {
      // Start the Meticulous recorder before you initialise your app.
      // Note: all errors are caught and logged, so no need to surround with try/catch
      await tryLoadAndStartRecorder({
        projectId: '9RzrB10MByJLLtuC4PyNAlrQtV4yPeDdiOG0Wflo',
        isProduction: false,
      });
    }
}

function isProduction() {
    // TODO: Update me with your production hostname
    return window.location.hostname.indexOf("https://hortelan-frontend.vercel.app/dashboard/app") > -1;
}

startApp();

Sentry.init({
  dsn: "https://f7d0115af398cb54893ae4664e744519@o4506036623114240.ingest.sentry.io/4506036634976256",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
