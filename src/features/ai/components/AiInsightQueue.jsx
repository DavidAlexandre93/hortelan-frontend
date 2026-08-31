import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { writeAiPreferences } from '../preferences';
import { getAiCapabilities, listProactiveInsights, updateProactiveInsight } from '../service';
import AiCitationList from './AiCitationList';

const urgencyColor = { info: 'info', attention: 'warning', important: 'error' };

export default function AiInsightQueue() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const capabilities = await getAiCapabilities();
      if (!capabilities.available || !capabilities.features.proactiveInsights) {
        setInsights([]);
        return;
      }
      const response = await listProactiveInsights();
      const deduplicated = [...new Map(response.insights.map((insight) => [insight.id, insight])).values()];
      setInsights(deduplicated);
    } catch (requestError) {
      setError(requestError.message || 'Nao foi possivel carregar os insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadInitial() {
      try {
        const capabilities = await getAiCapabilities();
        if (!capabilities.available || !capabilities.features.proactiveInsights) return;
        const response = await listProactiveInsights();
        if (!active) return;
        const deduplicated = [...new Map(response.insights.map((insight) => [insight.id, insight])).values()];
        setInsights(deduplicated);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Nao foi possivel carregar os insights.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      active = false;
    };
  }, []);

  const dismiss = async (insight) => {
    try {
      await updateProactiveInsight(insight.id, 'dismiss');
      setInsights((current) => current.filter((item) => item.id !== insight.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const mute = async (insight) => {
    try {
      await updateProactiveInsight(insight.id, 'mute');
      writeAiPreferences({ mutedInsightTriggers: [insight.trigger] });
      setInsights((current) => current.filter((item) => item.trigger !== insight.trigger));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!loading && !error && !insights.length) return null;

  return (
    <Box component="section" aria-labelledby="ai-insights-title" sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <AutoAwesomeRoundedIcon color="primary" />
        <Typography id="ai-insights-title" variant="h6" sx={{ flex: 1 }}>Insights para revisar</Typography>
        <Tooltip title="Atualizar insights">
          <IconButton onClick={load} aria-label="Atualizar insights" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : <RefreshRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
      {error ? <Alert severity="info">{error}</Alert> : null}
      <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
        {insights.map((insight) => (
          <Box key={insight.id} sx={{ py: 1.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'flex-start' }} gap={1.5}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" gap={0.75} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                  <Chip size="small" color={urgencyColor[insight.urgency]} label={insight.urgency} />
                  <Chip size="small" variant="outlined" label={insight.freshness === 'fresh' ? 'Dados atuais' : 'Dados desatualizados'} />
                  <Chip size="small" variant="outlined" label={`Incerteza ${insight.uncertainty}`} />
                </Stack>
                <Typography variant="subtitle2">{insight.title}</Typography>
                <Typography variant="body2" color="text.secondary">{insight.summary}</Typography>
                <Typography variant="caption" color="text.secondary">Motivo: {insight.reasonCode}</Typography>
              </Box>
              <Stack direction="row" gap={0.5}>
                <Button size="small" onClick={() => setExpanded(expanded === insight.id ? null : insight.id)}>
                  {expanded === insight.id ? 'Ocultar fontes' : 'Ver fontes'}
                </Button>
                <Tooltip title="Silenciar este tipo">
                  <IconButton size="small" onClick={() => mute(insight)} aria-label={`Silenciar ${insight.title}`}>
                    <NotificationsOffOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Dispensar">
                  <IconButton size="small" onClick={() => dismiss(insight)} aria-label={`Dispensar ${insight.title}`}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            <Collapse in={expanded === insight.id}>
              <AiCitationList citations={insight.evidence} />
            </Collapse>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
