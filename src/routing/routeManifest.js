import { lazy } from 'react';
import { LoginPage, RegisterPage } from '../sections/auth/login';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import NotFoundPage from '../pages/errors/NotFoundPage';

const loadDefault = (factory) => lazy(factory);

export const dashboardRoutes = [
  {
    path: 'app',
    canonicalPath: '/dashboard/app',
    access: 'private',
    title: 'Monitoramento',
    description: 'Acompanhe sensores, cultivos, alertas e irrigacao em tempo real.',
    badge: 'Operacao ao vivo',
    heading: 'Visao geral do cultivo',
    subheading: 'Prioridades, clima, sensores e automacoes reunidos para uma decisao rapida.',
    Component: loadDefault(() => import('../pages/dashboard/MonitoringPage')),
  },
  {
    path: 'admin',
    canonicalPath: '/dashboard/admin',
    access: 'private',
    title: 'Administracao',
    description: 'Gerencie pessoas, dispositivos e governanca da plataforma.',
    badge: 'Governanca',
    heading: 'Administracao da plataforma',
    subheading: 'Usuarios, dispositivos e operacoes criticas com contexto e controle.',
    Component: loadDefault(() => import('../pages/dashboard/AdminPanelPage')),
  },
  {
    path: 'products',
    canonicalPath: '/dashboard/products',
    access: 'private',
    title: 'Catalogo de especies',
    description: 'Consulte especies, tecnicas de cultivo e recomendacoes agronomicas.',
    badge: 'Conhecimento agronomico',
    heading: 'Catalogo de especies',
    subheading: 'Informacao pratica para planejar cada ciclo com mais previsibilidade.',
    Component: loadDefault(() => import('../pages/dashboard/SpeciesCatalogPage')),
  },
  {
    path: 'blog',
    canonicalPath: '/dashboard/blog',
    access: 'private',
    title: 'Comunidade',
    description: 'Troque experiencias e boas praticas com a comunidade Hortelan.',
    badge: 'Comunidade',
    heading: 'Conhecimento que cresce junto',
    subheading: 'Experiencias de campo, aprendizados e praticas compartilhadas pela comunidade.',
    Component: loadDefault(() => import('../pages/dashboard/CommunityPage')),
  },
  {
    path: 'hortelan-360',
    canonicalPath: '/dashboard/hortelan-360',
    access: 'private',
    title: 'Hortelan 360',
    description: 'Indicadores executivos e operacionais integrados em uma unica visao.',
    badge: 'Inteligencia integrada',
    heading: 'Hortelan 360',
    subheading: 'Desempenho, riscos e oportunidades conectados em uma leitura objetiva.',
    Component: loadDefault(() => import('../pages/dashboard/Hortelan360Page')),
  },
  {
    path: 'onboarding',
    canonicalPath: '/dashboard/onboarding',
    access: 'private',
    title: 'Onboarding',
    description: 'Configure sua operacao e avance pelas etapas essenciais da plataforma.',
    badge: 'Primeiros passos',
    heading: 'Configure sua operacao',
    subheading: 'Uma jornada orientada para ativar o essencial e gerar valor desde o primeiro dia.',
    Component: loadDefault(() => import('../pages/dashboard/OnboardingPage')),
  },
  {
    path: 'status',
    canonicalPath: '/dashboard/status',
    access: 'private',
    title: 'Status da plataforma',
    description: 'Disponibilidade, incidentes e saude dos servicos Hortelan.',
    badge: 'Confiabilidade',
    heading: 'Status da plataforma',
    subheading: 'Disponibilidade dos servicos e atualizacoes operacionais em um so lugar.',
    Component: loadDefault(() => import('../pages/dashboard/PlatformStatusPage')),
  },
  {
    path: 'security',
    canonicalPath: '/dashboard/security',
    access: 'private',
    title: 'Seguranca',
    description: 'Gerencie sessoes, dispositivos confiaveis e protecao da conta.',
    badge: 'Protecao da conta',
    heading: 'Seguranca e acesso',
    subheading: 'Revise sessoes e controles sensiveis com clareza e rastreabilidade.',
    Component: loadDefault(() => import('../pages/dashboard/SecurityCenterPage')),
  },
  {
    path: 'profile',
    canonicalPath: '/dashboard/profile',
    access: 'private',
    title: 'Perfil e preferencias',
    description: 'Atualize identidade, notificacoes, privacidade e preferencias.',
    badge: 'Sua conta',
    heading: 'Perfil e preferencias',
    subheading: 'Mantenha seus dados, notificacoes e escolhas de privacidade sob controle.',
    Component: loadDefault(() => import('../pages/dashboard/ProfileSettingsPage')),
  },
  {
    path: 'alertas',
    canonicalPath: '/dashboard/alertas',
    access: 'private',
    title: 'Central de alertas',
    description: 'Priorize eventos que exigem atencao na operacao.',
    badge: 'Atencao necessaria',
    heading: 'Central de alertas',
    subheading: 'Sinais ordenados por impacto para sua equipe agir com rapidez.',
    Component: loadDefault(() => import('../pages/dashboard/AlertCenterPage')),
  },
  {
    path: 'relatorios',
    canonicalPath: '/dashboard/relatorios',
    access: 'private',
    title: 'Relatorios',
    description: 'Transforme dados de campo em indicadores e relatorios acionaveis.',
    badge: 'Analise',
    heading: 'Relatorios e desempenho',
    subheading: 'Compare periodos, identifique tendencias e compartilhe decisoes com contexto.',
    Component: loadDefault(() => import('../pages/dashboard/ReportsPage')),
  },
  {
    path: 'assinaturas',
    canonicalPath: '/dashboard/assinaturas',
    access: 'private',
    title: 'Planos e assinatura',
    description: 'Consulte limites, uso e opcoes do seu plano Hortelan.',
    badge: 'Plano e uso',
    heading: 'Planos e assinatura',
    subheading: 'Entenda o consumo atual e escolha recursos de acordo com sua operacao.',
    Component: loadDefault(() => import('../pages/dashboard/SubscriptionsPage')),
  },
  {
    path: 'integracoes',
    canonicalPath: '/dashboard/integracoes',
    access: 'private',
    title: 'Integracoes',
    description: 'Conecte fontes de dados e servicos ao ecossistema Hortelan.',
    badge: 'Ecossistema',
    heading: 'Integracoes',
    subheading: 'Conexoes confiaveis, estados transparentes e operacoes rastreaveis.',
    Component: loadDefault(() => import('../pages/dashboard/IntegrationsPage')),
  },
  {
    path: 'integracoes/ops',
    canonicalPath: '/dashboard/integracoes/ops',
    access: 'private',
    title: 'Operacoes de integracao',
    description: 'Acompanhe a saude tecnica das integracoes da plataforma.',
    badge: 'Observabilidade',
    heading: 'Operacoes de integracao',
    subheading: 'Sincronizacoes, disponibilidade e diagnosticos para o time tecnico.',
    Component: loadDefault(() => import('../pages/dashboard/IntegrationsOperationsPage')),
  },
  {
    path: 'suporte',
    canonicalPath: '/dashboard/suporte',
    access: 'private',
    title: 'Central de ajuda',
    description: 'Encontre respostas e caminhos para resolver duvidas da operacao.',
    badge: 'Suporte',
    heading: 'Como podemos ajudar?',
    subheading: 'Conteudo direto e canais de suporte para voce voltar ao trabalho rapidamente.',
    Component: loadDefault(() => import('../pages/HelpCenter')),
  },
];

