import PropTypes from 'prop-types';
import { Box, Card, CardContent, Chip, GridLegacy as Grid, Paper, Stack, Typography } from '@mui/material';
import { areaStatusConfig, greenhouseAreas } from './model';
import { dashboardCardContentSx, dashboardCardSx, sectionPaperSx } from './styles';

export default function AreaServiceMap({ controller }) {
  const { selectedArea } = controller;
  return (
    <>
      <Grid item xs={12} lg={4}>
        <Card sx={dashboardCardSx}>
          <CardContent sx={dashboardCardContentSx}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mapa de hortas e dispositivos
            </Typography>
            <Stack spacing={1.2}>
              {greenhouseAreas
                .filter((area) => selectedArea === 'all' || area.id === selectedArea)
                .map((area) => (
                  <Paper key={area.id} variant="outlined" sx={sectionPaperSx}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography fontWeight={700}>{area.name}</Typography>
                      </Box>
                      <Chip
                        size="small"
                        color={areaStatusConfig[area.status].color}
                        label={areaStatusConfig[area.status].label}
                      />
                    </Stack>
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      {area.devices.map((device) => (
                        <Typography key={device.id} variant="body2" color="text.secondary">
                          • {device.name} ({device.id}) — {device.connectionStatus}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

AreaServiceMap.propTypes = { controller: PropTypes.object.isRequired };
