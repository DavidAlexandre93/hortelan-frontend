import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import { Alert, Box, Button, Container, IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import Page from '../../../components/Page';
import Logo from '../../../components/Logo';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFCheckbox, RHFTextField } from '../../../components/hook-form';
import useAuth from '../../../auth/useAuth';
import { RegisterForm } from '../register';
import AuthSocial from '../AuthSocial';
import { resolvePostAuthDestination } from '../../../utils/authRedirect';

const Root = styled('main')(({ theme }) => ({
  minHeight: '100dvh',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(420px, 47%) minmax(480px, 1fr)',
  },
}));

const VisualPanel = styled('section')(({ theme }) => ({
  display: 'none',
  position: 'relative',
  minHeight: '100dvh',
  overflow: 'hidden',
  color: theme.palette.common.white,
  backgroundColor: '#173f2f',
  backgroundImage:
    'linear-gradient(180deg, rgba(7, 30, 21, 0.2) 0%, rgba(7, 30, 21, 0.86) 100%), url(/static/media/auth-greenhouse.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(5),
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(7),
  },
}));

const FormPanel = styled('section')(({ theme }) => ({
  minWidth: 0,
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 0, 5),
  background: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 0),
  },
}));

function FeatureLine({ icon, title, detail }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 44,
          height: 44,
          flex: '0 0 44px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          bgcolor: 'rgba(255,255,255,.14)',
          border: '1px solid rgba(255,255,255,.2)',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" color="inherit">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.72)' }}>
          {detail}
        </Typography>
      </Box>
    </Stack>
  );
}

FeatureLine.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
};

function AuthLayout({ mode, children }) {
  const isRegister = mode === 'register';

  return (
    <Page
      title={isRegister ? 'Criar conta' : 'Entrar'}
      description={
        isRegister ? 'Crie sua conta e comece a organizar seu cultivo.' : 'Acesse sua central de operacao Hortelan.'
      }
    >
      <Root id="main-content">
        <VisualPanel aria-label="Cultivo protegido monitorado pela Hortelan">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Logo disabledLink sx={{ width: 58, height: 58, filter: 'drop-shadow(0 8px 18px rgba(0,0,0,.25))' }} />
            <Box>
              <Typography variant="h5" color="inherit">
                Hortelan
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.76)' }}>
                Inteligencia para cultivar melhor
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ maxWidth: 560 }}>
            <Typography variant="h2" sx={{ fontSize: { md: '2.25rem', xl: '3rem' }, lineHeight: 1.08, mb: 2 }}>
              Decisoes precisas, do sensor ao campo.
            </Typography>
            <Typography
              sx={{ maxWidth: 500, color: 'rgba(255,255,255,.78)', fontSize: '1.05rem', lineHeight: 1.7, mb: 4 }}
            >
              Conecte dados, equipe e automacoes em uma central desenhada para a rotina real da operacao.
            </Typography>
            <Stack spacing={2.25}>
              <FeatureLine
                icon={<SensorsRoundedIcon />}
                title="Leitura em tempo real"
                detail="Sinais importantes sem ruido visual."
              />
              <FeatureLine
                icon={<WaterDropRoundedIcon />}
                title="Uso consciente de recursos"
                detail="Irrigacao orientada por contexto."
              />
              <FeatureLine
                icon={<CheckCircleRoundedIcon />}
                title="Rotina sob controle"
                detail="Alertas e tarefas com prioridade clara."
              />
            </Stack>
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.64)' }}>
            Operacao confiavel, acessivel e centrada em pessoas.
          </Typography>
        </VisualPanel>

        <FormPanel>
          <Container maxWidth="sm" sx={{ px: { xs: 2.5, sm: 5, lg: 7 }, py: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 5, md: 7 } }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ display: { md: 'none' } }}>
                <Logo sx={{ width: 46, height: 46 }} />
                <Typography variant="h6">Hortelan</Typography>
              </Stack>
              <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {isRegister ? 'Já possui uma conta? ' : 'Novo por aqui? '}
                </Box>
                <Link component={RouterLink} to={isRegister ? '/login' : '/register'} fontWeight={700}>
                  {isRegister ? 'Entrar' : 'Criar conta'}
                </Link>
              </Typography>
            </Stack>

            <Box sx={{ maxWidth: 480, mx: 'auto' }}>
              <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 800 }}>
                {isRegister ? 'Comece agora' : 'Bem-vindo de volta'}
              </Typography>
              <Typography variant="h3" sx={{ mt: 0.75, mb: 1.25, fontSize: { xs: '1.8rem', sm: '2.15rem' } }}>
                {isRegister ? 'Crie sua conta Hortelan' : 'Acesse sua operacao'}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                {isRegister
                  ? 'Informe seus dados para preparar um ambiente seguro para o seu cultivo.'
                  : 'Entre com suas credenciais para continuar de onde parou.'}
              </Typography>
              {children}
            </Box>
          </Container>
        </FormPanel>
      </Root>
    </Page>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(['login', 'register']).isRequired,
};

