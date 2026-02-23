import {
  Alert,
  Button,
  Card,
  Container,
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
  Typography,
} from '@mui/material';
import { useState } from 'react';
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

export default function Security() {
  const { user, twoFactor, trustedDevices, update2FASettings, removeTrustedDevice } = useAuth();

  const history = getPasswordChangeHistory();
  const [method, setMethod] = useState(twoFactor?.method || 'email');
  const [feedback, setFeedback] = useState('');

  return (
    <Page title="Segurança">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Segurança da conta</Typography>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Autenticação em dois fatores (2FA)</Typography>
              <Typography color="text.secondary">
                Ative o segundo fator por e-mail ou app autenticador para elevar o nível de proteção do login.
              </Typography>

              {feedback && <Alert severity="success">{feedback}</Alert>}

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
    </Page>
  );
}
