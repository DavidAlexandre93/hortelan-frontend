import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmationName,
  busy = false,
  onCancel,
  onConfirm,
}) {
  const [typedValue, setTypedValue] = useState('');
  const matches = !confirmationName || typedValue.trim() === confirmationName;
  const handleCancel = () => {
    setTypedValue('');
    onCancel();
  };
  const handleConfirm = () => {
    setTypedValue('');
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : handleCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {confirmationName && (
          <TextField
            fullWidth
            label={`Digite ${confirmationName} para confirmar`}
            value={typedValue}
            onChange={(event) => setTypedValue(event.target.value)}
            sx={{ mt: 2.5 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleCancel} disabled={busy}>
          Cancelar
        </Button>
        <Button color="error" variant="contained" onClick={handleConfirm} disabled={!matches || busy} loading={busy}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  busy: PropTypes.bool,
  confirmationName: PropTypes.string,
  description: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};
