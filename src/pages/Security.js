import { Card, Container, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Page from '../components/Page';
import useAuth from '../auth/useAuth';
import { getPasswordChangeHistory } from '../auth/session';

const METHOD_LABELS = {
  seed: 'Inicialização do sistema',
  'reset-token': 'Redefinição por token',
};

export default function Security() {
  const { user } = useAuth();

  const history = getPasswordChangeHistory();

  return (
    <Page title="Segurança">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Segurança de senha</Typography>

          <Card sx={{ p: 3 }}>
            {user?.role !== 'administrator' ? (
              <Typography color="text.secondary">
                O histórico de troca de senha é visível apenas para administradores.
              </Typography>
            ) : (
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
            )}
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
