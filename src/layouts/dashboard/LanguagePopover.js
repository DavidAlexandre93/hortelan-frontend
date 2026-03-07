import { useEffect, useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Stack, IconButton, Tooltip } from '@mui/material';
import {
  LANGS,
  STORAGE_KEY,
  applyGoogleLanguage,
  ensureGoogleTranslate,
  ensureTranslateDomSetup,
  getStoredLanguage,
  detectLanguageByGeolocation,
  detectLanguageFromBrowser,
} from '../../services/localization';

export default function LanguagePopover() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  const languageOptions = useMemo(() => LANGS, []);

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
        setSelectedLanguage(detectedLanguage);
        applyGoogleLanguage(detectedLanguage);
      } catch (error) {
        const fallbackLanguage = detectLanguageFromBrowser();
        setSelectedLanguage(fallbackLanguage);
        applyGoogleLanguage(fallbackLanguage);
      }
    };

    autoDetectLanguage();
  }, []);

  const handleLanguageChange = (language) => {
    localStorage.setItem(STORAGE_KEY, language);
    setSelectedLanguage(language);
    applyGoogleLanguage(language);
  };

  return (
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
  );
}
