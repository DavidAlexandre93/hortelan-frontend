import PropTypes from 'prop-types';
import { Alert, Box, Button, Divider, Stack, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

export default function AiConsentNotice({ capabilities, contextLabel, onAccept, onDecline }) {
  return (
    <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 560, mx: 'auto', my: 'auto' }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.lighter',
          color: 'primary.dark',
        }}
      >
        <VerifiedUserOutlinedIcon />
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          Antes de comecar
        </Typography>
        <Typography color="text.secondary">
          A inteligencia Hortelan usa dados autorizados e fontes revisadas para apoiar sua decisao. Revise sempre as
          evidencias antes de agir.
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle2">Contexto desta pergunta</Typography>
          <Typography variant="body2" color="text.secondary">
            {contextLabel}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Processamento</Typography>
          <Typography variant="body2" color="text.secondary">
            Categoria: {capabilities.consent.processorCategory}. Politica {capabilities.consent.policyVersion}.
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Retencao e exclusao</Typography>
          <Typography variant="body2" color="text.secondary">
            {capabilities.retention.summary}
          </Typography>
        </Box>
      </Stack>
      <Alert severity="info" icon={<LockOutlinedIcon />}>
        Senhas, codigos MFA, chaves privadas e dados de pagamento nao devem ser enviados.
      </Alert>
      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" gap={1}>
        <Button color="inherit" onClick={onDecline}>
          Agora nao
        </Button>
        <Button variant="contained" onClick={onAccept}>
          Concordar e continuar
        </Button>
      </Stack>
    </Stack>
  );
}

AiConsentNotice.propTypes = {
  capabilities: PropTypes.shape({
    consent: PropTypes.shape({ processorCategory: PropTypes.string, policyVersion: PropTypes.string }).isRequired,
    retention: PropTypes.shape({ summary: PropTypes.string }).isRequired,
  }).isRequired,
  contextLabel: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};
