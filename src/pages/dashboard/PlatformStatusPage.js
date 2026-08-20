import { useEffect, useMemo, useState } from 'react';
import { Box, Container, GridLegacy as Grid, Stack, Typography } from '@mui/material';
import Page from '../../components/Page';
import StatusSummary from '../../features/status/StatusSummary';
import AutomationControls from '../../features/status/AutomationControls';
import AreaServiceMap from '../../features/status/AreaServiceMap';
import TelemetryStream from '../../features/status/TelemetryStream';
import OperationsHistory from '../../features/status/OperationsHistory';
import useOperationalMonitoring from '../../features/status/useOperationalMonitoring';
import { ErrorState, LoadingState } from '../../components/states/OperationalState';

import {
  buildInitialActuators,
  buildInitialAlerts,
  greenhouseAreas,
  randomItem,
  ruleExecutions,
  streamTemplates,
} from '../../features/status/model';

export default function StatusPage() {
  const MAX_STREAM_EVENTS = 100;
  const STREAM_EVENTS_PER_PAGE = 10;

  const [selectedArea, setSelectedArea] = useState('all');
  const [events, setEvents] = useState([]);
  const [eventPage, setEventPage] = useState(1);
  const [alerts, setAlerts] = useState(() => buildInitialAlerts());
  const [actuators, setActuators] = useState(() => buildInitialActuators());
  const [automationSuspendedAt, setAutomationSuspendedAt] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const operational = useOperationalMonitoring();

  const automationSuspended = Boolean(automationSuspendedAt);

  useEffect(() => {
    const interval = setInterval(() => {
      const area = randomItem(greenhouseAreas);
      const device = randomItem(area.devices);
      const availableTemplates = automationSuspended
        ? streamTemplates.filter((template) => template.type !== 'actuator')
        : streamTemplates;
      const template = randomItem(availableTemplates);
      const createdAt = new Date().toISOString();

      const event = {
        id: `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt,
        areaId: area.id,
        areaName: area.name,
        deviceName: device.name,
        severity: template.severity,
        message: `${template.text} em ${device.name}`,
      };

      setEvents((prev) => [event, ...prev].slice(0, MAX_STREAM_EVENTS));

      if (template.type === 'alert' && Math.random() > 0.45) {
        setAlerts((prev) => [
          {
            id: `${event.id}-alert`,
            areaId: area.id,
            areaName: area.name,
            deviceName: device.name,
            message: `Novo alerta automático: ${device.name} exige inspeção imediata`,
            severity: area.status === 'critical' ? 'error' : 'warning',
            acknowledgedAt: null,
          },
          ...prev,
        ]);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [automationSuspended]);

  const filteredEvents = useMemo(
    () => (selectedArea === 'all' ? events : events.filter((event) => event.areaId === selectedArea)),
    [events, selectedArea]
  );

  const filteredAlerts = useMemo(
    () => (selectedArea === 'all' ? alerts : alerts.filter((alert) => alert.areaId === selectedArea)),
    [alerts, selectedArea]
  );
  const totalEventPages = Math.max(1, Math.ceil(filteredEvents.length / STREAM_EVENTS_PER_PAGE));
  const currentEventPage = Math.min(eventPage, totalEventPages);
  const paginatedEvents = useMemo(() => {
    const start = (currentEventPage - 1) * STREAM_EVENTS_PER_PAGE;
    return filteredEvents.slice(start, start + STREAM_EVENTS_PER_PAGE);
  }, [currentEventPage, filteredEvents]);

  const activeAlerts = filteredAlerts.filter((alert) => !alert.acknowledgedAt);
  const ackedAlerts = filteredAlerts.filter((alert) => alert.acknowledgedAt);
  const filteredRuleExecutions = useMemo(
    () =>
      selectedArea === 'all' ? ruleExecutions : ruleExecutions.filter((execution) => execution.areaId === selectedArea),
    [selectedArea]
  );

  const successfulExecutions = filteredRuleExecutions.filter((execution) => execution.status === 'success').length;
  const failedExecutions = filteredRuleExecutions.filter((execution) => execution.status === 'failed').length;
  const filteredActuators =
    selectedArea === 'all' ? actuators : actuators.filter((actuator) => actuator.areaId === selectedArea);
  const filteredInterventions =
    selectedArea === 'all'
      ? interventions
      : interventions.filter((entry) => entry.areaId === selectedArea || entry.areaId === 'global');

  const totalDevices = greenhouseAreas.reduce((acc, area) => acc + area.devices.length, 0);
  const offlineDevices = greenhouseAreas.reduce(
    (acc, area) => acc + area.devices.filter((device) => device.connectionStatus === 'offline').length,
    0
  );

  const handleAck = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledgedAt: new Date().toISOString(),
            }
          : alert
      )
    );
  };

  const appendIntervention = ({
    areaId = 'global',
    areaName = 'Todas as áreas',
    type,
    description,
    deviceName = '-',
  }) => {
    const createdAt = new Date().toISOString();

    setInterventions((prev) => [
      {
        id: `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt,
        areaId,
        areaName,
        type,
        description,
        deviceName,
      },
      ...prev,
    ]);
  };

  const handleActuatorToggle = (actuatorId) => {
    setActuators((prev) =>
      prev.map((actuator) => {
        if (actuator.id !== actuatorId) {
          return actuator;
        }

        const nextState = !actuator.isOn;
        appendIntervention({
          areaId: actuator.areaId,
          areaName: actuator.areaName,
          type: nextState ? 'LIGAR_ATUADOR' : 'DESLIGAR_ATUADOR',
          description: `Atuador ${nextState ? 'ligado' : 'desligado'} manualmente`,
          deviceName: actuator.name,
        });

        return {
          ...actuator,
          isOn: nextState,
        };
      })
    );
  };

  const handleSuspendAutomation = () => {
    if (automationSuspended) {
      return;
    }

    const suspendedAt = new Date().toISOString();
    setAutomationSuspendedAt(suspendedAt);
    appendIntervention({
      type: 'SUSPENDER_AUTOMACAO',
      description: 'Automação suspensa temporariamente por intervenção manual',
    });
  };

  const handleResumeAutomation = () => {
    if (!automationSuspended) {
      return;
    }

    setAutomationSuspendedAt(null);
    appendIntervention({
      type: 'RETOMAR_AUTOMACAO',
      description: 'Automação retomada e controle automático restabelecido',
    });
  };

  if (operational.status === 'loading') {
    return (
      <Page title="Status operacional">
        <Container maxWidth="xl">
          <LoadingState label="Conectando ao monitoramento" />
        </Container>
      </Page>
    );
  }

  if (operational.status === 'error') {
    return (
      <Page title="Status operacional">
        <Container maxWidth="xl">
          <ErrorState
            description={operational.error?.message}
            incidentId={operational.error?.incidentId}
            onRetry={() => operational.retry()}
          />
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Status operacional">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Monitoramento em tempo real
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Painel consolidado de estufas, sensores, atuadores e fluxo de eventos.
            </Typography>
          </Box>

          <StatusSummary
            controller={{ totalDevices, offlineDevices, activeAlerts, selectedArea, setSelectedArea, setEventPage }}
          />
          <Grid container spacing={3}>
            <AutomationControls
              controller={{
                automationSuspended,
                automationSuspendedAt,
                filteredActuators,
                handleSuspendAutomation,
                handleResumeAutomation,
                handleActuatorToggle,
              }}
            />
            <AreaServiceMap controller={{ selectedArea }} />
            <TelemetryStream
              controller={{
                events,
                filteredEvents,
                paginatedEvents,
                totalEventPages,
                currentEventPage,
                setEventPage,
                MAX_STREAM_EVENTS,
                STREAM_EVENTS_PER_PAGE,
              }}
            />
          </Grid>

          <OperationsHistory
            controller={{
              successfulExecutions,
              failedExecutions,
              filteredRuleExecutions,
              filteredInterventions,
              activeAlerts,
              ackedAlerts,
              handleAck,
            }}
          />
        </Stack>
      </Container>
    </Page>
  );
}
