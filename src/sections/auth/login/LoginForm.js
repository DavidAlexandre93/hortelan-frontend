import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Alert, Link, Stack, IconButton, InputAdornment } from '@mui/material';
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

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Informe um e-mail válido').required('E-mail é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email, password, remember }) => {
    setSubmitError('');

    const result = login({ email, password, remember });

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    const destination = location.state?.from || '/dashboard/app';
    navigate(destination, { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <RHFTextField name="email" label="E-mail" />

        <RHFTextField
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Lembrar-me" />
        <Link variant="subtitle2" underline="hover" component={RouterLink} to="/forgot-password">
          Esqueceu sua senha?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Entrar
      </LoadingButton>
    </FormProvider>
  );
}
