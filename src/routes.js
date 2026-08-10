import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import RequireAuth from './components/auth/RequireAuth';
import RedirectIfAuth from './components/auth/RedirectIfAuth';
import LazyRouteBoundary from './components/states/LazyRouteBoundary';
import RoutePending from './components/states/RoutePending';
import RouteMetadata from './routing/RouteMetadata';
import { dashboardRoutes, legacyAliases, publicRoutes } from './routing/routeManifest';

function LazyPage({ Component }) {
  const location = useLocation();

  return (
    <LazyRouteBoundary routeKey={location.pathname}>
      <Suspense fallback={<RoutePending />}>
        <Component />
      </Suspense>
    </LazyRouteBoundary>
  );
}

LazyPage.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

function ProtectedAlias({ destination }) {
  const { search } = useLocation();
  const safeSearch = new URLSearchParams(search);
  const retained = new URLSearchParams();

  ['tab', 'section'].forEach((key) => {
    const value = safeSearch.get(key);
    if (value && /^[a-z0-9-]{1,40}$/i.test(value)) retained.set(key, value);
  });

  const suffix = retained.toString();
  return <Navigate to={`${destination}${suffix ? `?${suffix}` : ''}`} replace />;
}

ProtectedAlias.propTypes = {
  destination: PropTypes.string.isRequired,
};

export default function Router({ ssr = false }) {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Navigate to="app" replace /> },
        ...dashboardRoutes.map(({ path, Component }) => ({ path, element: <LazyPage Component={Component} /> })),
        { path: 'user', element: <Navigate to="/dashboard/admin" replace /> },
      ],
    },
    ...publicRoutes.map(({ path, access, Component }) => ({
      path,
      element:
        access === 'anonymous' ? (
          <RedirectIfAuth>
            <LazyPage Component={Component} />
          </RedirectIfAuth>
        ) : (
          <LazyPage Component={Component} />
        ),
    })),
    ...legacyAliases.map(({ path, destination }) => ({
      path,
      element: (
        <RequireAuth>
          <ProtectedAlias destination={destination} />
        </RequireAuth>
      ),
    })),
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);

  return (
    <>
      {!ssr && <RouteMetadata />}
      {routes}
    </>
  );
}

Router.propTypes = {
  ssr: PropTypes.bool,
};
