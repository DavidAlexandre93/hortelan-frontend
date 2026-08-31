import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ConfirmationDialog from '../../../components/states/ConfirmationDialog';
import { createId } from '../../../utils/createId';
import { CONVERSATION_STATUS, conversationReducer, createConversationState } from '../conversationState';
import { AI_EVENT_KINDS } from '../contracts';
import { hasAiConsent, writeAiPreferences } from '../preferences';
import { buildAiRouteContext, describeAiContext } from '../routeContext';
import {
  createAiConversation,
  deleteAiConversation,
  getAiCapabilities,
  getAiRuntimeConfig,
  submitAiFeedback,
  submitAiMessage,
  uploadAiImage,
} from '../service';
import AiComposer from './AiComposer';
import AiConsentNotice from './AiConsentNotice';
import AiMessageList from './AiMessageList';

function exportConversation(messages) {
  const content = messages
    .map((message) => `${message.role === 'user' ? 'Voce' : 'Inteligencia Hortelan'}\n${message.content}`)
    .join('\n\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `hortelan-conversa-${new Date().toISOString().slice(0, 10)}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function updateAssistantMessage(setMessages, assistantId, updater) {
  setMessages((current) => current.map((message) => (message.id === assistantId ? updater(message) : message)));
}

export default function AssistantExperience({ open, onClose, pathname, initialPrompt = '', variant = 'drawer' }) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('sm'));
  const [capabilities, setCapabilities] = useState(null);
  const [capabilityPending, setCapabilityPending] = useState(true);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [draft, setDraft] = useState(initialPrompt);
  const [file, setFile] = useState(null);
  const [imageConfirmed, setImageConfirmed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [composerError, setComposerError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [state, dispatch] = useReducer(conversationReducer, undefined, createConversationState);
  const abortRef = useRef(null);

  const context = useMemo(
    () => buildAiRouteContext(pathname, { provenance: 'curated', observedAt: new Date().toISOString() }),
    [pathname]
  );
  const contextLabel = describeAiContext(context);
  const runtime = getAiRuntimeConfig();

  useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    setCapabilityPending(true);
    getAiCapabilities({ signal: controller.signal }).then((value) => {
      if (controller.signal.aborted) return;
      setCapabilities(value);
      setConsentAccepted(hasAiConsent(value.consent.policyVersion));
      setCapabilityPending(false);
    });
    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (initialPrompt) setDraft(initialPrompt);
  }, [initialPrompt]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    []
  );

  const handleEvent = useCallback((assistantId, event) => {
    dispatch({ type: 'message/event', event });
    updateAssistantMessage(setMessages, assistantId, (message) => {
      if (event.kind === AI_EVENT_KINDS.STATUS) return { ...message, stageLabel: event.label };
      if (event.kind === AI_EVENT_KINDS.TEXT_DELTA)
        return { ...message, content: `${message.content}${event.delta}`, stageLabel: '' };
      if (event.kind === AI_EVENT_KINDS.CITATION)
        return message.citations.some((citation) => citation.id === event.citation.id)
          ? message
          : { ...message, citations: [...message.citations, event.citation] };
      if (event.kind === AI_EVENT_KINDS.ACTION_DRAFT)
        return { ...message, actionDrafts: [...message.actionDrafts, event.draft] };
      if (event.kind === AI_EVENT_KINDS.COMPLETED)
        return { ...message, messageId: event.messageId, status: 'complete', stageLabel: '' };
      if (event.kind === AI_EVENT_KINDS.REFUSED)
        return { ...message, content: event.message, status: 'refused', stageLabel: '', actionDrafts: [] };
      if (event.kind === AI_EVENT_KINDS.ERROR)
        return {
          ...message,
          status: message.content ? 'incomplete' : 'failed',
          error: event.message,
          stageLabel: '',
          actionDrafts: [],
        };
      return message;
    });
  }, []);

  const handleSubmit = useCallback(
    async (retryText) => {
      const text = String(retryText || draft).trim();
      if (!text || !capabilities?.available || state.status === CONVERSATION_STATUS.STREAMING) return;
      if (file && !imageConfirmed) {
        setComposerError('Confirme o envio da imagem antes de continuar.');
        return;
      }

      setComposerError('');
      setFeedbackMessage('');
      const operationId = createId('ai-operation');
      const assistantId = createId('assistant-turn');
      const userId = createId('user-turn');
      const controller = new AbortController();
      abortRef.current = controller;
      setDraft('');
      dispatch({ type: 'message/start', operationId });
      setMessages((current) => [
        ...current,
        { id: userId, role: 'user', content: text, status: 'complete' },
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          status: 'streaming',
          citations: [],
          actionDrafts: [],
          userText: text,
          provenance: runtime.fakeMode ? 'Demonstracao local' : null,
        },
      ]);

      try {
        let activeConversationId = conversationId;
        if (!activeConversationId) {
          const created = await createAiConversation({ signal: controller.signal });
          activeConversationId = created.id;
          setConversationId(created.id);
          dispatch({ type: 'conversation/ready', conversationId: created.id });
          dispatch({ type: 'message/start', operationId });
        }

        const attachmentIds = [];
        if (file) {
          const uploaded = await uploadAiImage(file, {
            signal: controller.signal,
            confirmed: imageConfirmed,
            maxBytes: capabilities.limits.maxImageBytes,
          });
          attachmentIds.push(uploaded.id);
        }

        const events = await submitAiMessage(
          activeConversationId,
          {
            operationId,
            clientMessageId: createId('ai-message'),
            text,
            context: contextEnabled ? context : null,
            attachmentIds,
            consentPolicyVersion: capabilities.consent.policyVersion,
          },
          { signal: controller.signal, onEvent: (event) => handleEvent(assistantId, event) }
        );
        const terminal = events.at(-1)?.kind;
        if (![AI_EVENT_KINDS.COMPLETED, AI_EVENT_KINDS.REFUSED, AI_EVENT_KINDS.ERROR].includes(terminal)) {
          updateAssistantMessage(setMessages, assistantId, (message) => ({
            ...message,
            status: message.content ? 'incomplete' : 'failed',
            error: 'A resposta terminou sem confirmacao de conclusao.',
            actionDrafts: [],
          }));
        }
        setFile(null);
        setImageConfirmed(false);
      } catch (error) {
        const cancelled = controller.signal.aborted;
        dispatch({ type: cancelled ? 'message/cancelled' : 'message/failed', error });
        updateAssistantMessage(setMessages, assistantId, (message) => ({
          ...message,
          status: message.content ? 'incomplete' : 'failed',
          error: cancelled ? 'Resposta interrompida. O texto foi preservado para uma nova tentativa.' : error.message,
          stageLabel: '',
          actionDrafts: [],
        }));
        setDraft(text);
      } finally {
        abortRef.current = null;
      }
    }, [capabilities, context, contextEnabled, conversationId, draft, file, handleEvent, imageConfirmed, runtime.fakeMode, state.status]
  );

  const handleNewConversation = () => {
    abortRef.current?.abort();
    setConversationId(null);
    setMessages([]);
    setDraft('');
    setFile(null);
    setImageConfirmed(false);
    dispatch({ type: 'conversation/reset' });
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      if (conversationId) await deleteAiConversation(conversationId);
      handleNewConversation();
      setDeleteOpen(false);
    } catch (error) {
      setComposerError(error.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleFeedback = async (message, rating) => {
    try {
      await submitAiFeedback(message.messageId, rating);
      setFeedbackMessage('Obrigado. Seu retorno foi registrado sem alterar os dados da operacao.');
    } catch (error) {
      setFeedbackMessage(error.message);
    }
  };

  const busy = [CONVERSATION_STATUS.STREAMING, CONVERSATION_STATUS.STOPPING].includes(state.status);
  const header = (
    <>
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ minHeight: 64, px: 2, py: 1 }}>
        <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
          <AutoAwesomeRoundedIcon />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" noWrap>
            Inteligencia Hortelan
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {runtime.fakeMode ? 'Demonstracao local' : 'Assistencia agronomica com fontes'}
          </Typography>
        </Box>
        <Tooltip title="Nova conversa">
          <IconButton onClick={handleNewConversation} aria-label="Iniciar nova conversa">
            <NoteAddOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Exportar conversa">
          <span>
            <IconButton
              onClick={() => exportConversation(messages)}
              aria-label="Exportar conversa"
              disabled={!messages.length}
            >
              <DownloadRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Excluir conversa">
          <span>
            <IconButton
              onClick={() => setDeleteOpen(true)}
              aria-label="Excluir conversa"
              disabled={!messages.length}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        {variant === 'drawer' ? (
          <Tooltip title="Fechar">
            <IconButton onClick={onClose} aria-label="Fechar inteligencia Hortelan">
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>
      <Divider />
    </>
  );

  let content;
  if (capabilityPending || !capabilities) {
    content = (
      <Stack role="status" alignItems="center" justifyContent="center" spacing={1.5} sx={{ flex: 1, p: 3 }}>
        <CircularProgress size={28} />
        <Typography color="text.secondary">Verificando disponibilidade segura...</Typography>
      </Stack>
    );
  } else if (!capabilities.available) {
    content = (
      <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ flex: 1, p: 3, textAlign: 'center' }}>
        <ShieldOutlinedIcon color="primary" sx={{ fontSize: 42 }} />
        <Box>
          <Typography variant="h6" gutterBottom>
            Inteligencia indisponivel
          </Typography>
          <Typography color="text.secondary">
            O gateway seguro ainda nao esta configurado. Monitoramento, alertas e demais recursos continuam funcionando.
          </Typography>
        </Box>
        {capabilities.incidentId ? <Chip variant="outlined" label={`Referencia ${capabilities.incidentId}`} /> : null}
        <Button variant="outlined" onClick={onClose}>
          Voltar para a operacao
        </Button>
      </Stack>
    );
  } else if (!consentAccepted) {
    content = (
      <AiConsentNotice
        capabilities={capabilities}
        contextLabel={contextLabel}
        onAccept={() => {
          writeAiPreferences({ consentPolicyVersion: capabilities.consent.policyVersion });
          setConsentAccepted(true);
        }}
        onDecline={onClose}
      />
    );
  } else {
    content = (
      <>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          gap={1}
          sx={{ px: 2, py: 1.25, bgcolor: 'background.neutral', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" fontWeight={800} display="block">
              Contexto autorizado
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap={!compact}>
              {contextEnabled ? contextLabel : 'Contexto da pagina desativado'}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography component="label" htmlFor="ai-context-switch" variant="caption">
              Usar contexto
            </Typography>
            <Switch
              id="ai-context-switch"
              size="small"
              checked={contextEnabled}
              onChange={(event) => setContextEnabled(event.target.checked)}
              disabled={!context}
            />
          </Stack>
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <AiMessageList
            messages={messages}
            onSuggestion={setDraft}
            onFeedback={handleFeedback}
            onRetry={(message) => handleSubmit(message.userText)}
          />
        </Box>
        {feedbackMessage ? (
          <Alert severity="info" onClose={() => setFeedbackMessage('')} sx={{ borderRadius: 0 }}>
            {feedbackMessage}
          </Alert>
        ) : null}
        <AiComposer
          value={draft}
          onChange={setDraft}
          onSubmit={() => handleSubmit()}
          onStop={() => {
            dispatch({ type: 'message/stop' });
            abortRef.current?.abort();
          }}
          busy={busy}
          disabled={!capabilities.features.chat}
          maxLength={capabilities.limits.maxInputCharacters}
          file={file}
          onFileChange={(nextFile) => {
            setFile(nextFile);
            setImageConfirmed(false);
            setComposerError('');
          }}
          imageConfirmed={imageConfirmed}
          onImageConfirmedChange={setImageConfirmed}
          error={composerError}
        />
      </>
    );
  }

  const workspace = (
    <Box
      sx={{
        minHeight: { xs: 620, md: 'calc(100dvh - 235px)' },
        height: { md: 'calc(100dvh - 235px)' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      {header}
      {content}
    </Box>
  );

  return (
    <>
      {variant === 'workspace' ? (
        workspace
      ) : (
        <Drawer
          anchor="right"
          open={open}
          onClose={busy ? undefined : onClose}
          ModalProps={{ keepMounted: false }}
          PaperProps={{
            sx: {
              width: compact ? 1 : 460,
              maxWidth: 1,
              height: '100dvh',
              display: 'flex',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
            },
          }}
        >
          {header}
          {content}
        </Drawer>
      )}
      <ConfirmationDialog
        open={deleteOpen}
        title="Excluir esta conversa?"
        description="O historico deixara de ficar disponivel e seguira a politica de retencao informada."
        confirmationName="EXCLUIR"
        busy={deleteBusy}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

AssistantExperience.propTypes = {
  initialPrompt: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['drawer', 'workspace']),
};
