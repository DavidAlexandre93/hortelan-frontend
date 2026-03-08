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
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
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

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
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
