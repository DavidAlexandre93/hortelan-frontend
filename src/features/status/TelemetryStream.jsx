import PropTypes from 'prop-types';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Alert, Box, Card, CardContent, Chip, GridLegacy as Grid, Pagination, Stack, Typography } from '@mui/material';
import { dateTimeFormatter } from './model';
import { dashboardCardContentSx, dashboardCardSx } from './styles';

export default function TelemetryStream({ controller }) {
  const {
    events,
    filteredEvents,
    paginatedEvents,
    totalEventPages,
    currentEventPage,
    setEventPage,
    MAX_STREAM_EVENTS,
    STREAM_EVENTS_PER_PAGE,
  } = controller;
  return (
    <>
      <Grid item xs={12} lg={8}>
        <Card sx={dashboardCardSx}>
          <CardContent sx={dashboardCardContentSx}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ mb: 2 }}
              spacing={1}
            >
              <Box>
                <Typography variant="h6">Lista de eventos em streaming</Typography>
                <Typography variant="body2" color="text.secondary">
                  Atualização automática a cada ~2.2s
                </Typography>
              </Box>
              <Chip
                icon={<AccessTimeRoundedIcon />}
                label={`Último: ${events[0] ? dateTimeFormatter.format(new Date(events[0].createdAt)) : '-'} • ${filteredEvents.length}/${MAX_STREAM_EVENTS}`}
              />
            </Stack>
            <Stack spacing={1.2}>
              {filteredEvents.length === 0 && <Alert severity="info">Aguardando eventos...</Alert>}
              {paginatedEvents.map((event) => (
                <Alert
                  key={event.id}
                  severity={
                    event.severity === 'success' ? 'success' : event.severity === 'warning' ? 'warning' : 'info'
                  }
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography variant="body2">
                      <strong>{event.areaName}</strong> • {event.deviceName} — {event.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dateTimeFormatter.format(new Date(event.createdAt))}
                    </Typography>
                  </Stack>
                </Alert>
              ))}
              {filteredEvents.length > STREAM_EVENTS_PER_PAGE && (
                <Stack alignItems="center" sx={{ pt: 1 }}>
                  <Pagination
                    color="primary"
                    count={totalEventPages}
                    page={currentEventPage}
                    onChange={(_, page) => setEventPage(page)}
                    size="small"
                  />
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

TelemetryStream.propTypes = { controller: PropTypes.object.isRequired };
