import PropTypes from 'prop-types';
import { useRef } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

export default function AiComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  busy,
  disabled,
  maxLength,
  file,
  onFileChange,
  imageConfirmed,
  onImageConfirmedChange,
  error,
}) {
  const inputRef = useRef(null);
  const canSubmit = !disabled && !busy && value.trim().length > 0 && (!file || imageConfirmed);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: { xs: 1.5, sm: 2 }, bgcolor: 'background.paper' }}>
      {error ? (
        <Alert severity="warning" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      ) : null}
      {file ? (
        <Stack spacing={0.75} sx={{ mb: 1.25, p: 1.25, bgcolor: 'background.neutral', borderRadius: 1 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <AttachFileRoundedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }}>
              {file.name}
            </Typography>
            <Tooltip title="Remover imagem">
              <IconButton size="small" onClick={() => onFileChange(null)} aria-label="Remover imagem">
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={imageConfirmed}
                onChange={(event) => onImageConfirmedChange(event.target.checked)}
              />
            }
            label="Confirmo o envio desta imagem para analise"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
          />
        </Stack>
      ) : null}
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={6}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        placeholder="Pergunte sobre sua operacao ou cultivo"
        inputProps={{ maxLength, 'aria-describedby': 'ai-composer-count' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ alignSelf: 'flex-end', mb: 0.25 }}>
              <input
                ref={inputRef}
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => onFileChange(event.target.files?.[0] || null)}
              />
              {!busy ? (
                <Tooltip title="Anexar imagem">
                  <IconButton onClick={() => inputRef.current?.click()} aria-label="Anexar imagem" disabled={disabled}>
                    <AttachFileRoundedIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {busy ? (
                <Tooltip title="Interromper resposta">
                  <IconButton onClick={onStop} color="error" aria-label="Interromper resposta">
                    <StopRoundedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Enviar pergunta">
                  <span>
                    <IconButton onClick={onSubmit} color="primary" aria-label="Enviar pergunta" disabled={!canSubmit}>
                      <SendRoundedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
      />
      <Stack direction="row" justifyContent="space-between" gap={1} sx={{ mt: 0.75 }}>
        <Typography variant="caption" color="text.secondary">
          IA pode errar. Confirme dados criticos nas fontes.
        </Typography>
        <Typography id="ai-composer-count" variant="caption" color="text.secondary">
          {value.length}/{maxLength}
        </Typography>
      </Stack>
    </Box>
  );
}

AiComposer.propTypes = {
  busy: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  file: PropTypes.instanceOf(File),
  imageConfirmed: PropTypes.bool.isRequired,
  maxLength: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onImageConfirmedChange: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
