import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha, keyframes, styled } from '@mui/material/styles';
import { Alert, Card, Container, Divider, IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Page from '../../../components/Page';
import Logo from '../../../components/Logo';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFCheckbox, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../auth/useAuth';
// sections
import AuthSocial from '../AuthSocial';
import { RegisterForm } from '../register';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const leafFloat = keyframes`
  0% { transform: translateY(0px) rotate(-3deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(-3deg); }
`;

const cableConnect = keyframes`
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
`;

const DecorativeScene = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
  background: `linear-gradient(170deg, ${alpha(theme.palette.success.light, 0.09)} 0%, ${alpha(
    theme.palette.info.light,
    0.08
  )} 60%, transparent 100%)`,
}));

const Leaf = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 70,
  height: 98,
  borderRadius: '80% 0 80% 0',
  background: `linear-gradient(145deg, ${theme.palette.success.light}, ${theme.palette.success.dark})`,
  boxShadow: `0 10px 24px ${alpha(theme.palette.success.dark, 0.35)}`,
  animation: `${leafFloat} 4.2s ease-in-out infinite`,
  transformOrigin: 'bottom center',
}));

const Cable = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '12%',
  right: '14%',
  top: '37%',
  height: 5,
  borderRadius: 999,
  background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
  boxShadow: `0 0 10px ${alpha(theme.palette.info.main, 0.45)}`,
  transformOrigin: 'left center',
  animation: `${cableConnect} 1.1s ease-out forwards`,
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

function LoginFields() {
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

    const result = await login({
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

export default function LoginForm() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isRegisterMode = useMemo(
    () => location.pathname === '/register' || searchParams.get('mode') === 'register',
    [location.pathname, searchParams]
  );

  if (location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }

  const goToMode = (mode) => {
    if (mode === 'register') {
      setSearchParams({ mode: 'register' }, { replace: location.pathname === '/register' });
      return;
    }

    setSearchParams({}, { replace: location.pathname === '/register' });
  };

  return (
    <Page title={isRegisterMode ? 'Cadastro' : 'Login'}>
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              {isRegisterMode ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
              <Link
                variant="subtitle2"
                component={RouterLink}
                to={isRegisterMode ? '/login' : '/register'}
                onClick={() => goToMode(isRegisterMode ? 'login' : 'register')}
              >
                {isRegisterMode ? 'Entrar' : 'Cadastre-se'}
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <DecorativeScene>
              <Leaf sx={{ top: '16%', left: '8%' }} />
              <Leaf sx={{ bottom: '12%', right: '12%', width: 62, height: 92, animationDuration: '4.8s' }} />
              <Cable />
            </DecorativeScene>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              {isRegisterMode ? 'Crie sua conta na Hortelan Agtech Ltda' : 'Olá, bem-vindo de volta à Hortelan Agtech Ltda'}
            </Typography>
            <img
              src={isRegisterMode ? '/static/illustrations/illustration_register.png' : '/static/illustrations/illustration_login.png'}
              alt={isRegisterMode ? 'register' : 'login'}
              style={{ position: 'relative', zIndex: 2 }}
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              {isRegisterMode ? 'Cadastre-se para começar' : 'Entrar na Hortelan Agtech Ltda'}
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: isRegisterMode ? 5 : 1 }}>
              {isRegisterMode
                ? 'Preencha seus dados e confirme seu e-mail para acessar a plataforma.'
                : 'Use seu e-mail e senha para continuar.'}
            </Typography>
            {!isRegisterMode && (
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                Acesso de demonstração: <strong>davidfernandes@hortelanagtech.com</strong> / <strong>admin</strong>.
              </Typography>
            )}

            <AuthSocial />

            {isRegisterMode ? <RegisterForm /> : <LoginFields />}

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" align="center">
              {isRegisterMode ? 'Já possui uma conta?' : 'Precisa criar uma conta?'}{' '}
              <Link
                variant="subtitle2"
                component={RouterLink}
                to={isRegisterMode ? '/login' : '/register'}
                onClick={() => goToMode(isRegisterMode ? 'login' : 'register')}
              >
                {isRegisterMode ? 'Entrar' : 'Abrir cadastro'}
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