export const publicRoutes = [
  {
    path: '/login',
    access: 'anonymous',
    title: 'Entrar',
    description: 'Acesse a plataforma Hortelan para acompanhar sua operacao.',
    Component: LoginPage,
  },
  {
    path: '/register',
    access: 'anonymous',
    title: 'Criar conta',
    description: 'Crie sua conta Hortelan e comece a organizar seu cultivo.',
    Component: RegisterPage,
  },
  {
    path: '/forgot-password',
    access: 'public',
    title: 'Recuperar senha',
    description: 'Solicite a recuperacao segura do acesso a sua conta Hortelan.',
    Component: ForgotPasswordPage,
  },
  {
    path: '/reset-password',
    access: 'public',
    title: 'Redefinir senha',
    description: 'Defina uma nova senha para sua conta Hortelan.',
    Component: ResetPasswordPage,
  },
  {
    path: '/404',
    access: 'public',
    title: 'Pagina nao encontrada',
    description: 'A pagina solicitada nao foi encontrada.',
    Component: NotFoundPage,
  },
];

export const legacyAliases = [
  { path: '/hortelan-360', destination: '/dashboard/hortelan-360' },
  { path: '/hortelan360', destination: '/dashboard/hortelan-360' },
  { path: '/hortelan_360', destination: '/dashboard/hortelan-360' },
];

const routeManifest = [...publicRoutes, ...dashboardRoutes];

export function findRouteMetadata(pathname) {
  const normalizedPath = pathname.split('?')[0].replace(/\/$/, '') || '/';
  return [...routeManifest]
    .sort((a, b) => (b.canonicalPath || b.path).length - (a.canonicalPath || a.path).length)
    .find((route) => {
      if (route.canonicalPath) {
        return normalizedPath === route.canonicalPath || normalizedPath.startsWith(`${route.canonicalPath}/`);
      }
      return normalizedPath === route.path;
    });
}

export function findDashboardContext(pathname) {
  return findRouteMetadata(pathname) || dashboardRoutes[0];
}

export const ssrRoutePaths = new Set(['/', ...publicRoutes.map((route) => route.path)]);
