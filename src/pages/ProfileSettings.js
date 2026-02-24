import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import useAuth from '../auth/useAuth';

const CULTIVATION_LEVEL_OPTIONS = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
];

const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (GMT-3)' },
  { value: 'America/Manaus', label: 'America/Manaus (GMT-4)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
];

const GARDEN_TYPE_OPTIONS = [
  { value: 'solo', label: 'Solo' },
  { value: 'vaso', label: 'Vaso' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'hidroponia', label: 'Hidroponia' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'estufa', label: 'Estufa' },
];

const SECTOR_TYPE_OPTIONS = [
  { value: 'sol_pleno', label: 'Luz solar total' },
  { value: 'meia_sombra', label: 'Meia sombra' },
  { value: 'sombra_total', label: 'Sombra total' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'estufa', label: 'Estufa' },
];

const createEmptySector = () => ({
  id: `sector-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: '',
  dimensions: '',
  sectorType: 'sol_pleno',
});

const createEmptyGarden = () => ({
  id: `garden-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: '',
  gardenType: 'solo',
  location: '',
  photoURL: '',
  sectors: [createEmptySector()],
});

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Proprietário', description: 'Controle total da horta e gestão de acessos.' },
  { value: 'admin', label: 'Administrador da horta', description: 'Gerencia rotinas, equipe e integrações.' },
  { value: 'operator', label: 'Operador/cuidador', description: 'Executa tarefas operacionais e intervenções diárias.' },
  { value: 'viewer', label: 'Visualizador', description: 'Acompanhamento em modo leitura.' },
];

const FINE_PERMISSION_OPTIONS = [
  { key: 'automation', label: 'Automação' },
  { key: 'purchases', label: 'Compras' },
  { key: 'reports', label: 'Relatórios' },
  { key: 'community', label: 'Comunidade' },
];

const ROLE_DEFAULT_PERMISSIONS = {
  owner: { automation: true, purchases: true, reports: true, community: true },
  admin: { automation: true, purchases: true, reports: true, community: true },
  operator: { automation: true, purchases: false, reports: true, community: false },
  viewer: { automation: false, purchases: false, reports: true, community: true },
};

const createPermissionSet = (role = 'viewer', overrides = {}) => ({
  ...(ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.viewer),
  ...overrides,
});

const createAuditEntry = ({ action, actor, target }) => ({
  id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  action,
  actor,
  target,
  createdAt: new Date().toISOString(),
});

