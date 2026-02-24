// routes
import { Analytics } from '@vercel/analytics/react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { AuthProvider } from './auth/AuthContext';
import useAuth from './auth/useAuth';
import CookieConsentBanner from './components/privacy/CookieConsentBanner';

function AppContent() {
  const { consents } = useAuth();

  return (
    <>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
      <CookieConsentBanner />
      {consents?.analytics && <Analytics />}
    </>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
