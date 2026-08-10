import PropTypes from 'prop-types';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
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
import { dateTimeFormatter } from './model';
import { dashboardCardContentSx, dashboardCardSx } from './styles';

export default function OperationsHistory({ controller }) {
  const {
    successfulExecutions,
    failedExecutions,
    filteredRuleExecutions,
    filteredInterventions,
    activeAlerts,
    ackedAlerts,
    handleAck,
  } = controller;
  return (
    <>
      <Card sx={dashboardCardSx}>
        <CardContent sx={dashboardCardContentSx}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ mb: 2 }}
            spacing={1.5}
          >
            <Box>
              <Typography variant="h6">Histórico de execuções de regras</Typography>
              <Typography variant="body2" color="text.secondary">
                Execuções com sucesso/falha, motivo da execução e responsáveis pela criação/edição da regra.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip color="success" label={`Sucesso: ${successfulExecutions}`} />
              <Chip color="error" label={`Falha: ${failedExecutions}`} />
            </Stack>
          </Stack>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Regra</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Motivo da execução</TableCell>
                  <TableCell>Criada por</TableCell>
                  <TableCell>Editada por</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRuleExecutions.map((execution) => (
                  <TableRow key={execution.id} hover>
                    <TableCell>{dateTimeFormatter.format(new Date(execution.executedAt))}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {execution.ruleName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {execution.areaName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={execution.status === 'success' ? 'success' : 'error'}
                        label={execution.status === 'success' ? 'Bem-sucedida' : 'Falha'}
                      />
                    </TableCell>
                    <TableCell>{execution.reason}</TableCell>
                    <TableCell>{execution.createdBy}</TableCell>
                    <TableCell>{execution.editedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <HistoryRoundedIcon color="action" />
            <Typography variant="h6">Registro de intervenções manuais</Typography>
          </Stack>

          <Stack spacing={1.2}>
            {filteredInterventions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma intervenção manual registrada no filtro atual.
              </Typography>
            )}
            {filteredInterventions.map((entry) => (
              <Alert key={entry.id} severity="info">
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="body2">
                    <strong>{entry.type}</strong> • {entry.areaName} • {entry.deviceName} — {entry.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dateTimeFormatter.format(new Date(entry.createdAt))}
                  </Typography>
                </Stack>
              </Alert>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={dashboardCardSx}>
        <CardContent sx={dashboardCardContentSx}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ack de alertas
          </Typography>

          {activeAlerts.length === 0 ? (
            <Alert icon={<TaskAltRoundedIcon />} severity="success" sx={{ mb: 2 }}>
              Nenhum alerta pendente para ack no filtro atual.
            </Alert>
          ) : (
            <Stack spacing={1.2} sx={{ mb: 2 }}>
              {activeAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.severity === 'error' ? 'error' : 'warning'}
                  icon={<NotificationsActiveRoundedIcon />}
                  action={
                    <Button color="inherit" size="small" onClick={() => handleAck(alert.id)}>
                      ACK
                    </Button>
                  }
                >
                  <Typography variant="body2">
                    <strong>{alert.areaName}</strong> • {alert.deviceName} — {alert.message}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Histórico de alertas com ack ({ackedAlerts.length})
          </Typography>
          <Stack spacing={1}>
            {ackedAlerts.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Ainda não há alertas reconhecidos.
              </Typography>
            )}
            {ackedAlerts.map((alert) => (
              <Alert key={alert.id} severity="success" icon={<TaskAltRoundedIcon />}>
                <Typography variant="body2">
                  {alert.areaName} • {alert.deviceName} reconhecido em{' '}
                  {dateTimeFormatter.format(new Date(alert.acknowledgedAt))}
                </Typography>
              </Alert>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

OperationsHistory.propTypes = { controller: PropTypes.object.isRequired };
