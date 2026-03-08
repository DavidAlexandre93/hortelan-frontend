import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Chip, Stack, Typography } from '@mui/material';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const PAGE_CONTEXT = {
  '/dashboard/app': {
    badge: 'Monitoramento inteligente',
    title: 'Centro de Comando AgroTech',
    subtitle: 'Sensores, alertas e automações em uma experiência unificada para operação em tempo real.',
  },
  '/dashboard/admin': {
    badge: 'Operação e governança',
    title: 'Administração da Plataforma',
    subtitle: 'Gerencie usuários, dispositivos, conteúdo e billing com foco em eficiência operacional.',
  },
  '/dashboard/products': {
    badge: 'Dados agronômicos',
    title: 'Catálogo de Espécies',
    subtitle: 'Recomendações técnicas com visão moderna para produtividade, qualidade e rastreabilidade.',
  },
  '/dashboard/onboarding': {
    badge: 'Adoção acelerada',
    title: 'Onboarding Guiado',
    subtitle: 'Jornadas práticas para ativar recursos-chave da plataforma com rapidez e clareza.',
  },
  '/dashboard/hortelan-360': {
    badge: 'Visão 360°',
    title: 'Hortelan 360 Intelligence',
    subtitle: 'Integre indicadores estratégicos e operacionais em um painel executivo de alta precisão.',
  },
  '/dashboard/blog': {
    badge: 'Ecossistema colaborativo',
    title: 'Comunidade AgroTech',
    subtitle: 'Compartilhe aprendizados, casos e melhores práticas orientadas por dados.',
  },
  '/dashboard/alertas': {
    badge: 'Resposta proativa',
    title: 'Central de Alertas',
    subtitle: 'Priorize incidentes críticos e reaja rapidamente com contexto operacional em tempo real.',
  },
  '/dashboard/relatorios': {
    badge: 'Business insights',
    title: 'Relatórios e Performance',
    subtitle: 'Transforme dados de campo em indicadores acionáveis para decisões mais inteligentes.',
  },
  '/dashboard/assinaturas': {
    badge: 'Gestão comercial',
    title: 'Planos e Assinaturas',
    subtitle: 'Acompanhe ativos, upgrades e retenção com experiência clara e orientada a valor.',
  },
  '/dashboard/integracoes': {
    badge: 'Conectividade',
    title: 'Integrações da Plataforma',
    subtitle: 'Conecte sistemas, APIs e fluxos de operação para uma stack AgroTech moderna.',
  },
  '/dashboard/suporte': {
    badge: 'Sucesso do cliente',
    title: 'Central de Ajuda',
    subtitle: 'Documentação e suporte em um hub inteligente para reduzir dúvidas e acelerar resolução.',
  },
  '/dashboard/status': {
    badge: 'Confiabilidade',
    title: 'Status da Plataforma',
    subtitle: 'Visibilidade contínua de disponibilidade, incidentes e saúde dos serviços.',
  },
  '/dashboard/security': {
    badge: 'Cyber resilience',
    title: 'Segurança e Compliance',
    subtitle: 'Proteja contas, acessos e integrações com controles avançados e monitoramento ativo.',
  },
  '/dashboard/profile': {
    badge: 'Experiência personalizada',
    title: 'Perfil e Preferências',
    subtitle: 'Ajuste identidade, notificações e preferências para uma operação do seu jeito.',
  },
};

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  overflowX: 'hidden',
  background: `radial-gradient(circle at 10% -10%, ${theme.palette.primary.lighter}66 0%, transparent 48%),
    radial-gradient(circle at 90% 0%, ${theme.palette.info.lighter}7A 0%, transparent 42%),
    ${theme.palette.background.default}`,
}));

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: 0,
  minWidth: 0,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 16,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingBottom: theme.spacing(10),
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: APP_BAR_MOBILE + 24,
  },
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const context = useMemo(() => {
    const exactMatch = PAGE_CONTEXT[pathname];
    if (exactMatch) return exactMatch;

    const dynamicMatch = Object.keys(PAGE_CONTEXT).find((key) => pathname.startsWith(key));
    return PAGE_CONTEXT[dynamicMatch] || PAGE_CONTEXT['/dashboard/app'];
  }, [pathname]);

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Box
          sx={(theme) => ({
            mb: 3,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.96)} 0%, ${alpha(
              theme.palette.primary.main,
              0.92
            )} 42%, ${alpha(theme.palette.info.main, 0.9)} 100%)`,
            color: 'common.white',
            boxShadow: `0 18px 36px ${alpha(theme.palette.primary.dark, 0.24)}`,
          })}
        >
          <Stack spacing={1}>
            <Chip
              label={context.badge}
              sx={{
                alignSelf: 'flex-start',
                color: 'common.white',
                borderColor: 'rgba(255,255,255,0.36)',
                bgcolor: 'rgba(255,255,255,0.12)',
                fontWeight: 700,
              }}
              variant="outlined"
              size="small"
            />
            <Typography variant="h4" sx={{ fontSize: { xs: '1.35rem', sm: '1.65rem', md: '2rem' }, lineHeight: 1.2 }}>{context.title}</Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 840, fontSize: { xs: '0.9rem', sm: '1rem' } }}>{context.subtitle}</Typography>
          </Stack>
        </Box>

        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
