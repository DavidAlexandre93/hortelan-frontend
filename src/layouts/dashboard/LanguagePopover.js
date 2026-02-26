import { useEffect, useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Stack, IconButton, Tooltip } from '@mui/material';

const STORAGE_KEY = 'preferredLanguage';
const GOOGLE_COOKIE_KEY = 'googtrans';

const LANGS = [
  { value: 'en', label: 'English', icon: '/static/icons/eua.svg', countries: ['US'] },
  { value: 'pt', label: 'Português (Brasil)', icon: '/static/icons/brasil.svg', countries: ['BR'] },
  { value: 'es', label: 'Español', icon: '/static/icons/espanha.svg', countries: ['ES'] },
  { value: 'fr', label: 'Français', icon: '/static/icons/franca.svg', countries: ['FR'] },
  { value: 'ja', label: '日本語', icon: '/static/icons/japao.svg', countries: ['JP'] },
];

const COUNTRY_LANGUAGE_MAP = {
  BR: 'pt',
  PT: 'pt',
  FR: 'fr',
  BE: 'fr',
  CA: 'en',
  US: 'en',
  GB: 'en',
  AU: 'en',
  NZ: 'en',
  IE: 'en',
  JP: 'ja',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CL: 'es',
  CO: 'es',
  PE: 'es',
  UY: 'es',
  PY: 'es',
  BO: 'es',
  VE: 'es',
  EC: 'es',
  CR: 'es',
  PA: 'es',
  GT: 'es',
  HN: 'es',
  SV: 'es',
  NI: 'es',
  DO: 'es',
  DE: 'de',
  AT: 'de',
  CH: 'de',
  IT: 'it',
  NL: 'nl',
  PL: 'pl',
  SE: 'sv',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
  CZ: 'cs',
  GR: 'el',
  TR: 'tr',
  RO: 'ro',
  HU: 'hu',
  RU: 'ru',
  UA: 'uk',
  IL: 'iw',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  MA: 'ar',
  DZ: 'ar',
  IN: 'hi',
  TH: 'th',
  VN: 'vi',
  ID: 'id',
  KR: 'ko',
  CN: 'zh-CN',
  TW: 'zh-TW',
};

const GOOGLE_TRANSLATE_LANGUAGES = [
  ...new Set([...LANGS.map((lang) => lang.value), ...Object.values(COUNTRY_LANGUAGE_MAP)]),
].join(',');

const mapCountryToLanguage = (countryCode) => {
  if (!countryCode) return 'pt';
  const upperCountryCode = countryCode.toUpperCase();
  const mappedLanguage = COUNTRY_LANGUAGE_MAP[upperCountryCode];
  if (mappedLanguage) return mappedLanguage;
  const language = LANGS.find((lang) => lang.countries.includes(upperCountryCode));
  return language?.value || 'pt';
};

const applyGoogleLanguage = (language) => {
  if (!language) return;

  const cookieValue = `/pt/${language}`;
  document.cookie = `${GOOGLE_COOKIE_KEY}=${cookieValue};path=/`;
  document.cookie = `${GOOGLE_COOKIE_KEY}=${cookieValue};path=/;domain=.${window.location.hostname}`;

  const select = document.querySelector('select.goog-te-combo');
  if (select && select.value !== language) {
    select.value = language;
    select.dispatchEvent(new Event('change'));
  }
};

const ensureGoogleTranslate = () => {
  if (window.google?.translate?.TranslateElement) return;

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          autoDisplay: false,
          includedLanguages: GOOGLE_TRANSLATE_LANGUAGES,
        },
        'google_translate_element'
      );
    };
  }
};

export default function LanguagePopover() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  const languageOptions = useMemo(() => LANGS, []);

  useEffect(() => {
    ensureGoogleTranslate();

    if (!document.getElementById('google_translate_element')) {
      const translateContainer = document.createElement('div');
      translateContainer.id = 'google_translate_element';
      translateContainer.style.display = 'none';
      document.body.appendChild(translateContainer);
    }

    const styleId = 'google-translate-hide-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = '.goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; } body { top: 0 !important; }';
      document.head.appendChild(style);
    }

    const manualLanguage = localStorage.getItem(STORAGE_KEY);
    if (manualLanguage) {
      setSelectedLanguage(manualLanguage);
      applyGoogleLanguage(manualLanguage);
      return;
    }

    const autoDetectLanguage = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detectedLanguage = mapCountryToLanguage(data?.country_code) || 'pt';
        setSelectedLanguage(detectedLanguage);
        applyGoogleLanguage(detectedLanguage);
      } catch (error) {
        const browserLanguage = (navigator.language || 'pt').slice(0, 2);
        const fallbackLanguage = LANGS.some((lang) => lang.value === browserLanguage) ? browserLanguage : 'pt';
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
