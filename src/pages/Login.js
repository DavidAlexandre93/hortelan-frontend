import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
// @mui
import { alpha, keyframes, styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
import { motion, useScroll, useTransform } from '../lib/motionReact';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
import HarvestSplashScreen from '../components/fx/HarvestSplashScreen';
// sections
import { LoginForm } from '../sections/auth/login';
import AuthSocial from '../sections/auth/AuthSocial';

// ----------------------------------------------------------------------

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

const Leaf = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: 70,
  height: 98,
  borderRadius: '80% 0 80% 0',
  background: `linear-gradient(145deg, ${theme.palette.success.light}, ${theme.palette.success.dark})`,
  boxShadow: `0 10px 24px ${alpha(theme.palette.success.dark, 0.35)}`,
  animation: `${leafFloat} 4.2s ease-in-out infinite`,
  transformOrigin: 'bottom center',
}));

const Cable = styled(motion.div)(({ theme }) => ({
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
  '&::after': {
    content: '""',
    position: 'absolute',
    right: -6,
    top: -6,
    width: 18,
    height: 16,
    borderRadius: 3,
    backgroundColor: theme.palette.primary.dark,
    border: `2px solid ${theme.palette.common.white}`,
  },
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

// ----------------------------------------------------------------------

export default function Login() {
  const [showSplash, setShowSplash] = useState(true);
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  const { scrollYProgress } = useScroll();

  const leftLeafRotation = useTransform(scrollYProgress, [0, 1], [-8, 16]);
  const leftLeafY = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const rightLeafRotation = useTransform(scrollYProgress, [0, 1], [12, -18]);
  const rightLeafY = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const cableWave = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 8, 0, -8, 0]);

  return (
    <Page title="Login">
      {showSplash && <HarvestSplashScreen durationSec={4} onComplete={() => setShowSplash(false)} />}
      <RootStyle>
        <HeaderStyle>
          <Logo />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Não tem uma conta? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Cadastre-se
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <DecorativeScene>
              <Leaf sx={{ top: '16%', left: '8%' }} style={{ rotate: leftLeafRotation, y: leftLeafY }} />
              <Leaf
                sx={{ bottom: '12%', right: '12%', width: 62, height: 92, animationDuration: '4.8s' }}
                style={{ rotate: rightLeafRotation, y: rightLeafY }}
              />
              <Cable style={{ rotate: cableWave, scaleX: 1 }} />
            </DecorativeScene>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Olá, bem-vindo de volta à Hortelan Agtech Ltda
            </Typography>
            <img src="/static/illustrations/illustration_login.png" alt="login" style={{ position: 'relative', zIndex: 2 }} />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Entrar na Hortelan Agtech Ltda
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 1 }}>Use seu e-mail e senha para continuar.</Typography>
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Acesso de demonstração: <strong>admin@hortelan.com</strong> / <strong>admin123</strong>.
            </Typography>

            <AuthSocial />

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Não tem uma conta?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Cadastre-se
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
