import {
  Alert,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import useAuth from '../auth/useAuth';
import { getPasswordChangeHistory } from '../auth/session';

const METHOD_LABELS = {
  seed: 'Inicialização do sistema',
  'reset-token': 'Redefinição por token',
};

const TWO_FACTOR_METHOD_LABELS = {
  email: 'E-mail',
  authenticator: 'App autenticador',
};

const CONSENT_LABELS = {
  marketing: 'Marketing',
  analytics: 'Analytics',
  communications: 'Comunicações',
};

export default function Security() {
  const navigate = useNavigate();
  const {
    user,
    twoFactor,
    trustedDevices,
    consents,
    deletionRequest,
    update2FASettings,
    removeTrustedDevice,
    updateConsents,
    requestDeletion,
    deactivateAccount,
    exportPersonalData,
  } = useAuth();

  const history = getPasswordChangeHistory();
  const [method, setMethod] = useState(twoFactor?.method || 'email');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [deactivationReason, setDeactivationReason] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [deactivationOpen, setDeactivationOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);

  const handleConsentToggle = (field, checked) => {
    const result = updateConsents({ [field]: checked });

    if (result.error) {
      setError(result.error);
      return;
    }

    setError('');
    setFeedback(`Consentimento de ${CONSENT_LABELS[field]} atualizado com sucesso.`);
  };

  const handleExport = () => {
    const result = exportPersonalData();

    if (result.error) {
      setError(result.error);
      return;
    }

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `hortelan-dados-pessoais-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    setError('');
    setFeedback('Arquivo de dados pessoais exportado com sucesso.');
  };

  const handleDeletionRequest = () => {
    const result = requestDeletion({ reason: deletionReason });

    if (result.error) {
      setError(result.error);
      return;
    }

    setDeletionOpen(false);
    setDeletionReason('');
    setError('');
    setFeedback('Solicitação de exclusão registrada. Nossa equipe entrará em contato.');
  };

  const handleDeactivate = () => {
    const result = deactivateAccount({ reason: deactivationReason });

    if (result.error) {
      setError(result.error);
      return;
    }

    setDeactivationOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <Page title="Segurança">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Segurança da conta</Typography>

          {feedback && <Alert severity="success">{feedback}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Autenticação em dois fatores (2FA)</Typography>
              <Typography color="text.secondary">
                Ative o segundo fator por e-mail ou app autenticador para elevar o nível de proteção do login.
              </Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    checked={Boolean(twoFactor?.enabled)}
                    onChange={(_, checked) => {
                      const result = update2FASettings({ enabled: checked, method });

                      if (!result.error) {
                        setFeedback(checked ? '2FA ativado com sucesso.' : '2FA desativado com sucesso.');
                      }
                    }}
                  />
                  <Typography>{twoFactor?.enabled ? '2FA habilitado' : '2FA desabilitado'}</Typography>
                </Stack>

                <FormControl sx={{ minWidth: 220 }} size="small" disabled={!twoFactor?.enabled}>
                  <InputLabel id="two-factor-method-label">Método</InputLabel>
                  <Select
                    labelId="two-factor-method-label"
                    label="Método"
                    value={method}
                    onChange={(event) => {
                      const nextMethod = event.target.value;
                      setMethod(nextMethod);
                      const result = update2FASettings({ enabled: true, method: nextMethod });

                      if (!result.error) {
                        setFeedback(`Método de 2FA alterado para ${TWO_FACTOR_METHOD_LABELS[nextMethod]}.`);
                      }
                    }}
                  >
                    <MenuItem value="email">E-mail</MenuItem>
                    <MenuItem value="authenticator">App autenticador</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Consentimentos e preferências</Typography>
              <Typography color="text.secondary">
                Gerencie as permissões para uso dos seus dados em campanhas, analytics e comunicações da plataforma.
              </Typography>

              <Stack spacing={1}>
                {Object.entries(CONSENT_LABELS).map(([key, label]) => (
                  <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>{label}</Typography>
                    <Switch checked={Boolean(consents?.[key])} onChange={(_, checked) => handleConsentToggle(key, checked)} />
                  </Stack>
                ))}
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Última atualização: {consents?.updatedAt ? new Date(consents.updatedAt).toLocaleString() : 'Sem registro'}
              </Typography>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">LGPD e dados pessoais</Typography>
              <Typography color="text.secondary">
                Exporte seus dados pessoais em formato JSON para atender solicitações de portabilidade (LGPD).
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" onClick={handleExport}>
                  Exportar dados pessoais
                </Button>
                <Button color="warning" variant="outlined" onClick={() => setDeactivationOpen(true)}>
                  Desativar conta
                </Button>
                <Button color="error" variant="outlined" onClick={() => setDeletionOpen(true)}>
                  Solicitar exclusão de conta
                </Button>
              </Stack>

              {deletionRequest && (
                <Alert severity="info">
                  Solicitação em andamento ({new Date(deletionRequest.requestedAt).toLocaleString()}) - status: {deletionRequest.status}.
                </Alert>
              )}

              {!user?.isActive && <Alert severity="warning">Sua conta está desativada.</Alert>}
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Dispositivos confiáveis</Typography>
              <Typography color="text.secondary">
                Dispositivos confiáveis podem pular o segundo fator enquanto o vínculo estiver válido.
              </Typography>

              {trustedDevices.length === 0 ? (
                <Typography color="text.secondary">Nenhum dispositivo confiável cadastrado.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Confiado em</TableCell>
                      <TableCell>Expira em</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trustedDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2">{device.deviceName || 'Dispositivo sem nome'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {device.userAgent}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{new Date(device.trustedAt).toLocaleString()}</TableCell>
                        <TableCell>{new Date(device.expiresAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => {
                              removeTrustedDevice(device.id);
                              setFeedback('Dispositivo removido da lista de confiança.');
                            }}
                          >
                            Revogar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            {user?.role !== 'administrator' ? (
              <Typography color="text.secondary">
                O histórico de troca de senha é visível apenas para administradores.
              </Typography>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Histórico de troca de senha
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuário</TableCell>
                      <TableCell>Método</TableCell>
                      <TableCell>Alterado por</TableCell>
                      <TableCell>Data/Hora</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.userEmail}</TableCell>
                        <TableCell>{METHOD_LABELS[entry.method] || entry.method}</TableCell>
                        <TableCell>{entry.changedBy}</TableCell>
                        <TableCell>{new Date(entry.changedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Card>
        </Stack>
      </Container>

      <Dialog open={deactivationOpen} onClose={() => setDeactivationOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Desativar conta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography color="text.secondary">
              A desativação encerra suas sessões e bloqueia novos logins até a reativação manual pelo suporte.
            </Typography>
            <TextField
              label="Motivo da desativação (opcional)"
              value={deactivationReason}
              onChange={(event) => setDeactivationReason(event.target.value)}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivationOpen(false)}>Cancelar</Button>
          <Button color="warning" variant="contained" onClick={handleDeactivate}>
            Confirmar desativação
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deletionOpen} onClose={() => setDeletionOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Solicitar exclusão de conta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography color="text.secondary">
              Sua solicitação será registrada e analisada conforme os critérios de retenção legal aplicáveis.
            </Typography>
            <TextField
              label="Motivo da solicitação (opcional)"
              value={deletionReason}
              onChange={(event) => setDeletionReason(event.target.value)}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletionOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeletionRequest}>
            Confirmar solicitação
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
