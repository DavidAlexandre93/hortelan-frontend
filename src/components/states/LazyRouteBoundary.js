import PropTypes from 'prop-types';
import { Component } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const CHUNK_ERROR_PATTERN =
  /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed|module script.*failed/i;

export function isChunkLoadError(error) {
  return CHUNK_ERROR_PATTERN.test(error?.name || '') || CHUNK_ERROR_PATTERN.test(error?.message || '');
}

export default class LazyRouteBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.routeKey !== this.props.routeKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    if (!isChunkLoadError(this.state.error)) {
      throw this.state.error;
    }

    return (
      <Box component="main" sx={{ minHeight: '55vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Stack spacing={2} sx={{ maxWidth: 560 }}>
          <Alert severity="warning">Esta pagina nao terminou de carregar.</Alert>
          <Typography variant="h4">Vamos tentar novamente</Typography>
          <Typography color="text.secondary">
            A conexao pode ter oscilado durante a atualizacao do aplicativo. Nenhum dado foi alterado.
          </Typography>
          <Button startIcon={<RefreshRoundedIcon />} variant="contained" onClick={() => window.location.reload()}>
            Recarregar pagina
          </Button>
        </Stack>
      </Box>
    );
  }
}

LazyRouteBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  routeKey: PropTypes.string.isRequired,
};
