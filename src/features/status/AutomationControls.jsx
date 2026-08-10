import PropTypes from 'prop-types';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import { Alert, Box, Button, Card, CardContent, GridLegacy as Grid, Paper, Stack, Typography } from '@mui/material';
import { dateTimeFormatter } from './model';
import { dashboardCardContentSx, dashboardCardSx, sectionPaperSx } from './styles';

export default function AutomationControls({ controller }) {
  const {
    automationSuspended,
    automationSuspendedAt,
    filteredActuators,
    handleSuspendAutomation,
    handleResumeAutomation,
    handleActuatorToggle,
  } = controller;
  return (
    <>
      <Grid item xs={12}>
        <Card sx={dashboardCardSx}>
          <CardContent sx={dashboardCardContentSx}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Controles manuais e automação
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ligue/desligue atuadores manualmente e suspenda ou retome a automação quando necessário.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<PauseCircleFilledRoundedIcon />}
                onClick={handleSuspendAutomation}
                disabled={automationSuspended}
              >
                Suspender automação
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<PlayCircleFilledRoundedIcon />}
                onClick={handleResumeAutomation}
                disabled={!automationSuspended}
              >
                Retomar automação
              </Button>
            </Stack>

            <Alert severity={automationSuspended ? 'warning' : 'success'} sx={{ mb: 2 }}>
              {automationSuspended
                ? `Automação pausada desde ${dateTimeFormatter.format(new Date(automationSuspendedAt))}`
                : 'Automação ativa e monitorando atuadores automaticamente.'}
            </Alert>

            <Stack spacing={1.2}>
              {filteredActuators.map((actuator) => (
                <Paper key={actuator.id} variant="outlined" sx={sectionPaperSx}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {actuator.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {actuator.areaName} • {actuator.id}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant={actuator.isOn ? 'contained' : 'outlined'}
                      color={actuator.isOn ? 'error' : 'primary'}
                      startIcon={<PowerSettingsNewRoundedIcon fontSize="small" />}
                      onClick={() => handleActuatorToggle(actuator.id)}
                    >
                      {actuator.isOn ? 'Desligar' : 'Ligar'}
                    </Button>
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

AutomationControls.propTypes = { controller: PropTypes.object.isRequired };
