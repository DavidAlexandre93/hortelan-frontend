import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
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

const createEmptyGarden = () => ({
  id: `garden-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: '',
  gardenType: 'solo',
  location: '',
  photoURL: '',
});

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
    gardens: user?.gardens?.length ? user.gardens : [createEmptyGarden()],
  }));
  const [feedback, setFeedback] = useState(null);

  const avatarLetter = useMemo(() => (form.name ? form.name[0]?.toUpperCase() : 'U'), [form.name]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
                  </Stack>

                  {index < form.gardens.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() => setField('gardens', [...form.gardens, createEmptyGarden()])}
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