const normalizeAccessControl = (garden) => {
  const accessControl = garden.accessControl || {};
  const collaborators = (accessControl.collaborators || []).map((member, memberIndex) => {
    const role = member.role || 'viewer';
    return {
      id: member.id || `collaborator-${Date.now()}-${memberIndex}`,
      name: member.name || `Membro ${memberIndex + 1}`,
      email: member.email || '',
      role,
      status: member.status || 'active',
      invitedAt: member.invitedAt || new Date().toISOString(),
      finePermissions: createPermissionSet(role, member.finePermissions || {}),
    };
  });

  return {
    ownerId: accessControl.ownerId || 'self',
    inviteDraftEmail: accessControl.inviteDraftEmail || '',
    inviteDraftRole: accessControl.inviteDraftRole || 'viewer',
    pendingInvites: (accessControl.pendingInvites || []).map((invite, inviteIndex) => ({
      id: invite.id || `invite-${Date.now()}-${inviteIndex}`,
      email: invite.email || '',
      role: invite.role || 'viewer',
      status: invite.status || 'pending',
      invitedBy: invite.invitedBy || 'Você',
      createdAt: invite.createdAt || new Date().toISOString(),
    })),
    collaborators,
    auditLogs: (accessControl.auditLogs || []).map((entry, entryIndex) => ({
      id: entry.id || `audit-${Date.now()}-${entryIndex}`,
      action: entry.action || 'Ação registrada',
      actor: entry.actor || 'Sistema',
      target: entry.target || 'Horta',
      createdAt: entry.createdAt || new Date().toISOString(),
    })),
  };
};

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
    savedAddresses: user?.savedAddresses?.length ? user.savedAddresses : [{ id: `address-${Date.now()}`, label: '', addressLine: '' }],
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
      setFeedback({ type: 'error', message: 'Informe um e-mail válido para enviar o convite.' });
      return;
    }

    updateGarden(gardenIndex, (currentGarden) => {
      const accessControl = currentGarden.accessControl || normalizeAccessControl({});
      const alreadyInvited = (accessControl.pendingInvites || []).some((invite) => invite.email.toLowerCase() === email && invite.status === 'pending');
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

      const nextInvites = (accessControl.pendingInvites || []).map((item) => (item.id === inviteId ? { ...item, status: 'accepted' } : item));

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
            ...(accessControl.collaborators || []).filter((member) => member.email.toLowerCase() !== invite.email.toLowerCase()),
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

    setFeedback({ type: 'success', message: 'Convite aceito e acesso liberado para a horta.' });
  };

  return (
    <Page title="Perfil e preferências">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Perfil e preferências</Typography>

          {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Dados de perfil</Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Avatar src={form.photoURL} sx={{ width: 64, height: 64 }}>{avatarLetter}</Avatar>
                <TextField
                  fullWidth
                  label="URL da foto"
                  value={form.photoURL}
                  onChange={(event) => setField('photoURL', event.target.value)}
                  placeholder="https://..."
                />
              </Stack>

              <TextField
                fullWidth
                label="Nome"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
              />

              <TextField
                fullWidth
                label="Bio"
                minRows={3}
                multiline
                value={form.bio}
                onChange={(event) => setField('bio', event.target.value)}
              />
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Preferências</Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="language-label">Idioma</InputLabel>
                  <Select
                    labelId="language-label"
                    label="Idioma"
                    value={form.preferences.language}
                    onChange={(event) =>
                      setField('preferences', {
                        ...form.preferences,
                        language: event.target.value,
                      })
                    }
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="measurement-label">Unidade de medida</InputLabel>
                  <Select
                    labelId="measurement-label"
                    label="Unidade de medida"
                    value={form.preferences.measurementUnit}
                    onChange={(event) =>
                      setField('preferences', {
                        ...form.preferences,
                        measurementUnit: event.target.value,
                      })
                    }
                  >
                    <MenuItem value="métrico">Métrico (°C, mm, cm)</MenuItem>
                    <MenuItem value="imperial">Imperial (°F, in)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="timezone-label">Fuso horário</InputLabel>
                  <Select
                    labelId="timezone-label"
                    label="Fuso horário"
                    value={form.preferences.timezone}
                    onChange={(event) =>
                      setField('preferences', {
                        ...form.preferences,
                        timezone: event.target.value,
                      })
                    }
                  >
                    {TIMEZONE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Preferências de notificações</Typography>

              {[
                ['irrigationAlerts', 'Alertas de irrigação'],
                ['pestAlerts', 'Alertas de pragas'],
                ['weatherAlerts', 'Alertas climáticos'],
                ['communityUpdates', 'Atualizações da comunidade'],
                ['marketing', 'Novidades e campanhas'],
              ].map(([key, label]) => (
                <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography>{label}</Typography>
                  <Switch
                    checked={form.notifications[key]}
                    onChange={(_, checked) =>
                      setField('notifications', {
                        ...form.notifications,
                        [key]: checked,
                      })
                    }
                  />
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Endereços salvos</Typography>

              {form.savedAddresses.map((address, index) => (
                <Box key={address.id}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                    <TextField
                      fullWidth
                      label="Rótulo"
                      value={address.label}
                      onChange={(event) => {
                        const nextAddresses = [...form.savedAddresses];
                        nextAddresses[index] = { ...address, label: event.target.value };
                        setField('savedAddresses', nextAddresses);
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Endereço"
                      value={address.addressLine}
                      onChange={(event) => {
                        const nextAddresses = [...form.savedAddresses];
                        nextAddresses[index] = { ...address, addressLine: event.target.value };
                        setField('savedAddresses', nextAddresses);
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (form.savedAddresses.length === 1) {
                          return;
                        }

                        setField(
                          'savedAddresses',
                          form.savedAddresses.filter((item) => item.id !== address.id)
                        );
                      }}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Stack>
                  {index < form.savedAddresses.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() =>
                  setField('savedAddresses', [
                    ...form.savedAddresses,
                    { id: `address-${Date.now()}-${Math.random().toString(16).slice(2)}`, label: '', addressLine: '' },
                  ])
                }
              >
                Adicionar endereço
              </Button>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Hortas do usuário</Typography>

              {form.gardens.map((garden, index) => (
                <Box key={garden.id}>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                      <TextField
                        fullWidth
                        label="Nome da horta"
                        placeholder="Horta da varanda"
                        value={garden.name}
                        onChange={(event) => {
                          const nextGardens = [...form.gardens];
                          nextGardens[index] = { ...garden, name: event.target.value };
                          setField('gardens', nextGardens);
                        }}
                      />
                      <FormControl fullWidth>
                        <InputLabel id={`garden-type-${garden.id}`}>Tipo da horta</InputLabel>
                        <Select
                          labelId={`garden-type-${garden.id}`}
                          label="Tipo da horta"
                          value={garden.gardenType}
                          onChange={(event) => {
                            const nextGardens = [...form.gardens];
                            nextGardens[index] = { ...garden, gardenType: event.target.value };
                            setField('gardens', nextGardens);
                          }}
                        >
                          {GARDEN_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <TextField
                      fullWidth
                      label="Localização"
                      placeholder="Cidade, bairro ou coordenada"
                      value={garden.location}
                      onChange={(event) => {
                        const nextGardens = [...form.gardens];
                        nextGardens[index] = { ...garden, location: event.target.value };
                        setField('gardens', nextGardens);
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Foto da horta (URL)"
                      placeholder="https://..."
                      value={garden.photoURL}
                      onChange={(event) => {
                        const nextGardens = [...form.gardens];
                        nextGardens[index] = { ...garden, photoURL: event.target.value };
                        setField('gardens', nextGardens);
                      }}
                    />

                    {garden.photoURL && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pré-visualização
                        </Typography>
                        <Box
                          component="img"
                          src={garden.photoURL}
                          alt={garden.name || `Horta ${index + 1}`}
                          sx={{ width: 120, height: 120, borderRadius: 1, objectFit: 'cover', mt: 1 }}
                        />
                      </Box>
                    )}

                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={() => {
                          if (form.gardens.length === 1) {
                            return;
                          }

                          setField(
                            'gardens',
                            form.gardens.filter((item) => item.id !== garden.id)
                          );
                        }}
                      >
                        Remover horta
                      </Button>
                    </Stack>

                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2">Setores da horta</Typography>

                        {garden.sectors?.map((sector, sectorIndex) => (
                          <Box key={sector.id}>
                            <Stack spacing={2}>
                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField
                                  fullWidth
                                  label="Nome do setor"
                                  placeholder="Canteiro 1, bancada A, torre 2..."
                                  value={sector.name}
                                  onChange={(event) => {
                                    const nextGardens = [...form.gardens];
                                    const nextSectors = [...(garden.sectors || [])];
                                    nextSectors[sectorIndex] = { ...sector, name: event.target.value };
                                    nextGardens[index] = { ...garden, sectors: nextSectors };
                                    setField('gardens', nextGardens);
                                  }}
                                />

                                <FormControl fullWidth>
                                  <InputLabel id={`sector-type-${sector.id}`}>Tipo do setor</InputLabel>
                                  <Select
                                    labelId={`sector-type-${sector.id}`}
                                    label="Tipo do setor"
                                    value={sector.sectorType}
                                    onChange={(event) => {
                                      const nextGardens = [...form.gardens];
                                      const nextSectors = [...(garden.sectors || [])];
                                      nextSectors[sectorIndex] = { ...sector, sectorType: event.target.value };
                                      nextGardens[index] = { ...garden, sectors: nextSectors };
                                      setField('gardens', nextGardens);
                                    }}
                                  >
                                    {SECTOR_TYPE_OPTIONS.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Stack>

                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                                <TextField
                                  fullWidth
                                  label="Dimensões (opcional)"
                                  placeholder="Ex.: 2m x 1m"
                                  value={sector.dimensions}
                                  onChange={(event) => {
                                    const nextGardens = [...form.gardens];
                                    const nextSectors = [...(garden.sectors || [])];
                                    nextSectors[sectorIndex] = { ...sector, dimensions: event.target.value };
                                    nextGardens[index] = { ...garden, sectors: nextSectors };
                                    setField('gardens', nextGardens);
                                  }}
                                />

                                <Button
                                  color="error"
                                  onClick={() => {
                                    if ((garden.sectors || []).length === 1) {
                                      return;
                                    }

                                    const nextGardens = [...form.gardens];
                                    nextGardens[index] = {
                                      ...garden,
                                      sectors: garden.sectors.filter((item) => item.id !== sector.id),
                                    };
                                    setField('gardens', nextGardens);
                                  }}
                                >
                                  Remover setor
                                </Button>
                              </Stack>
                            </Stack>

                            {sectorIndex < (garden.sectors?.length || 0) - 1 && <Divider sx={{ mt: 2 }} />}
                          </Box>
                        ))}

                        <Button
                          variant="outlined"
                          startIcon={<Iconify icon="eva:plus-outline" />}
                          onClick={() => {
                            const nextGardens = [...form.gardens];
                            nextGardens[index] = {
                              ...garden,
                              sectors: [...(garden.sectors || []), createEmptySector()],
                            };
                            setField('gardens', nextGardens);
                          }}
                        >
                          Adicionar setor
                        </Button>
                      </Stack>
                    </Card>

                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2">Compartilhamento e permissões (RBAC)</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Convide por e-mail, aceite convites e ajuste permissões finas por área funcional.
                        </Typography>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                          <TextField
                            fullWidth
                            label="Convidar por e-mail"
                            value={garden.accessControl?.inviteDraftEmail || ''}
                            onChange={(event) =>
                              updateGarden(index, (currentGarden) => ({
                                ...currentGarden,
                                accessControl: {
                                  ...(currentGarden.accessControl || normalizeAccessControl({})),
                                  inviteDraftEmail: event.target.value,
                                },
                              }))
                            }
                          />
                          <FormControl sx={{ minWidth: 220 }}>
                            <InputLabel id={`invite-role-${garden.id}`}>Papel</InputLabel>
                            <Select
                              labelId={`invite-role-${garden.id}`}
                              label="Papel"
                              value={garden.accessControl?.inviteDraftRole || 'viewer'}
                              onChange={(event) =>
                                updateGarden(index, (currentGarden) => ({
                                  ...currentGarden,
                                  accessControl: {
                                    ...(currentGarden.accessControl || normalizeAccessControl({})),
                                    inviteDraftRole: event.target.value,
                                  },
                                }))
                              }
                            >
                              {ROLE_OPTIONS.map((roleOption) => (
                                <MenuItem key={roleOption.value} value={roleOption.value}>
                                  {roleOption.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button variant="contained" onClick={() => handleInviteByEmail(index)}>
                            Enviar convite
                          </Button>
                        </Stack>

                        <Stack spacing={1}>
                          <Typography variant="subtitle2">Convites pendentes</Typography>
                          {(garden.accessControl?.pendingInvites || []).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Nenhum convite pendente.</Typography>
                          ) : (
                            (garden.accessControl?.pendingInvites || []).map((invite) => (
                              <Stack key={invite.id} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }}>
                                <Chip size="small" color={invite.status === 'accepted' ? 'success' : 'warning'} label={invite.status === 'accepted' ? 'Aceito' : 'Pendente'} />
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {invite.email} • {ROLE_OPTIONS.find((option) => option.value === invite.role)?.label || invite.role}
                                </Typography>
                                {invite.status === 'pending' && (
                                  <Button size="small" variant="outlined" onClick={() => handleAcceptInvite(index, invite.id)}>
                                    Aceitar convite
                                  </Button>
                                )}
                              </Stack>
                            ))
                          )}
                        </Stack>

                        <Divider />

                        <Stack spacing={1.5}>
                          <Typography variant="subtitle2">Membros da horta</Typography>
                          {(garden.accessControl?.collaborators || []).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Ainda não há colaboradores ativos.</Typography>
                          ) : (
                            (garden.accessControl?.collaborators || []).map((member) => (
                              <Card key={member.id} variant="outlined" sx={{ p: 1.5 }}>
                                <Stack spacing={1}>
                                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                                    <Typography variant="body2" sx={{ flex: 1 }}>
                                      <strong>{member.name}</strong> ({member.email})
                                    </Typography>
                                    <FormControl sx={{ minWidth: 220 }}>
                                      <InputLabel id={`member-role-${member.id}`}>Papel</InputLabel>
                                      <Select
                                        labelId={`member-role-${member.id}`}
                                        label="Papel"
                                        value={member.role}
                                        onChange={(event) => {
                                          const nextRole = event.target.value;
                                          updateGarden(index, (currentGarden) => ({
                                            ...currentGarden,
                                            accessControl: {
                                              ...(currentGarden.accessControl || normalizeAccessControl({})),
                                              collaborators: (currentGarden.accessControl?.collaborators || []).map((currentMember) =>
                                                currentMember.id === member.id
                                                  ? {
                                                      ...currentMember,
                                                      role: nextRole,
                                                      finePermissions: createPermissionSet(nextRole, currentMember.finePermissions),
                                                    }
                                                  : currentMember
                                              ),
                                              auditLogs: [
                                                createAuditEntry({
                                                  action: 'Papel de colaborador alterado',
                                                  actor: form.name || 'Você',
                                                  target: `${member.email} => ${nextRole}`,
                                                }),
                                                ...(currentGarden.accessControl?.auditLogs || []),
                                              ].slice(0, 40),
                                            },
                                          }));
                                        }}
                                      >
                                        {ROLE_OPTIONS.map((roleOption) => (
                                          <MenuItem key={roleOption.value} value={roleOption.value}>
                                            {roleOption.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Stack>
                                  <Typography variant="caption" color="text.secondary">
                                    {ROLE_OPTIONS.find((option) => option.value === member.role)?.description}
                                  </Typography>
                                  <Stack direction="row" spacing={2} flexWrap="wrap">
                                    {FINE_PERMISSION_OPTIONS.map((permission) => (
                                      <Stack key={`${member.id}-${permission.key}`} direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant="caption">{permission.label}</Typography>
                                        <Switch
                                          size="small"
                                          checked={Boolean(member.finePermissions?.[permission.key])}
                                          onChange={(_, checked) => {
                                            updateGarden(index, (currentGarden) => ({
                                              ...currentGarden,
                                              accessControl: {
                                                ...(currentGarden.accessControl || normalizeAccessControl({})),
                                                collaborators: (currentGarden.accessControl?.collaborators || []).map((currentMember) =>
                                                  currentMember.id === member.id
                                                    ? {
                                                        ...currentMember,
                                                        finePermissions: {
                                                          ...(currentMember.finePermissions || createPermissionSet(currentMember.role)),
                                                          [permission.key]: checked,
                                                        },
                                                      }
                                                    : currentMember
                                                ),
                                                auditLogs: [
                                                  createAuditEntry({
                                                    action: 'Permissão fina alterada',
                                                    actor: form.name || 'Você',
                                                    target: `${member.email} • ${permission.label}: ${checked ? 'ativada' : 'desativada'}`,
                                                  }),
                                                  ...(currentGarden.accessControl?.auditLogs || []),
                                                ].slice(0, 40),
                                              },
                                            }));
                                          }}
                                        />
                                      </Stack>
                                    ))}
                                  </Stack>
                                </Stack>
                              </Card>
                            ))
                          )}
                        </Stack>

                        <Divider />

                        <Stack spacing={1}>
                          <Typography variant="subtitle2">Auditoria de ações</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Eventos rastreados: alteração de automação, acionamento manual de dispositivo e exclusão/alteração de dados.
                          </Typography>
                          {(garden.accessControl?.auditLogs || []).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">Sem registros ainda. O log de acesso ficará disponível em fase avançada.</Typography>
                          ) : (
                            (garden.accessControl?.auditLogs || []).slice(0, 8).map((entry) => (
                              <Alert key={entry.id} severity="info" variant="outlined">
                                <strong>{entry.action}</strong> — {entry.actor} • {entry.target}
                              </Alert>
                            ))
                          )}
                        </Stack>
                      </Stack>
                    </Card>
                  </Stack>

                  {index < form.gardens.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() => setField('gardens', [...form.gardens, { ...createEmptyGarden(), accessControl: normalizeAccessControl({}) }])}
              >
                Adicionar horta
              </Button>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Dados de cultivo</Typography>
              <FormControl fullWidth>
                <InputLabel id="cultivation-level-label">Nível de cultivo</InputLabel>
                <Select
                  labelId="cultivation-level-label"
                  label="Nível de cultivo"
                  value={form.cultivationLevel}
                  onChange={(event) => setField('cultivationLevel', event.target.value)}
                >
                  {CULTIVATION_LEVEL_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Card>

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => {
                const normalized = {
                  ...form,
                  savedAddresses: form.savedAddresses.filter((item) => item.label.trim() || item.addressLine.trim()),
                  gardens: form.gardens
                    .filter((item) => item.name.trim() || item.location.trim() || item.photoURL.trim())
                    .map((item) => ({
                      ...item,
                      name: item.name.trim() || 'Horta sem nome',
                      sectors: (item.sectors || [])
                        .filter((sector) => sector.name.trim() || sector.dimensions.trim())
                        .map((sector, sectorIndex) => ({
                          ...sector,
                          name: sector.name.trim() || `Setor ${sectorIndex + 1}`,
                          dimensions: sector.dimensions.trim(),
                        })),
                      accessControl: {
                        ...normalizeAccessControl(item),
                        pendingInvites: (item.accessControl?.pendingInvites || []).map((invite) => ({
                          ...invite,
                          email: invite.email?.trim().toLowerCase() || '',
                        })),
                        collaborators: (item.accessControl?.collaborators || [])
                          .filter((member) => member.email?.trim())
                          .map((member) => ({
                            ...member,
                            email: member.email.trim().toLowerCase(),
                            name: member.name?.trim() || member.email.split('@')[0],
                            finePermissions: createPermissionSet(member.role, member.finePermissions || {}),
                          })),
                      },
                    })),
                };

                const result = updateProfile(normalized);

                if (result.error) {
                  setFeedback({ type: 'error', message: result.error });
                  return;
                }

                setFeedback({ type: 'success', message: 'Perfil atualizado com sucesso.' });
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
