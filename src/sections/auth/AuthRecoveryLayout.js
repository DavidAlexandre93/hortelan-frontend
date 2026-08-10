import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Page from '../../components/Page';
import Logo from '../../components/Logo';

export default function AuthRecoveryLayout({ title, description, children }) {
  return (
    <Page title={title} description={description}>
      <Box
        component="main"
        id="main-content"
        sx={{ minHeight: '100dvh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '42% 1fr' } }}
      >
        <Box
          component="section"
          aria-label="Cultivo monitorado pela Hortelan"
          sx={{
            display: { xs: 'none', md: 'flex' },
            minHeight: '100dvh',
            p: 5,
            color: 'common.white',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundImage:
              'linear-gradient(180deg, rgba(6,31,21,.22), rgba(6,31,21,.84)), url(/static/media/auth-greenhouse.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Logo disabledLink sx={{ width: 58, height: 58 }} />
          <Box sx={{ maxWidth: 470 }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>
              Seu acesso merece cuidado.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.76)', lineHeight: 1.7 }}>
              Fluxos de recuperacao protegidos, mensagens discretas e controle de sessao por padrao.
            </Typography>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <Container maxWidth="sm" sx={{ px: { xs: 2.5, sm: 5 }, py: 5 }}>
            <Stack spacing={3.5} sx={{ maxWidth: 480, mx: 'auto' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Logo sx={{ width: 48, height: 48, display: { md: 'none' } }} />
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, ml: 'auto' }}
                >
                  <ArrowBackRoundedIcon fontSize="small" /> Voltar para o login
                </Link>
              </Stack>
              <Box>
                <Typography variant="overline" color="primary.dark" fontWeight={800}>
                  Seguranca da conta
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.75, mb: 1.25 }}>
                  {title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {description}
                </Typography>
              </Box>
              {children}
            </Stack>
          </Container>
        </Box>
      </Box>
    </Page>
  );
}

AuthRecoveryLayout.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
