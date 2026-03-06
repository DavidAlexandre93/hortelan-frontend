import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import RequireAuth from './components/auth/RequireAuth';
import RedirectIfAuth from './components/auth/RedirectIfAuth';

const CommunityPage = lazy(() => import('./pages/dashboard/CommunityPage'));
const AdminPanelPage = lazy(() => import('./pages/dashboard/AdminPanelPage'));
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'));
const SpeciesCatalogPage = lazy(() => import('./pages/dashboard/SpeciesCatalogPage'));
const MonitoringPage = lazy(() => import('./pages/dashboard/MonitoringPage'));
const Hortelan360Page = lazy(() => import('./pages/dashboard/Hortelan360Page'));
const OnboardingPage = lazy(() => import('./pages/dashboard/OnboardingPage'));
const PlatformStatusPage = lazy(() => import('./pages/dashboard/PlatformStatusPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const SecurityCenterPage = lazy(() => import('./pages/dashboard/SecurityCenterPage'));
const ProfileSettingsPage = lazy(() => import('./pages/dashboard/ProfileSettingsPage'));
const AlertCenterPage = lazy(() => import('./pages/dashboard/AlertCenterPage'));
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage'));
const SubscriptionsPage = lazy(() => import('./pages/dashboard/SubscriptionsPage'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const IntegrationsOperationsPage = lazy(() => import('./pages/dashboard/IntegrationsOperationsPage'));
const IntegrationsPage = lazy(() => import('./pages/dashboard/IntegrationsPage'));
const LoginForm = lazy(() => import('./sections/auth/login').then((module) => ({ default: module.LoginForm })));

const renderLazy = (Component) => (
  <Suspense fallback={null}>
    <Component />
  </Suspense>
);

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Navigate to="app" replace /> },
        { path: 'app', element: renderLazy(MonitoringPage) },
        { path: 'user', element: renderLazy(AdminPanelPage) },
        { path: 'products', element: renderLazy(SpeciesCatalogPage) },
        { path: 'blog', element: renderLazy(CommunityPage) },
        { path: 'hortelan-360', element: renderLazy(Hortelan360Page) },
        { path: 'onboarding', element: renderLazy(OnboardingPage) },
        { path: 'status', element: renderLazy(PlatformStatusPage) },
        { path: 'security', element: renderLazy(SecurityCenterPage) },
        { path: 'profile', element: renderLazy(ProfileSettingsPage) },
        { path: 'alertas', element: renderLazy(AlertCenterPage) },
        { path: 'relatorios', element: renderLazy(ReportsPage) },
        { path: 'assinaturas', element: renderLazy(SubscriptionsPage) },
        { path: 'integracoes', element: renderLazy(IntegrationsPage) },
        { path: 'suporte', element: renderLazy(HelpCenter) },
        { path: 'integracoes/ops', element: renderLazy(IntegrationsOperationsPage) },
      ],
    },
    {
      path: 'login',
      element: (
        <RedirectIfAuth>
          {renderLazy(LoginForm)}
        </RedirectIfAuth>
      ),
    },
    {
      path: 'register',
      element: (
        <RedirectIfAuth>
          {renderLazy(LoginForm)}
        </RedirectIfAuth>
      ),
    },
    {
      path: 'forgot-password',
      element: renderLazy(ForgotPasswordPage),
    },
    {
      path: 'reset-password',
      element: renderLazy(ResetPasswordPage),
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: renderLazy(NotFoundPage) },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
