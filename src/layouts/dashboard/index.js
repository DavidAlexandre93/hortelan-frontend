import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { findDashboardContext } from '../../routing/routeManifest';
import { OfflineBanner, StatusBadge } from '../../components/states/OperationalState';

const APP_BAR_HEIGHT = 68;

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const context = useMemo(() => findDashboardContext(pathname), [pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'fixed', top: 68, left: { xs: 0, lg: 264 }, right: 0, zIndex: 1190 }}>
        <OfflineBanner />
      </Box>
      <DashboardNavbar onOpenSidebar={() => setSidebarOpen(true)} />
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
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.25}>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
                {context.heading}
              </Typography>
              <StatusBadge label="Dados ilustrativos" severity="neutral" />
            </Stack>
            <Typography color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.65 }}>
              {context.subheading}
            </Typography>
          </Stack>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
