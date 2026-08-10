import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import useAuth from '../../auth/useAuth';

const ANON_COOKIE_KEY = 'hortelan-cookie-consent-anon';

export default function CookieConsentBanner() {
  const { authenticated, consents, updateConsents } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const hasDecision =
    typeof window === 'undefined' ||
    (authenticated ? typeof consents?.cookies === 'boolean' : window.localStorage.getItem(ANON_COOKIE_KEY) !== null);

  if (dismissed || hasDecision) {
    return null;
  }

  const handleChoice = async (accepted) => {
    if (submitting) return;
    setSubmitting(true);
    if (authenticated) {
      const result = await updateConsents({
        cookies: accepted,
        analytics: accepted ? (consents?.analytics ?? true) : false,
      });
      if (result?.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
    } else {
      localStorage.setItem(
        ANON_COOKIE_KEY,
        JSON.stringify({ cookies: accepted, analytics: accepted, updatedAt: new Date().toISOString() })
      );
    }

    setError('');
    setSubmitting(false);
    setDismissed(true);
  };

  return (
    <Alert
      severity="info"
      sx={{
        position: 'fixed',
        bottom: { xs: 8, sm: 16 },
        left: { xs: 8, sm: 16 },
        right: { xs: 8, sm: 16 },
        zIndex: 1600,
        alignItems: 'flex-start',
        boxShadow: 12,
        '& .MuiAlert-message': { width: '100%', py: 0.25 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.25, sm: 2 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.55 }}>
          Utilizamos cookies para segurança e medição analítica. Escolha seu consentimento.
        </Typography>
        {error && (
          <Typography role="alert" variant="caption" color="error.main">
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            onClick={() => handleChoice(false)}
            disabled={submitting}
            sx={{ flex: { xs: 1, sm: 'initial' } }}
          >
            Recusar
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleChoice(true)}
            loading={submitting}
            sx={{ flex: { xs: 1, sm: 'initial' } }}
          >
            Aceitar
          </Button>
        </Stack>
      </Stack>
    </Alert>
  );
}
