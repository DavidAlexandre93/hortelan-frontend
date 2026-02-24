import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Stack } from '@mui/material';
import useAuth from '../../auth/useAuth';

const ANON_COOKIE_KEY = 'hortelan-cookie-consent-anon';

export default function CookieConsentBanner() {
  const { authenticated, consents, updateConsents } = useAuth();
  const [hidden, setHidden] = useState(false);

  const hasDecision = useMemo(() => {
    if (authenticated) {
      return typeof consents?.cookies === 'boolean';
    }

    return localStorage.getItem(ANON_COOKIE_KEY) !== null;
  }, [authenticated, consents?.cookies]);

  useEffect(() => {
    setHidden(hasDecision);
  }, [hasDecision]);

  if (hidden) {
    return null;
  }

  const handleChoice = (accepted) => {
    if (authenticated) {
      updateConsents({ cookies: accepted, analytics: accepted ? consents?.analytics ?? true : false });
    } else {
      localStorage.setItem(ANON_COOKIE_KEY, JSON.stringify({ cookies: accepted, updatedAt: new Date().toISOString() }));
    }

    setHidden(true);
  };

  return (
    <Alert
      severity="info"
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1600,
      }}
      action={
        <Stack direction="row" spacing={1}>
          <Button color="inherit" size="small" onClick={() => handleChoice(false)}>
            Recusar
          </Button>
          <Button variant="contained" color="info" size="small" onClick={() => handleChoice(true)}>
            Aceitar
          </Button>
        </Stack>
      }
    >
      Utilizamos cookies para segurança e medição analítica. Escolha seu consentimento.
    </Alert>
  );
}
