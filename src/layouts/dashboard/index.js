import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { findDashboardContext } from '../../routing/routeManifest';
import { OfflineBanner, StatusBadge } from '../../components/states/OperationalState';

const APP_BAR_HEIGHT = 68;
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
      <Box sx={{ position: 'fixed', top: 68, left: { xs: 0, lg: 264 }, right: 0, zIndex: 1190 }}>
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
          <Stack
            spacing={0.75}
            sx={{
              pt: { xs: 3, md: 4 },
              pb: { xs: 2.5, md: 3 },
              mb: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 800 }}>
              {context.badge}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={1.25}
            >
              <Stack direction="row" alignItems="center" gap={1.25} sx={{ minWidth: 0, flex: 1, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
                  {context.heading}
                </Typography>
                <StatusBadge label="Dados ilustrativos" severity="neutral" />
              </Stack>
              {context.aiContext ? (
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesomeRoundedIcon />}
                  onClick={() => setAssistantOpen(true)}
                  sx={{ flexShrink: 0 }}
                >
                  Perguntar a IA
                </Button>
              ) : null}
            </Stack>
            <Typography color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.65 }}>
              {context.subheading}
            </Typography>
          </Stack>
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
