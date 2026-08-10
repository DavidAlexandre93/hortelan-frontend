import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import BrandSplash from './components/BrandSplash';
import Router from './routes';
import CookieConsentBanner from './components/privacy/CookieConsentBanner';

const SPLASH_STORAGE_KEY = 'hortelan:intro-seen';

function shouldShowIntro(ssr) {
  if (ssr || typeof window === 'undefined') return false;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return !reducedMotion && window.sessionStorage.getItem(SPLASH_STORAGE_KEY) !== 'true';
}

export default function App({ ssr = false }) {
  const [showSplash, setShowSplash] = useState(() => shouldShowIntro(ssr));

  const finishSplash = useCallback(() => {
    window.sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
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
