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
import HortelanPlayfulEffects from './components/fx/HortelanPlayfulEffects';
import HarvestSplashScreen from './components/fx/HarvestSplashScreen';
import { useState } from 'react';

function AppContent() {
  const { consents } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <HortelanPlayfulEffects />
      <Router />
      <CookieConsentBanner />
      {consents?.analytics && <Analytics />}
      {!splashFinished && <HarvestSplashScreen onComplete={() => setSplashFinished(true)} />}
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
