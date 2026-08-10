import { Alert, Container, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import ConfirmationDialog from '../../components/states/ConfirmationDialog';
import useAuth from '../../auth/useAuth';
import { getPasswordChangeHistory } from '../../auth/session';
import { CONSENT_LABELS } from '../../features/security/model';
import AccountSessionsSection from '../../features/security/AccountSessionsSection';
import TwoFactorSection from '../../features/security/TwoFactorSection';
import PrivacyDataSection from '../../features/security/PrivacyDataSection';
import DeviceSecuritySection from '../../features/security/DeviceSecuritySection';

export default function Security() {
  const navigate = useNavigate();
  const {
    user,
    sessions,
    twoFactor,
    trustedDevices,
    consents,
    consentLogs,
    retentionPolicy,
    deletionRequest,
    update2FASettings,
    logoutOthers,
    logoutAll,
    removeTrustedDevice,
    rotateDeviceCredential,
    revokeCompromised,
    updateConsents,
    requestDeletion,
    deactivateAccount,
    exportPersonalData,
  } = useAuth();

  const history = getPasswordChangeHistory();
  const [method, setMethod] = useState(twoFactor?.method || 'email');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [deactivationOpen, setDeactivationOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [deviceConfirmation, setDeviceConfirmation] = useState(null);
  const [busyAction, setBusyAction] = useState('');

  const runAction = async (key, operation) => {
    if (busyAction) return { error: 'Aguarde a operacao atual terminar.' };
    setBusyAction(key);
    try {
      return await operation();
    } finally {
      setBusyAction('');
    }
  };

  const handleConsentToggle = async (field, checked) => {
    const result = await runAction(`consent-${field}`, () => updateConsents({ [field]: checked }));

    if (result.error) {
      setError(result.error);
      return;
    }

    setError('');
    setFeedback(`Consentimento de ${CONSENT_LABELS[field]} atualizado com sucesso.`);
  };

  const handleExport = async () => {
    const result = await runAction('export', exportPersonalData);

    if (result.error) {
      setError(result.error);
      return;
    }

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `hortelan-dados-pessoais-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    setError('');
    setFeedback('Arquivo de dados pessoais exportado com sucesso.');
  };

  const handleDeletionRequest = async () => {
    const result = await runAction('deletion', () => requestDeletion({ reason: 'Exclusao confirmada pelo usuario' }));

    if (result.error) {
      setError(result.error);
      return;
    }

    setDeletionOpen(false);
    setError('');
    setFeedback('Solicitação de exclusão registrada. Nossa equipe entrará em contato.');
  };

  const handleDeactivate = async () => {
    const result = await runAction('deactivate', () =>
      deactivateAccount({ reason: 'Desativacao confirmada pelo usuario' })
    );

    if (result.error) {
      setError(result.error);
      return;
    }

    setDeactivationOpen(false);
    navigate('/login', { replace: true });
  };

  const handleDeviceAction = async (key, operation, successMessage) => {
    const result = await runAction(key, operation);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError('');
    setFeedback(successMessage);
  };

  const confirmDeviceAction = async () => {
    if (!deviceConfirmation) return;
    const { key, operation, successMessage } = deviceConfirmation;
    await handleDeviceAction(key, operation, successMessage);
    setDeviceConfirmation(null);
  };

  return (
    <Page title="Segurança">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Segurança da conta</Typography>

          {feedback && <Alert severity="success">{feedback}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <AccountSessionsSection controller={{ sessions, logoutOthers, logoutAll }} />
          <TwoFactorSection
            controller={{
              twoFactor,
              busyAction,
              runAction,
              update2FASettings,
              method,
              setMethod,
              setError,
              setFeedback,
            }}
          />
          <PrivacyDataSection
            controller={{
              consents,
              busyAction,
              handleConsentToggle,
              handleExport,
              setDeletionOpen,
              setDeactivationOpen,
              retentionPolicy,
              deletionRequest,
              user,
              runAction,
              updateConsents,
              setError,
              setFeedback,
            }}
          />
          <DeviceSecuritySection
            controller={{
              trustedDevices,
              busyAction,
              handleDeviceAction,
              rotateDeviceCredential,
              revokeCompromised,
              removeTrustedDevice,
              setDeviceConfirmation,
              consentLogs,
              user,
              history,
            }}
          />
        </Stack>
      </Container>

      <ConfirmationDialog
        open={deactivationOpen}
        title="Desativar conta"
        description="Esta acao encerra todas as sessoes e bloqueia novos logins. Digite DESATIVAR para confirmar."
        confirmationName="DESATIVAR"
        busy={busyAction === 'deactivate'}
        onCancel={() => setDeactivationOpen(false)}
        onConfirm={handleDeactivate}
      />
      <ConfirmationDialog
        open={deletionOpen}
        title="Solicitar exclusao da conta"
        description="A solicitacao seguira os criterios legais de retencao. Digite EXCLUIR para confirmar."
        confirmationName="EXCLUIR"
        busy={busyAction === 'deletion'}
        onCancel={() => setDeletionOpen(false)}
        onConfirm={handleDeletionRequest}
      />
      <ConfirmationDialog
        open={Boolean(deviceConfirmation)}
        title={deviceConfirmation?.title || 'Confirmar acao no dispositivo'}
        description="Esta acao interrompe a confianca e pode exigir um novo pareamento do dispositivo."
        confirmationName={deviceConfirmation?.confirmationName}
        busy={Boolean(busyAction)}
        onCancel={() => setDeviceConfirmation(null)}
        onConfirm={confirmDeviceAction}
      />
    </Page>
  );
}
