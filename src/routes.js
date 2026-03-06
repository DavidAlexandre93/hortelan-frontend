import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import RequireAuth from './components/auth/RequireAuth';
import RedirectIfAuth from './components/auth/RedirectIfAuth';

const Blog = lazy(() => import('./pages/Blog'));
const User = lazy(() => import('./pages/User'));
const NotFound = lazy(() => import('./pages/Page404'));
const Products = lazy(() => import('./pages/Products'));
const DashboardApp = lazy(() => import('./pages/DashboardApp'));
const Hortelan360 = lazy(() => import('./pages/Hortelan360'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Security = lazy(() => import('./pages/Security'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const AlertCenter = lazy(() => import('./pages/AlertCenter'));
const Reports = lazy(() => import('./pages/Reports'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const IntegrationsOps = lazy(() => import('./pages/IntegrationsOps'));
const Integrations = lazy(() => import('./pages/Integrations'));
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
        { path: 'app', element: renderLazy(DashboardApp) },
        { path: 'user', element: renderLazy(User) },
        { path: 'products', element: renderLazy(Products) },
        { path: 'blog', element: renderLazy(Blog) },
        { path: 'hortelan-360', element: renderLazy(Hortelan360) },
        { path: 'onboarding', element: renderLazy(Onboarding) },
        { path: 'status', element: renderLazy(StatusPage) },
        { path: 'security', element: renderLazy(Security) },
        { path: 'profile', element: renderLazy(ProfileSettings) },
        { path: 'alertas', element: renderLazy(AlertCenter) },
        { path: 'relatorios', element: renderLazy(Reports) },
        { path: 'assinaturas', element: renderLazy(Subscriptions) },
        { path: 'integracoes', element: renderLazy(Integrations) },
        { path: 'suporte', element: renderLazy(HelpCenter) },
        { path: 'integracoes/ops', element: renderLazy(IntegrationsOps) },
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
      element: renderLazy(ForgotPassword),
    },
    {
      path: 'reset-password',
      element: renderLazy(ResetPassword),
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: renderLazy(NotFound) },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
