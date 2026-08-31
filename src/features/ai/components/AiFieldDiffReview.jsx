import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { buildAiRouteContext } from '../routeContext';
import { getAiCapabilities, requestFormAssistance } from '../service';

const PROTECTED_FIELD_PATTERN = /password|senha|secret|token|credential|mfa|payment|card|api.?key/i;

function displayValue(value) {
  if (value === null || value === undefined || value === '') return 'Nao informado';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return 'Valor estruturado';
  return String(value);
}

export default function AiFieldDiffReview({ formId, fields, onAccept }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const eligibleFields = useMemo(() => fields.filter((field) => !PROTECTED_FIELD_PATTERN.test(field.key)), [fields]);

  const requestSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const capabilities = await getAiCapabilities();
      if (!capabilities.available || !capabilities.features.formAssistance) {
        throw new Error('Sugestoes inteligentes nao estao disponiveis neste ambiente.');
      }
      const response = await requestFormAssistance({
        formId,
        context: buildAiRouteContext('/dashboard/onboarding', {
          observedAt: new Date().toISOString(),
          provenance: 'user',
        }),
        fields: eligibleFields.map(({ key, label, type, options, value }) => ({
          key,
          label,
          type,
          options,
          currentValue: value,
        })),
      });
      setSuggestions(response.suggestions.filter((suggestion) => eligibleFields.some((field) => field.key === suggestion.field)));
    } catch (requestError) {
      setError(requestError.message || 'Nao foi possivel gerar sugestoes seguras.');
    } finally {
      setLoading(false);
    }
  };

  const removeSuggestion = (field) => setSuggestions((current) => current.filter((item) => item.field !== field));

  return (
    <Box component="section" aria-label="Assistencia inteligente do formulario">
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} gap={1.5}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2">Sugestoes para revisao</Typography>
          <Typography variant="body2" color="text.secondary">
            Valores propostos aparecem separadamente e so entram no formulario quando voce aceitar.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={18} /> : <AutoFixHighRoundedIcon />}
          onClick={requestSuggestions}
          disabled={loading || !eligibleFields.length}
        >
          Sugerir com IA
        </Button>
      </Stack>
      {error ? <Alert severity="info" sx={{ mt: 1.5 }}>{error}</Alert> : null}
      {suggestions.length ? (
        <Stack spacing={1.25} sx={{ mt: 2 }}>
          <Divider />
          {suggestions.map((suggestion) => {
            const field = eligibleFields.find((item) => item.key === suggestion.field);
            return (
              <Box key={suggestion.field} sx={{ py: 0.75 }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle2">{field?.label || suggestion.field}</Typography>
                  <Chip
                    size="small"
                    color={suggestion.valid ? 'success' : 'error'}
                    label={suggestion.valid ? 'Valido' : 'Rejeitado pela validacao'}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">Valor atual</Typography>
                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{displayValue(suggestion.previousValue)}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">Valor proposto</Typography>
                    <Typography variant="body2" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>
                      {displayValue(suggestion.proposedValue)}
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                  {suggestion.reason}
                </Typography>
                <Stack direction="row" gap={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                  <Button size="small" color="inherit" startIcon={<CloseRoundedIcon />} onClick={() => removeSuggestion(suggestion.field)}>
                    Rejeitar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckRoundedIcon />}
                    disabled={!suggestion.valid}
                    onClick={() => {
                      onAccept(suggestion.field, suggestion.proposedValue);
                      removeSuggestion(suggestion.field);
                    }}
                  >
                    Aceitar campo
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      ) : null}
    </Box>
  );
}

AiFieldDiffReview.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.array,
      type: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  formId: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
};
