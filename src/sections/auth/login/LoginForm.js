import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Alert, Link, Stack, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import useAuth from '../../../auth/useAuth';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [twoFactorChallenge, setTwoFactorChallenge] = useState(null);
  const [twoFactorHint, setTwoFactorHint] = useState('');
  const [demoCode, setDemoCode] = useState('');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Informe um e-mail válido').required('E-mail é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
    twoFactorCode: Yup.string().when([], {
      is: () => Boolean(twoFactorChallenge),
      then: (schema) => schema.required('Código 2FA obrigatório').length(6, 'O código deve ter 6 dígitos'),
      otherwise: (schema) => schema,
    }),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
    trustDevice: true,
    deviceName: '',
    twoFactorCode: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email, password, remember, trustDevice, deviceName, twoFactorCode }) => {
    setSubmitError('');

    const result = login({
      email,
      password,
      remember,
      trustDevice,
      deviceName,
      challengeId: twoFactorChallenge?.challengeId,
      twoFactorCode,
    });

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    if (result.requiresTwoFactor) {
      setTwoFactorChallenge(result);
      setTwoFactorHint(
        result.method === 'email'
          ? `Código enviado para ${result.deliveryHint}.`
          : 'Abra seu app autenticador e informe o código de 6 dígitos.'
      );
      setDemoCode(result.demoCode);
      return;
    }

    const destination = location.state?.from || '/dashboard/app';
    navigate(destination, { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {twoFactorChallenge && (
          <Alert severity="info">
            <Typography variant="subtitle2">2FA obrigatório</Typography>
            <Typography variant="body2">{twoFactorHint}</Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Ambiente de demo: código gerado <strong>{demoCode}</strong> (expira em 5 minutos).
            </Typography>
          </Alert>
        )}

        <RHFTextField name="email" label="E-mail" disabled={Boolean(twoFactorChallenge)} />

        <RHFTextField
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          disabled={Boolean(twoFactorChallenge)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {twoFactorChallenge && (
          <RHFTextField
            name="twoFactorCode"
            label="Código de autenticação"
            placeholder="000000"
            inputProps={{ maxLength: 6 }}
          />
        )}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Lembrar-me" disabled={Boolean(twoFactorChallenge)} />
        <Link variant="subtitle2" underline="hover" component={RouterLink} to="/forgot-password">
          Esqueceu sua senha?
        </Link>
      </Stack>

      <Stack sx={{ mb: 2 }}>
        <RHFCheckbox
          name="trustDevice"
          label="Confiar neste dispositivo por 30 dias"
          disabled={Boolean(twoFactorChallenge)}
        />
        <RHFTextField
          name="deviceName"
          label="Nome do dispositivo (opcional)"
          placeholder="Ex.: Notebook escritório"
          disabled={Boolean(twoFactorChallenge)}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        {twoFactorChallenge ? 'Validar 2FA e entrar' : 'Entrar'}
      </LoadingButton>

      {twoFactorChallenge && (
        <LoadingButton
          sx={{ mt: 2 }}
          fullWidth
          size="large"
          type="button"
          color="inherit"
          variant="outlined"
          onClick={() => {
            setTwoFactorChallenge(null);
            setTwoFactorHint('');
            setDemoCode('');
            setValue('twoFactorCode', '');
          }}
        >
          Voltar e alterar credenciais
        </LoadingButton>
      )}
    </FormProvider>
  );
}
