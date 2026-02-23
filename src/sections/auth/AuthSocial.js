import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// material
import { Stack, Button, Divider, Typography, Alert } from '@mui/material';
// component
import Iconify from '../../components/Iconify';
import useAuth from '../../auth/useAuth';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithSocial } = useAuth();
  const [socialError, setSocialError] = useState('');

  const handleSocialLogin = (provider) => {
    setSocialError('');
    const result = loginWithSocial({ provider, remember: true, trustDevice: true });

    if (result.error) {
      setSocialError(result.error);
      return;
    }

    if (result.requiresTwoFactor) {
      setSocialError('Este provedor exige 2FA. Faça login com e-mail/senha para validar o código.');
      return;
    }

    const destination = location.state?.from || '/dashboard/app';
    navigate(destination, { replace: true });
  };

  return (
    <>
      {socialError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {socialError}
        </Alert>
      )}

      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => handleSocialLogin('google')}>
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => handleSocialLogin('apple')}>
          <Iconify icon="mdi:apple" color="#000000" width={22} height={22} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OU
        </Typography>
      </Divider>
    </>
  );
}
