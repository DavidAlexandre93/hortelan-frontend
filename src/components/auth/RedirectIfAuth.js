import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';

export default function RedirectIfAuth({ children }) {
  const { authenticated } = useAuth();

  if (authenticated) {
    return <Navigate to="/dashboard/app" replace />;
  }

  return children;
}

RedirectIfAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
