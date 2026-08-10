import PropTypes from 'prop-types';
import { HelmetProvider } from 'react-helmet-async';
import ThemeProvider from '../theme';
import { AuthProvider } from '../auth/AuthContext';

export default function AppProviders({ children, helmetContext }) {
  return (
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
  helmetContext: PropTypes.object,
};
