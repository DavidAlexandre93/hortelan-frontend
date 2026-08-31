import PropTypes from 'prop-types';
import { Alert, Box, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import AiCitationList from './AiCitationList';

function Message({ message, onFeedback, onRetry }) {
  const assistant = message.role === 'assistant';
  const incomplete = message.status === 'incomplete' || message.status === 'failed';
  return (
    <Box
      component="article"
      aria-label={assistant ? 'Resposta da inteligencia Hortelan' : 'Sua mensagem'}
      sx={{
        alignSelf: assistant ? 'stretch' : 'flex-end',
        width: assistant ? 1 : 'min(88%, 540px)',
        px: assistant ? 0 : 1.5,
        py: assistant ? 0.5 : 1.25,
        borderRadius: assistant ? 0 : 1.5,
        bgcolor: assistant ? 'transparent' : 'primary.main',
        color: assistant ? 'text.primary' : 'primary.contrastText',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
        {assistant ? <AutoAwesomeRoundedIcon color="primary" sx={{ fontSize: 18 }} /> : <PersonOutlineRoundedIcon />}
        <Typography variant="caption" fontWeight={800}>
          {assistant ? 'Inteligencia Hortelan' : 'Voce'}
        </Typography>
        {message.status === 'streaming' ? <CircularProgress size={14} aria-label="Resposta em andamento" /> : null}
        {message.provenance ? <Chip size="small" variant="outlined" label={message.provenance} /> : null}
      </Stack>
      <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.7 }}>
        {message.content || (message.status === 'streaming' ? 'Analisando contexto e fontes...' : '')}
      </Typography>
      {message.stageLabel ? (
        <Typography variant="caption" color="text.secondary" role="status">
          {message.stageLabel}
        </Typography>
      ) : null}
      {incomplete ? (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          {message.error || 'Esta resposta ficou incompleta. Nenhuma acao pode ser criada a partir dela.'}
        </Alert>
      ) : null}
      {message.status === 'refused' ? (
        <Alert severity="info" sx={{ mt: 1.5 }}>
          Revise o limite informado ou procure orientacao agronomica qualificada.
        </Alert>
      ) : null}
      {assistant ? <AiCitationList citations={message.citations || []} /> : null}
      {assistant && message.content ? (
        <Stack direction="row" gap={0.25} sx={{ mt: 1 }}>
          <Tooltip title="Copiar resposta">
            <IconButton
              size="small"
              aria-label="Copiar resposta"
              onClick={() => globalThis.navigator?.clipboard?.writeText(message.content)}
            >
              <ContentCopyRoundedIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          {message.messageId && message.status === 'complete' ? (
            <>
              <Tooltip title="Resposta util">
                <IconButton size="small" aria-label="Marcar resposta como util" onClick={() => onFeedback(message, 1)}>
                  <ThumbUpAltOutlinedIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Resposta nao ajudou">
                <IconButton size="small" aria-label="Marcar resposta como nao util" onClick={() => onFeedback(message, -1)}>
                  <ThumbDownAltOutlinedIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
          {incomplete ? (
            <Tooltip title="Tentar novamente">
              <IconButton size="small" aria-label="Tentar resposta novamente" onClick={() => onRetry(message)}>
                <RefreshRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ) : null}
    </Box>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    citations: PropTypes.array,
    content: PropTypes.string,
    error: PropTypes.string,
    messageId: PropTypes.string,
    provenance: PropTypes.string,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    stageLabel: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onFeedback: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default function AiMessageList({ messages, onFeedback, onRetry, onSuggestion }) {
  if (!messages.length) {
    const suggestions = [
      'Explique os sinais mais importantes da operacao atual',
      'Quais dados preciso verificar antes de irrigar?',
      'Ajude a interpretar um alerta sem alterar nenhum controle',
    ];
    return (
      <Stack sx={{ minHeight: 1, justifyContent: 'center', px: { xs: 2, sm: 3 }, py: 4 }} spacing={2.5}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Como posso apoiar sua operacao?
          </Typography>
          <Typography color="text.secondary">
            Pergunte sobre a pagina atual, cultivos, sensores, alertas ou uso da plataforma.
          </Typography>
        </Box>
        <Stack spacing={1}>
          {suggestions.map((suggestion) => (
            <Box
              component="button"
              type="button"
              key={suggestion}
              onClick={() => onSuggestion(suggestion)}
              sx={{
                minHeight: 48,
                textAlign: 'left',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                px: 1.5,
                py: 1,
                cursor: 'pointer',
                font: 'inherit',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.light', outlineOffset: 2 },
              }}
            >
              {suggestion}
            </Box>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 } }} aria-live="polite" aria-relevant="additions text">
      {messages.map((message) => (
        <Message key={message.id} message={message} onFeedback={onFeedback} onRetry={onRetry} />
      ))}
    </Stack>
  );
}

AiMessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFeedback: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onSuggestion: PropTypes.func.isRequired,
};
