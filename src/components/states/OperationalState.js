import PropTypes from 'prop-types';
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import useOnlineStatus from '../../hooks/useOnlineStatus';

function StateFrame({ icon, title, description, action }) {
  return (
    <Box
      role="status"
      sx={{
        minHeight: 220,
        display: 'grid',
        placeItems: 'center',
        py: 5,
        px: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Stack alignItems="center" spacing={1.5} sx={{ maxWidth: 480, textAlign: 'center' }}>
        <Box sx={{ color: 'text.secondary', display: 'grid', placeItems: 'center' }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        {action}
      </Stack>
    </Box>
  );
}

StateFrame.propTypes = {
  action: PropTypes.node,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export function LoadingState({ label = 'Carregando dados' }) {
  return (
    <StateFrame
      icon={<CircularProgress size={28} />}
      title={label}
      description="Isso deve levar apenas alguns instantes."
    />
  );
}

LoadingState.propTypes = { label: PropTypes.string };

export function EmptyState({
  title = 'Nenhum resultado',
  description = 'Ajuste os filtros ou adicione o primeiro item.',
  action,
}) {
  return (
    <StateFrame icon={<InboxRoundedIcon fontSize="large" />} title={title} description={description} action={action} />
  );
}

EmptyState.propTypes = { action: PropTypes.node, description: PropTypes.string, title: PropTypes.string };

export function ErrorState({
  onRetry,
  incidentId,
  title = 'Nao foi possivel carregar',
  description = 'Tente novamente. Se o problema continuar, procure o suporte.',
}) {
  return (
    <StateFrame
      icon={<ErrorOutlineRoundedIcon color="error" fontSize="large" />}
      title={title}
      description={description}
      action={
        <Stack alignItems="center" spacing={1}>
          {incidentId ? <Chip size="small" variant="outlined" label={`Referencia ${incidentId}`} /> : null}
          {onRetry ? (
            <Button startIcon={<RefreshRoundedIcon />} variant="outlined" onClick={onRetry}>
              Tentar novamente
            </Button>
          ) : null}
        </Stack>
      }
    />
  );
}

ErrorState.propTypes = {
  description: PropTypes.string,
  incidentId: PropTypes.string,
  onRetry: PropTypes.func,
  title: PropTypes.string,
};

export function PermissionState() {
  return (
    <StateFrame
      icon={<LockOutlinedIcon fontSize="large" />}
      title="Acesso restrito"
      description="Solicite a um administrador a permissao necessaria para continuar."
    />
  );
}

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <Alert severity="warning" icon={<CloudOffRoundedIcon />} sx={{ borderRadius: 0 }}>
      Voce esta offline. Dados salvos continuam disponiveis, mas novas alteracoes aguardam conexao.
    </Alert>
  );
}

const severityColor = { critical: 'error', warning: 'warning', healthy: 'success', info: 'info', neutral: 'default' };

export function StatusBadge({ label, severity = 'neutral' }) {
  return (
    <Chip
      size="small"
      label={label}
      color={severityColor[severity]}
      variant={severity === 'neutral' ? 'outlined' : 'filled'}
    />
  );
}

StatusBadge.propTypes = {
  label: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(Object.keys(severityColor)),
};
