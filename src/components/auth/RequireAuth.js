import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import { GuardPending } from '../states/RoutePending';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const { authenticated, initialized } = useAuth();

  if (!initialized) {
    return <GuardPending />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
