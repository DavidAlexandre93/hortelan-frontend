import PropTypes from 'prop-types';
import { Component } from 'react';
import * as Sentry from '@sentry/react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } });
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Box component="main" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 560 }}>
          <Alert severity="error" variant="outlined">
            Nao foi possivel concluir esta tela.
          </Alert>
          <Typography variant="h3" component="h1">
            Vamos tentar de novo
          </Typography>
          <Typography color="text.secondary">
            Seus dados nao foram alterados. Tente recarregar a interface ou volte ao painel principal.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={this.handleRetry}>
              Tentar novamente
            </Button>
            <Button variant="outlined" href="/dashboard/app">
              Ir ao monitoramento
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }
}

GlobalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
