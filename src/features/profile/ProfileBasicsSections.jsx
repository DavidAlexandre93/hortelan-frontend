import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
import Iconify from '../../components/Iconify';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS, sectionCardContentSx } from './model';

export default function ProfileBasicsSections({ controller }) {
  const { form, setField, avatarLetter } = controller;
  return (
    <>
      <Card>
        <CardContent sx={sectionCardContentSx}>
          <Stack spacing={2}>
            <Typography variant="h6">Dados de perfil</Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Avatar src={form.photoURL} sx={{ width: 64, height: 64 }}>
                {avatarLetter}
              </Avatar>
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
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={sectionCardContentSx}>
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
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={sectionCardContentSx}>
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
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={sectionCardContentSx}>
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
                      nextAddresses[index] = {
                        ...address,
                        label: event.target.value,
                      };
                      setField('savedAddresses', nextAddresses);
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Endereço"
                    value={address.addressLine}
                    onChange={(event) => {
                      const nextAddresses = [...form.savedAddresses];
                      nextAddresses[index] = {
                        ...address,
                        addressLine: event.target.value,
                      };
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
                  {
                    id: `address-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    label: '',
                    addressLine: '',
                  },
                ])
              }
            >
              Adicionar endereço
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

ProfileBasicsSections.propTypes = { controller: PropTypes.object.isRequired };
