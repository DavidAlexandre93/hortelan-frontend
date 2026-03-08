import { useEffect, useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {
  LANGS,
  STORAGE_KEY,
  normalizeLanguageCode,
  applyGoogleLanguage,
  ensureGoogleTranslate,
  ensureTranslateDomSetup,
  getStoredLanguage,
  detectLanguageByGeolocation,
  detectLanguageFromBrowser,
} from '../../services/localization';

const DISPLAY_LANGUAGE_CODE = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  ja: 'ja',
};

export default function LanguagePopover() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [anchorEl, setAnchorEl] = useState(null);

  const languageOptions = useMemo(() => LANGS, []);
  const selectedOption = useMemo(
    () => languageOptions.find((option) => option.value === selectedLanguage) || languageOptions[0],
    [languageOptions, selectedLanguage]
  );

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

  const handleLanguageChange = (language) => {
    const normalizedLanguage = normalizeLanguageCode(language);
    localStorage.setItem(STORAGE_KEY, normalizedLanguage);
    setSelectedLanguage(normalizedLanguage);
    applyGoogleLanguage(normalizedLanguage);
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Stack direction="row" spacing={0.5} alignItems="center">
        {languageOptions.map((option) => (
          <Tooltip key={option.value} title={option.label} arrow>
            <IconButton
              onClick={() => handleLanguageChange(option.value)}
              sx={{
                p: 0.25,
                width: 32,
                height: 32,
                borderRadius: 0.75,
                border: '1px solid',
                borderColor: option.value === selectedLanguage ? 'primary.main' : 'transparent',
                bgcolor: (theme) =>
                  option.value === selectedLanguage
                    ? alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
                    : 'transparent',
              }}
            >
              <Box component="img" src={option.icon} alt={option.label} sx={{ width: 24, height: 16, borderRadius: 0.5 }} />
            </IconButton>
          </Tooltip>
        ))}
      </Stack>

      <Button
        size="small"
        color="inherit"
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
        sx={{
          textTransform: 'none',
          borderRadius: 2,
          borderColor: 'divider',
          minWidth: 120,
          px: 1.25,
          py: 0.5,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box component="img" src={selectedOption.icon} alt={selectedOption.label} sx={{ width: 18, height: 12, borderRadius: 0.4 }} />
          <Box textAlign="left">
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Idioma
            </Typography>
            <Typography variant="body2" lineHeight={1.2}>
              {DISPLAY_LANGUAGE_CODE[selectedOption.value] || selectedOption.value}
            </Typography>
          </Box>
        </Stack>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {languageOptions.map((option) => {
          const isActive = option.value === selectedLanguage;
          return (
            <MenuItem key={option.value} onClick={() => handleLanguageChange(option.value)} selected={isActive} sx={{ minWidth: 220 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Box component="img" src={option.icon} alt={option.label} sx={{ width: 20, height: 14, borderRadius: 0.5 }} />
              </ListItemIcon>
              <ListItemText primary={option.label} secondary={DISPLAY_LANGUAGE_CODE[option.value] || option.value} />
              {isActive ? <CheckRoundedIcon fontSize="small" color="success" /> : null}
            </MenuItem>
          );
        })}
      </Menu>

      <Chip
        size="small"
        color="primary"
        variant="outlined"
        label={`Atual: ${DISPLAY_LANGUAGE_CODE[selectedOption.value] || selectedOption.value}`}
        sx={{ borderRadius: 1.5 }}
      />
    </Stack>
  );
}
