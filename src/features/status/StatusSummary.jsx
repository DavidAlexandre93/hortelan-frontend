import PropTypes from 'prop-types';
import RouterIcon from '@mui/icons-material/Router';
import SensorsIcon from '@mui/icons-material/Sensors';
import {
  Card,
  CardContent,
  Chip,
  FormControl,
  GridLegacy as Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { areaStatusConfig, greenhouseAreas } from './model';
import { dashboardCardContentSx, dashboardCardSx } from './styles';

export default function StatusSummary({ controller }) {
  const { totalDevices, offlineDevices, activeAlerts, selectedArea, setSelectedArea, setEventPage } = controller;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={dashboardCardSx}>
            <CardContent sx={dashboardCardContentSx}>
              <Typography variant="subtitle2" color="text.secondary">
                Áreas monitoradas
              </Typography>
              <Typography variant="h4">{greenhouseAreas.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={dashboardCardSx}>
            <CardContent sx={dashboardCardContentSx}>
              <Typography variant="subtitle2" color="text.secondary">
                Dispositivos totais
              </Typography>
              <Typography variant="h4">{totalDevices}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={dashboardCardSx}>
            <CardContent sx={dashboardCardContentSx}>
              <Typography variant="subtitle2" color="text.secondary">
                Dispositivos offline
              </Typography>
              <Typography variant="h4" color={offlineDevices > 0 ? 'error.main' : 'success.main'}>
                {offlineDevices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={dashboardCardSx}>
            <CardContent sx={dashboardCardContentSx}>
              <Typography variant="subtitle2" color="text.secondary">
                Alertas pendentes
              </Typography>
              <Typography variant="h4">{activeAlerts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="status-area-filter-label">Filtrar área</InputLabel>
            <Select
              labelId="status-area-filter-label"
              value={selectedArea}
              label="Filtrar área"
              onChange={(event) => {
                setSelectedArea(event.target.value);
                setEventPage(1);
              }}
            >
              <MenuItem value="all">Todas as áreas</MenuItem>
              {greenhouseAreas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {Object.entries(areaStatusConfig).map(([status, config]) => (
              <Chip key={status} color={config.color} icon={<config.icon fontSize="small" />} label={config.label} />
            ))}
            <Chip icon={<SensorsIcon fontSize="small" />} label="Sensores" variant="outlined" />
            <Chip icon={<RouterIcon fontSize="small" />} label="Atuadores" variant="outlined" />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

StatusSummary.propTypes = { controller: PropTypes.object.isRequired };
