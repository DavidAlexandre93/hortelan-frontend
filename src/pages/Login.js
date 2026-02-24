import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, keyframes, styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
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
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight > 0 ? Math.min(window.scrollY / pageHeight, 1) : Math.min(window.scrollY / 300, 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftLeafRotation = -8 + scrollProgress * 24;
  const rightLeafRotation = 12 - scrollProgress * 30;
  const cableWave = Math.sin(scrollProgress * Math.PI * 3) * 8;

  return (
    <Page title="Login">
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
              <Leaf
                sx={{
                  top: '16%',
                  left: '8%',
                  transform: `rotate(${leftLeafRotation}deg) translateY(${scrollProgress * -8}px)`,
                }}
              />
              <Leaf
                sx={{
                  bottom: '12%',
                  right: '12%',
                  width: 62,
                  height: 92,
                  animationDuration: '4.8s',
                  transform: `rotate(${rightLeafRotation}deg) translateY(${scrollProgress * 10}px)`,
                }}
              />
              <Cable sx={{ transform: `scaleX(1) rotate(${cableWave}deg)` }} />
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
