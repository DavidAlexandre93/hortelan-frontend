import { useMemo, useState } from 'react';
import { Alert, Button, Container, Stack, Typography, Paper } from '@mui/material';
import Page from '../../components/Page';
import useAuth from '../../auth/useAuth';
import ProfileBasicsSections from '../../features/profile/ProfileBasicsSections';
import GardenAccessSection from '../../features/profile/GardenAccessSection';
import CultivationLevelSection from '../../features/profile/CultivationLevelSection';

import {
  createAuditEntry,
  createEmptyGarden,
  createEmptySector,
  createPermissionSet,
  normalizeAccessControl,
  normalizeProfilePayload,
} from '../../features/profile/model';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    photoURL: user?.photoURL || '',
    bio: user?.bio || '',
    preferences: {
      language: user?.preferences?.language || 'pt-BR',
      measurementUnit: user?.preferences?.measurementUnit || 'métrico',
      timezone: user?.preferences?.timezone || 'America/Sao_Paulo',
    },
    notifications: {
      irrigationAlerts: Boolean(user?.notifications?.irrigationAlerts),
      pestAlerts: Boolean(user?.notifications?.pestAlerts),
      weatherAlerts: Boolean(user?.notifications?.weatherAlerts),
      communityUpdates: Boolean(user?.notifications?.communityUpdates),
      marketing: Boolean(user?.notifications?.marketing),
    },
    savedAddresses: user?.savedAddresses?.length
      ? user.savedAddresses
      : [{ id: `address-${Date.now()}`, label: '', addressLine: '' }],
    cultivationLevel: user?.cultivationLevel || 'iniciante',
    gardens: user?.gardens?.length
      ? user.gardens.map((garden) => ({
          ...garden,
          sectors: garden.sectors?.length ? garden.sectors : [createEmptySector()],
          accessControl: normalizeAccessControl(garden),
        }))
      : [{ ...createEmptyGarden(), accessControl: normalizeAccessControl({}) }],
  }));
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  const avatarLetter = useMemo(() => (form.name ? form.name[0]?.toUpperCase() : 'U'), [form.name]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateGarden = (gardenIndex, updater) => {
    setField(
      'gardens',
      form.gardens.map((garden, index) => (index === gardenIndex ? updater(garden) : garden))
    );
  };

  const handleInviteByEmail = (gardenIndex) => {
    const garden = form.gardens[gardenIndex];
    const email = garden?.accessControl?.inviteDraftEmail?.trim().toLowerCase();
    const role = garden?.accessControl?.inviteDraftRole || 'viewer';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({
        type: 'error',
        message: 'Informe um e-mail válido para enviar o convite.',
      });
      return;
    }

    updateGarden(gardenIndex, (currentGarden) => {
      const accessControl = currentGarden.accessControl || normalizeAccessControl({});
      const alreadyInvited = (accessControl.pendingInvites || []).some(
        (invite) => invite.email.toLowerCase() === email && invite.status === 'pending'
      );
      const alreadyMember = (accessControl.collaborators || []).some((member) => member.email.toLowerCase() === email);

      if (alreadyInvited || alreadyMember) {
        return currentGarden;
      }

      return {
        ...currentGarden,
        accessControl: {
          ...accessControl,
          inviteDraftEmail: '',
          pendingInvites: [
            {
              id: `invite-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              email,
              role,
              status: 'pending',
              invitedBy: form.name || 'Você',
              createdAt: new Date().toISOString(),
            },
            ...(accessControl.pendingInvites || []),
          ],
          auditLogs: [
            createAuditEntry({
              action: 'Convite enviado por e-mail',
              actor: form.name || 'Você',
              target: `${email} (${role})`,
            }),
            ...(accessControl.auditLogs || []),
          ].slice(0, 40),
        },
      };
    });

    setFeedback({ type: 'success', message: `Convite enviado para ${email}.` });
  };

  const handleAcceptInvite = (gardenIndex, inviteId) => {
    updateGarden(gardenIndex, (garden) => {
      const accessControl = garden.accessControl || normalizeAccessControl({});
      const invite = (accessControl.pendingInvites || []).find((item) => item.id === inviteId);
      if (!invite) return garden;

      const nextInvites = (accessControl.pendingInvites || []).map((item) =>
        item.id === inviteId ? { ...item, status: 'accepted' } : item
      );

      return {
        ...garden,
        accessControl: {
          ...accessControl,
          pendingInvites: nextInvites,
          collaborators: [
            {
              id: `collaborator-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              name: invite.email.split('@')[0],
              email: invite.email,
              role: invite.role,
              status: 'active',
              invitedAt: invite.createdAt,
              finePermissions: createPermissionSet(invite.role),
            },
            ...(accessControl.collaborators || []).filter(
              (member) => member.email.toLowerCase() !== invite.email.toLowerCase()
            ),
          ],
          auditLogs: [
            createAuditEntry({
              action: 'Convite aceito',
              actor: invite.email,
              target: `Papel ${invite.role}`,
            }),
            ...(accessControl.auditLogs || []),
          ].slice(0, 40),
        },
      };
    });

    setFeedback({
      type: 'success',
      message: 'Convite aceito e acesso liberado para a horta.',
    });
  };

  return (
    <Page title="Perfil e preferências">
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
            <Stack spacing={0.5}>
              <Typography variant="h4">Perfil e preferências</Typography>
              <Typography variant="body2" color="text.secondary">
                Organize seus dados pessoais, preferências, hortas e permissões em um único lugar.
              </Typography>
            </Stack>
          </Paper>

          {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

          <ProfileBasicsSections controller={{ form, setField, avatarLetter }} />
          <GardenAccessSection controller={{ form, setField, updateGarden, handleInviteByEmail, handleAcceptInvite }} />
          <CultivationLevelSection controller={{ form, setField }} />
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              loading={saving}
              disabled={saving}
              onClick={async () => {
                if (saving) return;
                const normalized = normalizeProfilePayload(form);

                setSaving(true);
                try {
                  const result = await updateProfile(normalized);

                  if (result.error) {
                    setFeedback({ type: 'error', message: result.error });
                    return;
                  }

                  setFeedback({
                    type: 'success',
                    message: 'Perfil atualizado com sucesso.',
                  });
                } finally {
                  setSaving(false);
                }
              }}
            >
              Salvar alterações
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Page>
  );
}
