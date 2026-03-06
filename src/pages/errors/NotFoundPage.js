import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, Stack, Paper, Chip } from '@mui/material';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(8, 0),
  background: `linear-gradient(140deg, ${alpha(theme.palette.success.light, 0.28)} 0%, ${alpha(theme.palette.info.light, 0.24)} 55%, ${alpha(theme.palette.primary.light, 0.2)} 100%)`,
}));

const GlowShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  zIndex: 0,
  '&.shape1': {
    width: 320,
    height: 320,
    top: -120,
    right: -70,
    background: alpha(theme.palette.success.main, 0.2),
  },
  '&.shape2': {
    width: 240,
    height: 240,
    bottom: -90,
    left: -60,
    background: alpha(theme.palette.info.main, 0.2),
  },
}));

const ErrorCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 1080,
  margin: '0 auto',
  borderRadius: theme.spacing(4),
  border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
  boxShadow: `0 28px 54px ${alpha(theme.palette.primary.dark, 0.18)}`,
  padding: theme.spacing(4),
  background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.97)}, ${alpha(theme.palette.common.white, 0.93)})`,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const ContextItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.success.main, 0.08),
  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  padding: theme.spacing(1.2, 1.4),
}));

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <Page title="Erro 404">
      <HeroSection>
        <GlowShape className="shape1" />
        <GlowShape className="shape2" />

        <Container>
          <ErrorCard>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 7 }} alignItems="center">
              <Box sx={{ width: '100%', maxWidth: 500 }}>
                <Chip
                  icon={<SensorsRoundedIcon />}
                  label="Plataforma de Horta Conectada"
                  color="success"
                  sx={{ mb: 2, fontWeight: 700 }}
                />

                <Typography variant="h2" sx={{ mb: 1, color: 'primary.main', fontWeight: 800 }}>
                  Erro 404
                </Typography>

                <Typography variant="h4" sx={{ mb: 2, lineHeight: 1.2 }}>
                  Sinal perdido na sua plantação inteligente
                </Typography>

                <Typography sx={{ color: 'text.secondary', mb: 1.2 }}>
                  Esta rota não foi encontrada no painel da sua rede IoT. Vamos te reconectar para continuar
                  monitorando sensores, irrigação e saúde da horta.
                </Typography>

                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                  Tente novamente mais tarde se o problema persistir.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button to="/login" size="large" variant="contained" component={RouterLink}>
                    Voltar ao painel
                  </Button>

                  <Button size="large" variant="outlined" onClick={() => window.location.reload()}>
                    Reconectar agora
                  </Button>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mt: 3 }}>
                  <ContextItem>
                    <SpaRoundedIcon color="success" fontSize="small" />
                    <Typography variant="body2">Cultivo monitorado</Typography>
                  </ContextItem>

                  <ContextItem>
                    <HubRoundedIcon color="info" fontSize="small" />
                    <Typography variant="body2">Sensores em rede</Typography>
                  </ContextItem>
                </Stack>
              </Box>

              <Box
                component="img"
                src="/static/illustrations/illustration_404.svg"
                alt="Ilustração de horta conectada com IoT"
                sx={{ width: '100%', maxWidth: 430, height: 'auto' }}
              />
            </Stack>
          </ErrorCard>
        </Container>
      </HeroSection>
    </Page>
  );
}