function LoginFields() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [twoFactorChallenge, setTwoFactorChallenge] = useState(null);
  const [twoFactorHint, setTwoFactorHint] = useState('');

  const schema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string().email('Informe um e-mail valido').required('E-mail e obrigatorio'),
        password: Yup.string().required('Senha e obrigatoria'),
        twoFactorCode: Yup.string().when([], {
          is: () => Boolean(twoFactorChallenge),
          then: (field) => field.required('Codigo obrigatorio').matches(/^\d{6}$/, 'Informe os 6 digitos'),
          otherwise: (field) => field,
        }),
      }),
    [twoFactorChallenge]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '', remember: true, trustDevice: false, twoFactorCode: '' },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email, password, remember, trustDevice, twoFactorCode }) => {
    setSubmitError('');
    const result = await login({
      email,
      password,
      remember,
      trustDevice,
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
        result.method === 'email' ? `Codigo enviado para ${result.deliveryHint}.` : 'Abra seu aplicativo autenticador.'
      );
      return;
    }

    navigate(resolvePostAuthDestination({ search: location.search, stateFrom: location.state?.from }), {
      replace: true,
    });
  };

  return (
    <>
      {demoMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Modo de demonstracao ativo. O acesso local temporario esta disponivel apenas neste ambiente.
        </Alert>
      )}
      <AuthSocial />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          {twoFactorChallenge && (
            <Alert severity="info">
              <strong>Verificacao em duas etapas.</strong> {twoFactorHint}
            </Alert>
          )}
          <RHFTextField name="email" label="E-mail" autoComplete="email" disabled={Boolean(twoFactorChallenge)} />
          <RHFTextField
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={Boolean(twoFactorChallenge)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {twoFactorChallenge && (
            <RHFTextField
              name="twoFactorCode"
              label="Codigo de autenticacao"
              inputProps={{ inputMode: 'numeric', maxLength: 6 }}
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ my: 2 }}>
          <RHFCheckbox name="remember" label="Manter conectado" disabled={Boolean(twoFactorChallenge)} />
          <Link component={RouterLink} to="/forgot-password" variant="subtitle2">
            Esqueci a senha
          </Link>
        </Stack>
        <RHFCheckbox name="trustDevice" label="Confiar neste dispositivo" disabled={Boolean(twoFactorChallenge)} />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 2, minHeight: 48 }}
        >
          {twoFactorChallenge ? 'Validar e entrar' : 'Entrar'}
        </Button>

        {twoFactorChallenge && (
          <Button
            fullWidth
            size="large"
            type="button"
            color="inherit"
            variant="outlined"
            sx={{ mt: 1.5, minHeight: 48 }}
            onClick={() => {
              setTwoFactorChallenge(null);
              setTwoFactorHint('');
              setValue('twoFactorCode', '');
            }}
          >
            Alterar credenciais
          </Button>
        )}
      </FormProvider>
    </>
  );
}

export function LoginPage() {
  return (
    <AuthLayout mode="login">
      <LoginFields />
    </AuthLayout>
  );
}

export function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <RegisterForm />
    </AuthLayout>
  );
}
