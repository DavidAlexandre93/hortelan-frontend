// routes
import Router from './routes';
import { Analytics } from '@vercel/analytics/react';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { AuthProvider } from './auth/AuthContext';


// ----------------------------------------------------------------------

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <BaseOptionChartStyle />
          <Router />
          <Analytics />
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
