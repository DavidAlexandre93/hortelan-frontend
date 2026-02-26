import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import { LoginForm } from './sections/auth/login';
import NotFound from './pages/Page404';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Hortelan360 from './pages/Hortelan360';
import Onboarding from './pages/Onboarding';
import StatusPage from './pages/StatusPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Security from './pages/Security';
import ProfileSettings from './pages/ProfileSettings';
import AlertCenter from './pages/AlertCenter';
import Reports from './pages/Reports';
import Subscriptions from './pages/Subscriptions';
import HelpCenter from './pages/HelpCenter';
import IntegrationsOps from './pages/IntegrationsOps';
import Integrations from './pages/Integrations';
import RequireAuth from './components/auth/RequireAuth';
import RedirectIfAuth from './components/auth/RedirectIfAuth';

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
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'hortelan-360', element: <Hortelan360 /> },
        { path: 'onboarding', element: <Onboarding /> },
        { path: 'status', element: <StatusPage /> },
        { path: 'security', element: <Security /> },
        { path: 'profile', element: <ProfileSettings /> },
        { path: 'alertas', element: <AlertCenter /> },
        { path: 'relatorios', element: <Reports /> },
        { path: 'assinaturas', element: <Subscriptions /> },
        { path: 'integracoes', element: <Integrations /> },
        { path: 'suporte', element: <HelpCenter /> },
        { path: 'integracoes', element: <IntegrationsOps /> },
      ],
    },
    {
      path: 'login',
      element: (
        <RedirectIfAuth>
          <LoginForm />
        </RedirectIfAuth>
      ),
    },
    {
      path: 'register',
      element: (
        <RedirectIfAuth>
          <LoginForm />
        </RedirectIfAuth>
      ),
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: 'reset-password',
      element: <ResetPassword />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
