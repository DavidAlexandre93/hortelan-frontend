import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import Logo from './Logo';

export const SPLASH_DURATION_MS = 1700;

export default function BrandSplash({ onFinish }) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <Box
      role="status"
      aria-label="Preparando a Hortelan"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        display: 'grid',
        placeItems: 'center',
        color: 'common.white',
        bgcolor: '#123a2b',
        backgroundImage:
          'linear-gradient(90deg, rgba(7, 34, 24, 0.91), rgba(7, 34, 24, 0.42)), url(/static/media/auth-greenhouse.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 3,
      }}
    >
      <Stack spacing={2.5} alignItems="flex-start" sx={{ width: 1, maxWidth: 560 }}>
        <Logo disabledLink sx={{ width: 72, height: 72, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.24))' }} />
        <Typography
          variant="h2"
          component="p"
          sx={{ maxWidth: 520, fontSize: { xs: '2rem', sm: '3rem' }, lineHeight: 1.08 }}
        >
          Cultivo inteligente, decisoes mais claras.
        </Typography>
        <Typography sx={{ maxWidth: 480, color: 'rgba(255,255,255,.82)', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
          Preparando sua central de operacao Hortelan.
        </Typography>
        <LinearProgress
          color="inherit"
          sx={{ width: 220, bgcolor: 'rgba(255,255,255,.2)', '& .MuiLinearProgress-bar': { bgcolor: '#a7f3d0' } }}
        />
        <Button color="inherit" onClick={onFinish} sx={{ px: 0, minWidth: 44 }}>
          Pular introducao
        </Button>
      </Stack>
    </Box>
  );
}

BrandSplash.propTypes = {
  onFinish: PropTypes.func.isRequired,
};
