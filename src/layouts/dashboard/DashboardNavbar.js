import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import Mode from './ModeTheme';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)', // Fix on Mobile
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.88)} 0%, ${alpha(theme.palette.primary.lighter, 0.45)} 48%, ${alpha(theme.palette.info.lighter, 0.36)} 100%)`,
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
  boxShadow: `0 10px 28px ${alpha(theme.palette.info.dark, 0.08)}`,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={(theme) => ({
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            px: 1.8,
            py: 0.7,
            borderRadius: 999,
            mr: 1.5,
            color: 'text.secondary',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            background: `linear-gradient(120deg, ${alpha(theme.palette.primary.light, 0.12)}, ${alpha(theme.palette.info.light, 0.12)})`,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          })}
        >
          AgroTech Intelligence
        </Box>

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Mode />
          <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            <NotificationsPopover />
          </Box>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
