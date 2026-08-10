import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import BrandSplash from './components/BrandSplash';
import Router from './routes';
import CookieConsentBanner from './components/privacy/CookieConsentBanner';

export const SPLASH_STORAGE_KEY = 'hortelan:intro-seen';

export function shouldShowIntro(ssr, browser = typeof window === 'undefined' ? null : window) {
  if (ssr || !browser) return false;

  try {
    const reducedMotion = browser.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return !reducedMotion && browser.sessionStorage.getItem(SPLASH_STORAGE_KEY) !== 'true';
  } catch {
    return false;
  }
}

export default function App({ ssr = false }) {
  const [showSplash, setShowSplash] = useState(() => shouldShowIntro(ssr));

  const finishSplash = useCallback(() => {
    try {
      window.sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
    } catch {
      // Storage can be unavailable in hardened/private browser contexts.
    }
    setShowSplash(false);
  }, []);

  return (
    <>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          left: 16,
          top: 12,
          zIndex: 1800,
          transform: 'translateY(-160%)',
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          px: 2,
          py: 1.25,
          borderRadius: 1,
          textDecoration: 'none',
          '&:focus': { transform: 'translateY(0)' },
        }}
      >
        Ir para o conteudo
      </Box>
      {showSplash ? <BrandSplash onFinish={finishSplash} /> : <Router ssr={ssr} />}
      {!ssr && <CookieConsentBanner />}
    </>
  );
}

App.propTypes = {
  ssr: PropTypes.bool,
};
