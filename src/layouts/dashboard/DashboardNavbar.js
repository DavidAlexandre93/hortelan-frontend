import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import Mode from './ModeTheme';
import {
  STORAGE_KEY,
  normalizeLanguageCode,
  applyGoogleLanguage,
  ensureGoogleTranslate,
  ensureTranslateDomSetup,
  getStoredLanguage,
  detectLanguageByGeolocation,
  detectLanguageFromBrowser,
} from '../../services/localization';

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
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const languageFlags = [
  { code: 'en', label: 'English (US)', icon: 'circle-flags:us' },
  { code: 'pt', label: 'Português (Brasil)', icon: 'circle-flags:br' },
  { code: 'fr', label: 'Français', icon: 'circle-flags:fr' },
  { code: 'es', label: 'Español', icon: 'circle-flags:es' },
];

function LanguageFlags() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  useEffect(() => {
    ensureGoogleTranslate();
    ensureTranslateDomSetup();

    const manualLanguage = getStoredLanguage();
    if (manualLanguage) {
      setSelectedLanguage(manualLanguage);
      applyGoogleLanguage(manualLanguage);
      return;
    }

    const autoDetectLanguage = async () => {
      try {
        const detectedLanguage = await detectLanguageByGeolocation();
        const normalizedLanguage = normalizeLanguageCode(detectedLanguage);
        setSelectedLanguage(normalizedLanguage);
        applyGoogleLanguage(normalizedLanguage);
      } catch (error) {
        const fallbackLanguage = normalizeLanguageCode(detectLanguageFromBrowser());
        setSelectedLanguage(fallbackLanguage);
        applyGoogleLanguage(fallbackLanguage);
      }
    };

    autoDetectLanguage();
  }, []);

  const availableFlags = useMemo(() => languageFlags, []);

  const handleLanguageChange = (languageCode) => {
    const normalizedLanguage = normalizeLanguageCode(languageCode);
    window.localStorage.setItem(STORAGE_KEY, normalizedLanguage);
    setSelectedLanguage(normalizedLanguage);
    applyGoogleLanguage(normalizedLanguage);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mr: { xs: 0.5, sm: 0 } }}>
      {availableFlags.map((flag) => {
        const isSelected = selectedLanguage === flag.code;

        return (
          <Tooltip key={flag.code} title={flag.label} arrow>
            <IconButton
              size="small"
              onClick={() => handleLanguageChange(flag.code)}
              sx={{
                p: 0,
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                transition: (theme) => theme.transitions.create(['transform', 'border-color']),
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Iconify icon={flag.icon} width={22} height={22} />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

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

        <Box sx={{ minWidth: 0, flexShrink: 1 }}>
          <Searchbar />
        </Box>
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

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.25, sm: 1.5 }} sx={{ flexShrink: 0 }}>
          <Mode />
          <LanguageFlags />
          <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            <NotificationsPopover />
          </Box>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
