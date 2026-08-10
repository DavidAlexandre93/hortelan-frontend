import { Box, LinearProgress, Skeleton, Stack } from '@mui/material';

export function GuardPending() {
  return (
    <Box
      role="status"
      aria-label="Validando sessao"
      sx={{ position: 'fixed', inset: 0, bgcolor: 'background.default' }}
    >
      <LinearProgress color="primary" />
    </Box>
  );
}

export default function RoutePending() {
  return (
    <Stack role="status" aria-label="Carregando pagina" spacing={2.5} sx={{ width: 1, maxWidth: 1440, mx: 'auto' }}>
      <Skeleton variant="rounded" height={104} />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}
      >
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} variant="rounded" height={132} />
        ))}
      </Box>
      <Skeleton variant="rounded" height={320} />
    </Stack>
  );
}
