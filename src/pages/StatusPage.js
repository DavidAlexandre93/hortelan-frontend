import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import Page from '../components/Page';

const featureStatus = [
  { name: 'Monitoring', status: 'operational' },
  { name: 'Garden', status: 'operational' },
  { name: 'Ecommerce Gardens', status: 'operational' },
  { name: 'Onboarding', status: 'operational' },
  { name: 'Hortelan 360', status: 'operational' },
  { name: 'Community', status: 'failed' },
];

const STATUS_URL = 'https://hortelan.vercel.app/404';

export default function StatusPage() {
  const failedFeatures = featureStatus.filter((feature) => feature.status === 'failed');

  return (
    <Page title="Status">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Status Page</Typography>
          <Grid container spacing={3}>
            {featureStatus.map((feature) => {
              const isOperational = feature.status === 'operational';

              return (
                <Grid item xs={12} md={6} key={feature.name}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">{feature.name}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 1,
                            color: isOperational ? 'success.dark' : 'error.dark',
                            bgcolor: isOperational ? 'success.lighter' : 'error.lighter',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: 0.5,
                          }}
                        >
                          {feature.status}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {failedFeatures.length > 0 && (
            <Stack spacing={2}>
              <Alert severity="error">
                Funcionalidades com status <strong>failed</strong> exibem a tela 404 em{' '}
                <Link href={STATUS_URL} target="_blank" rel="noopener noreferrer">
                  {STATUS_URL}
                </Link>
                .
              </Alert>

              <Box
                component="iframe"
                src={STATUS_URL}
                title="Hortelan 404"
                sx={{ width: '100%', height: 540, border: 0, borderRadius: 2 }}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </Page>
  );
}
