import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Slide,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { dashboardRoutes } from '../../routing/routeManifest';

const SearchLayer = styled('section')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 99,
  minHeight: 68,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.99),
  [theme.breakpoints.up('md')]: { padding: theme.spacing(0, 4) },
}));

function directMatches(query) {
  const normalized = query.trim().toLocaleLowerCase('pt-BR');
  if (!normalized) return [];
  return dashboardRoutes
    .filter((route) => `${route.title} ${route.description}`.toLocaleLowerCase('pt-BR').includes(normalized))
    .slice(0, 6);
}

export default function Searchbar({ onOpenAssistant }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('search');
  const [semanticResults, setSemanticResults] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const queryInputRef = useRef(null);
  const matches = useMemo(() => directMatches(query), [query]);

  const close = () => {
    setOpen(false);
    setSemanticResults([]);
    setPlan(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError('');
    setSemanticResults([]);
    setPlan(null);
    try {
      const [{ getAiCapabilities, discoverWithAi, createWorkflowPlan }, { buildAiRouteContext }] = await Promise.all([
        import('../../features/ai/service'),
        import('../../features/ai/routeContext'),
      ]);
      const capabilities = await getAiCapabilities();
      if (!capabilities.available) {
        setError('A busca direta continua disponivel. A busca inteligente depende do gateway seguro.');
        return;
      }
      const context = buildAiRouteContext(pathname, { observedAt: new Date().toISOString(), provenance: 'curated' });
      if (mode === 'plan') {
        if (!capabilities.features.workflowPlanning) throw new Error('Planejamento inteligente indisponivel neste plano.');
        setPlan(await createWorkflowPlan({ query: query.trim(), context }));
      } else {
        if (!capabilities.features.semanticDiscovery) throw new Error('Busca semantica indisponivel neste plano.');
        const response = await discoverWithAi({ query: query.trim(), context });
        setSemanticResults(response.results);
        if (!response.results.length) setError(response.refinement || 'Nenhum resultado confiavel foi encontrado.');
      }
    } catch (requestError) {
      setError(requestError.message || 'Nao foi possivel concluir a busca inteligente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => open && close()}>
      <Box>
        {!open ? (
          <Tooltip title="Buscar ou planejar">
            <IconButton onClick={() => setOpen(true)} aria-label="Buscar ou planejar na plataforma">
              <SearchRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Slide direction="down" in={open} mountOnEnter unmountOnExit onEntered={() => queryInputRef.current?.focus()}>
          <SearchLayer aria-label="Busca e comandos">
            <Box component="form" onSubmit={handleSubmit} sx={{ width: 1 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={mode}
                  onChange={(_event, value) => value && setMode(value)}
                  aria-label="Modo do comando"
                  sx={{ display: { xs: 'none', md: 'inline-flex' }, flexShrink: 0 }}
                >
                  <ToggleButton value="search" aria-label="Buscar">
                    <SearchRoundedIcon sx={{ mr: 0.75 }} /> Buscar
                  </ToggleButton>
                  <ToggleButton value="plan" aria-label="Planejar">
                    <RouteRoundedIcon sx={{ mr: 0.75 }} /> Planejar
                  </ToggleButton>
                </ToggleButtonGroup>
                <Input
                  fullWidth
                  disableUnderline
                  value={query}
                  onChange={(event) => setQuery(event.target.value.slice(0, 500))}
                  placeholder={mode === 'plan' ? 'Descreva o que precisa realizar' : 'Busque paginas, especies ou ajuda'}
                  inputProps={{ 'aria-label': 'Consulta na plataforma', maxLength: 500 }}
                  inputRef={queryInputRef}
                  startAdornment={
                    <InputAdornment position="start">
                      {mode === 'plan' ? <RouteRoundedIcon /> : <SearchRoundedIcon />}
                    </InputAdornment>
                  }
                />
                <Button type="submit" variant="contained" disabled={loading || query.trim().length < 2}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : mode === 'plan' ? 'Interpretar' : 'Buscar'}
                </Button>
                <Tooltip title="Fechar busca">
                  <IconButton onClick={close} aria-label="Fechar busca">
                    <CloseRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              {query.trim() ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 68,
                    left: 0,
                    right: 0,
                    maxHeight: 'min(70dvh, 620px)',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 8,
                    px: { xs: 2, md: 4 },
                    py: 2,
                  }}
                >
                  {error ? <Alert severity="info" sx={{ mb: 1.5 }}>{error}</Alert> : null}
                  {matches.length ? (
                    <Stack spacing={0.5} sx={{ mb: semanticResults.length || plan ? 2 : 0 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        DESTINOS DIRETOS
                      </Typography>
                      {matches.map((route) => (
                        <Link
                          key={route.canonicalPath}
                          component={RouterLink}
                          to={route.canonicalPath}
                          onClick={close}
                          underline="none"
                          sx={{ display: 'flex', gap: 1.25, alignItems: 'center', px: 1, py: 1, borderRadius: 1 }}
                        >
                          <SearchRoundedIcon sx={{ fontSize: 18 }} />
                          <Box>
                            <Typography variant="body2" fontWeight={800}>{route.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{route.description}</Typography>
                          </Box>
                        </Link>
                      ))}
                    </Stack>
                  ) : null}

                  {semanticResults.length ? (
                    <Stack spacing={0.75}>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        RESULTADOS POR SIGNIFICADO
                      </Typography>
                      {semanticResults.map((result) => (
                        <Link
                          key={result.id}
                          component={result.destination.startsWith('/') ? RouterLink : 'a'}
                          to={result.destination.startsWith('/') ? result.destination : undefined}
                          href={result.destination.startsWith('/') ? undefined : result.destination}
                          target={result.destination.startsWith('/') ? undefined : '_blank'}
                          rel={result.destination.startsWith('/') ? undefined : 'noopener noreferrer'}
                          onClick={close}
                          underline="none"
                          sx={{ px: 1, py: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                        >
                          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.25 }}>
                            <Typography variant="body2" fontWeight={800} color="text.primary">{result.title}</Typography>
                            <Chip size="small" label={result.matchType === 'direct' ? 'Direto' : 'Semantico'} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">{result.reason}</Typography>
                        </Link>
                      ))}
                    </Stack>
                  ) : null}

                  {plan ? (
                    <Stack spacing={1.25} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <AutoAwesomeRoundedIcon color="primary" />
                        <Typography variant="subtitle2">Plano para revisao</Typography>
                        <Chip size="small" label={plan.reviewLevel === 'confirmation' ? 'Exige confirmacao' : 'Revisao'} />
                      </Stack>
                      <Typography>{plan.summary}</Typography>
                      <Typography variant="caption" color="text.secondary">Destino: {plan.target}</Typography>
                      <Divider />
                      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} justifyContent="flex-end">
                        <Button color="inherit" onClick={() => setPlan(null)}>Descartar</Button>
                        <Button variant="outlined" startIcon={<AutoAwesomeRoundedIcon />} onClick={() => { close(); onOpenAssistant(query); }}>
                          Revisar com a IA
                        </Button>
                      </Stack>
                    </Stack>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          </SearchLayer>
        </Slide>
      </Box>
    </ClickAwayListener>
  );
}

Searchbar.propTypes = {
  onOpenAssistant: PropTypes.func.isRequired,
};
