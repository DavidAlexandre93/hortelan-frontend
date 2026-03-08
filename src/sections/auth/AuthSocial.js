import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, Button, Divider, Typography, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
// component
import useAuth from '../../auth/useAuth';
import { DEFAULT_AUTH_REDIRECT } from '../../utils/authRedirect';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const navigate = useNavigate();
  const { loginWithSocial } = useAuth();
  const [socialError, setSocialError] = useState('');

  const handleSocialLogin = async (provider) => {
    setSocialError('');
    const result = await loginWithSocial({ provider, remember: true, trustDevice: true });

    if (result.error) {
      setSocialError(result.error);
      return;
    }

    if (result.requiresTwoFactor) {
      setSocialError('Este provedor exige 2FA. Faça login com e-mail/senha para validar o código.');
      return;
    }

    navigate(DEFAULT_AUTH_REDIRECT, { replace: true });
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
          <GoogleIcon sx={{ color: '#DF3E30' }} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => handleSocialLogin('apple')}>
          <AppleIcon sx={{ color: '#000000' }} />
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
