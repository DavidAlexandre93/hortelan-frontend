// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

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
