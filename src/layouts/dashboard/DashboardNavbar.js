import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { AppBar, Box, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import ModeTheme from './ModeTheme';

const DRAWER_WIDTH = 248;
const APP_BAR_HEIGHT = 64;

const Root = styled(AppBar)(({ theme }) => ({
  height: APP_BAR_HEIGHT,
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.background.paper, 0.94),
  backgroundImage: 'none',
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: { width: `calc(100% - ${DRAWER_WIDTH}px)` },
}));

export default function DashboardNavbar({ onOpenAssistant, onOpenSidebar }) {
  return (
    <Root>
      <Toolbar sx={{ minHeight: `${APP_BAR_HEIGHT}px !important`, px: { xs: 1.25, sm: 2.5, lg: 4 } }}>
        <Tooltip title="Abrir navegacao">
          <IconButton onClick={onOpenSidebar} aria-label="Abrir navegacao" sx={{ mr: 0.5, display: { lg: 'none' } }}>
            <MenuRoundedIcon />
          </IconButton>
        </Tooltip>
        <Searchbar onOpenAssistant={onOpenAssistant} />
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.25, sm: 0.75 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1.25 }}
          >
            <WifiRoundedIcon color="success" sx={{ fontSize: 18 }} />
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Operacao online
            </Typography>
          </Stack>
          <Tooltip title="Abrir inteligencia Hortelan">
            <IconButton onClick={() => onOpenAssistant('')} aria-label="Abrir inteligencia Hortelan" color="primary">
              <AutoAwesomeRoundedIcon />
            </IconButton>
          </Tooltip>
          <ModeTheme />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <NotificationsPopover />
          </Box>
          <AccountPopover />
        </Stack>
      </Toolbar>
    </Root>
  );
}

DashboardNavbar.propTypes = {
  onOpenAssistant: PropTypes.func.isRequired,
  onOpenSidebar: PropTypes.func.isRequired,
};
