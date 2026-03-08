const STORAGE_KEY = 'preferredLanguage';
const GOOGLE_COOKIE_KEY = 'googtrans';
const SOURCE_LANGUAGE = 'pt';

let pendingLanguage = null;
let languageSyncAttempts = 0;
let languageSyncTimer = null;
const MAX_LANGUAGE_SYNC_ATTEMPTS = 20;
const LANGUAGE_SYNC_INTERVAL_MS = 300;

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
  if (!language || typeof document === 'undefined') return;

  if (pendingLanguage !== language) {
    languageSyncAttempts = 0;
  }

  pendingLanguage = language;

  const cookieValue = `/${SOURCE_LANGUAGE}/${language}`;
  document.cookie = `${GOOGLE_COOKIE_KEY}=${cookieValue};path=/`;

  if (typeof window !== 'undefined' && window.location?.hostname) {
    document.cookie = `${GOOGLE_COOKIE_KEY}=${cookieValue};path=/;domain=.${window.location.hostname}`;
  }

  const select = document.querySelector('select.goog-te-combo');
  if (select && select.value !== language) {
    select.value = language;
    select.dispatchEvent(new Event('change'));
    pendingLanguage = null;
    languageSyncAttempts = 0;

    if (languageSyncTimer) {
      window.clearTimeout(languageSyncTimer);
      languageSyncTimer = null;
    }
  } else if (select && select.value === language) {
    pendingLanguage = null;
    languageSyncAttempts = 0;
  }

  if (pendingLanguage) {
    scheduleLanguageSync();
  }

  document.documentElement.setAttribute('lang', language);
};

const scheduleLanguageSync = () => {
  if (typeof window === 'undefined' || !pendingLanguage) return;
  if (languageSyncTimer) return;

  const runSync = () => {
    languageSyncTimer = null;
    if (!pendingLanguage) return;
    if (languageSyncAttempts >= MAX_LANGUAGE_SYNC_ATTEMPTS) return;

    languageSyncAttempts += 1;
    applyGoogleLanguage(pendingLanguage);

    if (pendingLanguage) {
      languageSyncTimer = window.setTimeout(runSync, LANGUAGE_SYNC_INTERVAL_MS);
    }
  };

  languageSyncTimer = window.setTimeout(runSync, LANGUAGE_SYNC_INTERVAL_MS);
};

const ensureGoogleTranslate = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

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
          pageLanguage: SOURCE_LANGUAGE,
          autoDisplay: false,
          includedLanguages: GOOGLE_TRANSLATE_LANGUAGES,
        },
        'google_translate_element'
      );

      scheduleLanguageSync();
    };
  }

  scheduleLanguageSync();
};

const ensureTranslateDomSetup = () => {
  if (typeof document === 'undefined') return;

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
};

const getStoredLanguage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

const detectLanguageFromBrowser = () => {
  if (typeof navigator === 'undefined') return 'pt';
  const browserLanguage = (navigator.language || 'pt').slice(0, 2);
  return LANGS.some((lang) => lang.value === browserLanguage) ? browserLanguage : 'pt';
};

const detectCountryFromBrowserLocale = () => {
  if (typeof navigator === 'undefined') return null;

  const localeSources = [navigator.language, ...(navigator.languages || [])].filter(Boolean);

  for (const locale of localeSources) {
    const localeMatch = locale.match(/[-_]([A-Za-z]{2})$/);
    if (localeMatch) {
      return localeMatch[1].toUpperCase();
    }
  }

  return null;
};

const fetchCountryCode = async (url, resolver) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const data = await response.json();
    return resolver(data);
  } catch (error) {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const detectLanguageByGeolocation = async () => {
  const countryFromLocale = detectCountryFromBrowserLocale();
  if (countryFromLocale) {
    return mapCountryToLanguage(countryFromLocale);
  }

  if (typeof window === 'undefined') {
    return detectLanguageFromBrowser();
  }

  const countryCode =
    (await fetchCountryCode('https://ipapi.co/json/', (data) => data?.country_code)) ||
    (await fetchCountryCode('https://ipwho.is/', (data) => (data?.success ? data.country_code : null)));

  if (countryCode) {
    return mapCountryToLanguage(countryCode);
  }

  return detectLanguageFromBrowser();
};

export {
  LANGS,
  STORAGE_KEY,
  applyGoogleLanguage,
  ensureGoogleTranslate,
  ensureTranslateDomSetup,
  getStoredLanguage,
  detectLanguageFromBrowser,
  detectLanguageByGeolocation,
};
