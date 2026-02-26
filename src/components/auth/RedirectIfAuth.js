import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/useAuth';

export default function RedirectIfAuth({ children }) {
  const location = useLocation();
  const { authenticated } = useAuth();
  const forceLogin = Boolean(location.state?.forceLogin);

  if (authenticated && !forceLogin) {
    return <Navigate to="/dashboard/app" replace />;
  }

  return children;
}

RedirectIfAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
