import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import PageContext from '../../components/layout/PageContext';
import { findDashboardContext } from '../../routing/routeManifest';
import { OfflineBanner } from '../../components/states/OperationalState';

const APP_BAR_HEIGHT = 64;
const AssistantExperience = lazy(() => import('../../features/ai/components/AssistantExperience'));

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const { pathname } = useLocation();
  const context = useMemo(() => findDashboardContext(pathname), [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      import('../../features/ai/service').then(({ getAiCapabilities }) => getAiCapabilities()).catch(() => {});
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'fixed', top: APP_BAR_HEIGHT, left: { xs: 0, lg: 248 }, right: 0, zIndex: 1190 }}>
        <OfflineBanner />
      </Box>
      <DashboardNavbar
        onOpenAssistant={(prompt = '') => {
          setAssistantPrompt(prompt);
          setAssistantOpen(true);
        }}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
      <DashboardSidebar isOpenSidebar={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)} />

      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: 0,
          pt: `${APP_BAR_HEIGHT}px`,
          pb: { xs: 5, md: 7 },
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box sx={{ width: 1, maxWidth: 1480, mx: 'auto' }}>
          <PageContext
            badge={context.badge}
            heading={context.heading}
            subheading={context.subheading}
            hasAiContext={Boolean(context.aiContext)}
            onOpenAssistant={(prompt = '') => {
              setAssistantPrompt(prompt);
              setAssistantOpen(true);
            }}
          />
          <Outlet />
        </Box>
      </Box>
      {assistantOpen ? (
        <Suspense
          fallback={
            <Box
              role="status"
              aria-label="Abrindo inteligencia Hortelan"
              sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1400 }}
            >
              <CircularProgress size={28} />
            </Box>
          }
        >
          <AssistantExperience
            open={assistantOpen}
            initialPrompt={assistantPrompt}
            onClose={() => {
              setAssistantOpen(false);
              setAssistantPrompt('');
            }}
            pathname={pathname}
          />
        </Suspense>
      ) : null}
    </Box>
  );
}
