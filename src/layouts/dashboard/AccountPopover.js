import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  ListItemText,
} from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import useAuth from '../../auth/useAuth';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/dashboard/app',
  },
  {
    label: 'Profile',
    linkTo: '/dashboard/profile',
  },
  {
    label: 'Settings',
    linkTo: '/dashboard/security',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const { user, sessions, logout, logoutAll, logoutOthers } = useAuth();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login', { replace: true });
  };

  const handleLogoutOthers = () => {
    logoutOthers();
    handleClose();
  };

  const handleLogoutAll = () => {
    logoutAll();
    handleClose();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user?.photoURL || ''} alt={user?.name || 'Usuário'} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name || 'Usuário'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email || '-'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sessões ativas: {sessions.length}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={handleLogoutOthers}>
            <ListItemText
              primary="Encerrar outras sessões"
              secondary="Mantém somente este dispositivo conectado"
            />
          </MenuItem>

          <MenuItem onClick={handleLogoutAll}>
            <ListItemText
              primary="Encerrar todas as sessões"
              secondary="Desconecta todos os dispositivos"
            />
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            Logout seguro
          </MenuItem>
        </Stack>
      </MenuPopover>
    </>
  );
}
