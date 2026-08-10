import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { METHOD_LABELS, SECTION_CARD_SX, SECTION_CONTENT_SX, TABLE_CONTAINER_SX } from './model';

export default function DeviceSecuritySection({ controller }) {
  const {
    trustedDevices,
    busyAction,
    handleDeviceAction,
    rotateDeviceCredential,
    revokeCompromised,
    removeTrustedDevice,
    setDeviceConfirmation,
    consentLogs,
    user,
    history,
  } = controller;
  return (
    <>
      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          <Stack spacing={2}>
            <Typography variant="h6">Segurança de dispositivos (fase avançada)</Typography>
            <Typography color="text.secondary">
              Faça vinculação segura de dispositivos, rotação de credenciais e revogação em caso de comprometimento.
            </Typography>

            {trustedDevices.length === 0 ? (
              <Typography color="text.secondary">Nenhum dispositivo confiável cadastrado.</Typography>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={TABLE_CONTAINER_SX}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Confiado em</TableCell>
                      <TableCell>Credencial</TableCell>
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
                        <TableCell>v{device.credentialVersion || 1}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" justifyContent="flex-end" spacing={1} useFlexGap flexWrap="wrap">
                            <Button
                              size="small"
                              variant="text"
                              disabled={Boolean(busyAction)}
                              loading={busyAction === `rotate-${device.id}`}
                              onClick={() =>
                                handleDeviceAction(
                                  `rotate-${device.id}`,
                                  () => rotateDeviceCredential(device.id),
                                  'Credencial do dispositivo rotacionada.'
                                )
                              }
                            >
                              Rotacionar chave
                            </Button>
                            <Button
                              size="small"
                              color="warning"
                              variant="text"
                              disabled={Boolean(busyAction)}
                              onClick={() =>
                                setDeviceConfirmation({
                                  key: `compromise-${device.id}`,
                                  title: 'Marcar dispositivo como comprometido',
                                  confirmationName: 'COMPROMETIDO',
                                  operation: () =>
                                    revokeCompromised(device.id, 'Revogado por suspeita de comprometimento'),
                                  successMessage: 'Dispositivo marcado como comprometido e revogado.',
                                })
                              }
                            >
                              Comprometido
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="text"
                              disabled={Boolean(busyAction)}
                              onClick={() =>
                                setDeviceConfirmation({
                                  key: `revoke-${device.id}`,
                                  title: 'Revogar dispositivo confiavel',
                                  confirmationName: 'REVOGAR',
                                  operation: () => removeTrustedDevice(device.id),
                                  successMessage: 'Dispositivo confiavel revogado.',
                                })
                              }
                            >
                              Revogar
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          <Stack spacing={2}>
            <Typography variant="h6">Registro de consentimentos</Typography>
            {consentLogs?.length ? (
              <TableContainer component={Paper} elevation={0} sx={TABLE_CONTAINER_SX}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Data/Hora</TableCell>
                      <TableCell>Alterações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consentLogs.slice(0, 10).map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.changedAt).toLocaleString()}</TableCell>
                        <TableCell>{Object.keys(entry.payload || {}).join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">Sem alterações registradas.</Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          {user?.role !== 'administrator' ? (
            <Typography color="text.secondary">
              O histórico de troca de senha é visível apenas para administradores.
            </Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Políticas de senha e histórico de troca
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Política ativa: mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={TABLE_CONTAINER_SX}>
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
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

DeviceSecuritySection.propTypes = { controller: PropTypes.object.isRequired };
