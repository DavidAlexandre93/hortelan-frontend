import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Hortelan360 from './pages/Hortelan360';
import Onboarding from './pages/Onboarding';
import StatusPage from './pages/StatusPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Security from './pages/Security';
import ProfileSettings from './pages/ProfileSettings';
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
      ],
    },
    {
      path: 'login',
      element: (
        <RedirectIfAuth>
          <Login />
        </RedirectIfAuth>
      ),
    },
    {
      path: 'register',
      element: (
        <RedirectIfAuth>
          <Register />
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
