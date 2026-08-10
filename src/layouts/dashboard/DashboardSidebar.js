import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Avatar, Box, Divider, Drawer, Link, Stack, Typography } from '@mui/material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import useResponsive from '../../hooks/useResponsive';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import navConfig from './NavConfig';
import useAuth from '../../auth/useAuth';

const DRAWER_WIDTH = 264;

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const isDesktop = useResponsive('up', 'lg');
  const { user } = useAuth();

  const content = (
    <Scrollbar sx={{ height: 1, '& .simplebar-content': { minHeight: 1, display: 'flex', flexDirection: 'column' } }}>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2.5, height: 84 }}>
        <Logo sx={{ width: 48, height: 48 }} />
        <Box>
          <Typography variant="h6" lineHeight={1.1}>
            Hortelan
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Central de operacao
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ px: 1.25, pt: 1.5 }} onClick={onCloseSidebar}>
        <NavSection navConfig={navConfig} />
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 24 }} />
      <Box sx={{ p: 2 }}>
        <Link
          component={RouterLink}
          to="/dashboard/suporte"
          onClick={onCloseSidebar}
          underline="none"
          sx={(theme) => ({
            minHeight: 48,
            px: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            borderRadius: 1.5,
            color: 'text.secondary',
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'text.primary' },
          })}
        >
          <HelpOutlineRoundedIcon fontSize="small" />
          <Typography variant="body2" fontWeight={700}>
            Central de ajuda
          </Typography>
        </Link>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mt: 2, px: 1 }}>
          <Avatar src={user?.photoURL || ''} alt={user?.name || 'Usuario'} sx={{ width: 38, height: 38 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name || 'Usuario Hortelan'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.role || 'Conta ativa'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Scrollbar>
  );

  const paperSx = {
    width: { xs: 'min(88vw, 320px)', sm: DRAWER_WIDTH },
    borderRight: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    backgroundImage: 'none',
  };

  return (
    <Box component="nav" aria-label="Navegacao principal" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
      <Drawer
        open={isOpenSidebar}
        onClose={onCloseSidebar}
        variant={isDesktop ? 'permanent' : 'temporary'}
        PaperProps={{ sx: paperSx }}
      >
        {content}
      </Drawer>
    </Box>
  );
}

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool.isRequired,
  onCloseSidebar: PropTypes.func.isRequired,
};
