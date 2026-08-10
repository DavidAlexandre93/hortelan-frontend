import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import { resolvePostAuthDestination } from '../../utils/authRedirect';
import { GuardPending } from '../states/RoutePending';

export default function RedirectIfAuth({ children }) {
  const location = useLocation();
  const { authenticated, initialized } = useAuth();
  const forceLogin = Boolean(location.state?.forceLogin);

  if (!initialized) {
    return <GuardPending />;
  }

  if (authenticated && !forceLogin) {
    const destination = resolvePostAuthDestination({
      search: location.search,
      stateFrom: location.state?.from,
    });
    return <Navigate to={destination} replace />;
  }

  return children;
}

RedirectIfAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
