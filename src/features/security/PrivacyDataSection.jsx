import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { CONSENT_LABELS, SECTION_CARD_SX, SECTION_CONTENT_SX } from './model';

export default function PrivacyDataSection({ controller }) {
  const {
    consents,
    busyAction,
    handleConsentToggle,
    handleExport,
    setDeletionOpen,
    setDeactivationOpen,
    retentionPolicy,
    deletionRequest,
    user,
    runAction,
    updateConsents,
    setError,
    setFeedback,
  } = controller;
  return (
    <>
      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          <Stack spacing={2}>
            <Typography variant="h6">Privacidade e consentimento</Typography>
            <Typography color="text.secondary">
              Gerencie cookies, notificações e uso de dados analíticos conforme suas preferências de privacidade.
            </Typography>

            <Stack spacing={1}>
              {Object.entries(CONSENT_LABELS).map(([key, label]) => (
                <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography>{label}</Typography>
                  <Switch
                    checked={Boolean(consents?.[key])}
                    disabled={Boolean(busyAction)}
                    onChange={(_, checked) => handleConsentToggle(key, checked)}
                  />
                </Stack>
              ))}
            </Stack>

            <FormControl size="small" sx={{ maxWidth: 280 }}>
              <InputLabel id="privacy-mode-label">Preferência de privacidade</InputLabel>
              <Select
                labelId="privacy-mode-label"
                label="Preferência de privacidade"
                value={consents?.privacyMode || 'balanced'}
                disabled={Boolean(busyAction)}
                onChange={async (event) => {
                  const nextMode = event.target.value;
                  const result = await runAction('privacy-mode', () => updateConsents({ privacyMode: nextMode }));
                  if (result.error) setError(result.error);
                  else setFeedback(`Preferência de privacidade alterada para ${nextMode}.`);
                }}
              >
                <MenuItem value="restricted">Restrita</MenuItem>
                <MenuItem value="balanced">Balanceada</MenuItem>
                <MenuItem value="personalized">Personalizada</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary">
              Última atualização: {consents?.updatedAt ? new Date(consents.updatedAt).toLocaleString() : 'Sem registro'}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          <Stack spacing={2}>
            <Typography variant="h6">LGPD e dados pessoais</Typography>
            <Typography color="text.secondary">
              Exporte, solicite exclusão e acompanhe retenção de dados com trilha de consentimentos.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <Button
                variant="contained"
                onClick={handleExport}
                loading={busyAction === 'export'}
                disabled={Boolean(busyAction) && busyAction !== 'export'}
              >
                Exportar dados pessoais
              </Button>
              <Button
                color="warning"
                variant="outlined"
                onClick={() => setDeactivationOpen(true)}
                disabled={Boolean(busyAction)}
              >
                Desativar conta
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setDeletionOpen(true)}
                disabled={Boolean(busyAction)}
              >
                Solicitar exclusão de conta
              </Button>
            </Stack>

            {deletionRequest && (
              <Alert severity="info">
                Solicitação em andamento ({new Date(deletionRequest.requestedAt).toLocaleString()}) - status:{' '}
                {deletionRequest.status}.
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary">
              Política de retenção: {retentionPolicy?.retentionDays} dias ({retentionPolicy?.legalBasis}).
            </Typography>

            {user?.isActive === false && <Alert severity="warning">Sua conta está desativada.</Alert>}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

PrivacyDataSection.propTypes = { controller: PropTypes.object.isRequired };
