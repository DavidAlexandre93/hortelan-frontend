import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  Chip,
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
import { SECTION_CARD_SX, SECTION_CONTENT_SX, TABLE_CONTAINER_SX } from './model';

export default function AccountSessionsSection({ controller }) {
  const { sessions, logoutOthers, logoutAll } = controller;
  return (
    <>
      <Card variant="outlined" sx={SECTION_CARD_SX}>
        <CardContent sx={SECTION_CONTENT_SX}>
          <Stack spacing={2}>
            <Typography variant="h6">Controle de sessão e acesso não autorizado</Typography>
            <Typography color="text.secondary">
              Sessões inativas expiram em 30 minutos. Encerre sessões suspeitas para evitar acesso não autorizado.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <Button variant="outlined" onClick={logoutOthers}>
                Encerrar outras sessões
              </Button>
              <Button color="error" variant="outlined" onClick={logoutAll}>
                Encerrar todas as sessões
              </Button>
            </Stack>
            <TableContainer component={Paper} elevation={0} sx={TABLE_CONTAINER_SX}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sessão</TableCell>
                    <TableCell>Última atividade</TableCell>
                    <TableCell>Método</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2">{session.isCurrent ? 'Atual' : 'Remota'}</Typography>
                          {session.isCurrent && <Chip label="Atual" size="small" color="success" />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {session.userAgent}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(session.lastActiveAt).toLocaleString()}</TableCell>
                      <TableCell>{session.authMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

AccountSessionsSection.propTypes = { controller: PropTypes.object.isRequired };
