import PropTypes from 'prop-types';
import {
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from '../../components/Iconify';
import {
  FINE_PERMISSION_OPTIONS,
  GARDEN_TYPE_OPTIONS,
  ROLE_OPTIONS,
  SECTOR_TYPE_OPTIONS,
  createEmptyGarden,
  createEmptySector,
  createAuditEntry,
  createPermissionSet,
  nestedPanelSx,
  normalizeAccessControl,
  sectionCardContentSx,
} from './model';

export default function GardenAccessSection({ controller }) {
  const { form, setField, updateGarden, handleInviteByEmail, handleAcceptInvite } = controller;
  return (
    <>
      <Card>
        <CardContent sx={sectionCardContentSx}>
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
                        nextGardens[index] = {
                          ...garden,
                          name: event.target.value,
                        };
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
                          nextGardens[index] = {
                            ...garden,
                            gardenType: event.target.value,
                          };
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
                      nextGardens[index] = {
                        ...garden,
                        location: event.target.value,
                      };
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
                      nextGardens[index] = {
                        ...garden,
                        photoURL: event.target.value,
                      };
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
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: 1,
                          objectFit: 'cover',
                          mt: 1,
                        }}
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

                  <Paper variant="outlined" sx={nestedPanelSx}>
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
                                  nextSectors[sectorIndex] = {
                                    ...sector,
                                    name: event.target.value,
                                  };
                                  nextGardens[index] = {
                                    ...garden,
                                    sectors: nextSectors,
                                  };
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
                                    nextSectors[sectorIndex] = {
                                      ...sector,
                                      sectorType: event.target.value,
                                    };
                                    nextGardens[index] = {
                                      ...garden,
                                      sectors: nextSectors,
                                    };
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
                                  nextSectors[sectorIndex] = {
                                    ...sector,
                                    dimensions: event.target.value,
                                  };
                                  nextGardens[index] = {
                                    ...garden,
                                    sectors: nextSectors,
                                  };
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
                  </Paper>

                  <Paper variant="outlined" sx={nestedPanelSx}>
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
                          <Typography variant="body2" color="text.secondary">
                            Nenhum convite pendente.
                          </Typography>
                        ) : (
                          (garden.accessControl?.pendingInvites || []).map((invite) => (
                            <Stack
                              key={invite.id}
                              direction={{ xs: 'column', md: 'row' }}
                              spacing={1}
                              alignItems={{ md: 'center' }}
                            >
                              <Chip
                                size="small"
                                color={invite.status === 'accepted' ? 'success' : 'warning'}
                                label={invite.status === 'accepted' ? 'Aceito' : 'Pendente'}
                              />
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {invite.email} •{' '}
                                {ROLE_OPTIONS.find((option) => option.value === invite.role)?.label || invite.role}
                              </Typography>
                              {invite.status === 'pending' && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleAcceptInvite(index, invite.id)}
                                >
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
                          <Typography variant="body2" color="text.secondary">
                            Ainda não há colaboradores ativos.
                          </Typography>
                        ) : (
                          (garden.accessControl?.collaborators || []).map((member) => (
                            <Card key={member.id} variant="outlined" sx={{ p: 1.5 }}>
                              <Stack spacing={1}>
                                <Stack
                                  direction={{ xs: 'column', md: 'row' }}
                                  spacing={1.5}
                                  alignItems={{ md: 'center' }}
                                >
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
                                            collaborators: (currentGarden.accessControl?.collaborators || []).map(
                                              (currentMember) =>
                                                currentMember.id === member.id
                                                  ? {
                                                      ...currentMember,
                                                      role: nextRole,
                                                      finePermissions: createPermissionSet(
                                                        nextRole,
                                                        currentMember.finePermissions
                                                      ),
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
                                    <Stack
                                      key={`${member.id}-${permission.key}`}
                                      direction="row"
                                      spacing={0.5}
                                      alignItems="center"
                                    >
                                      <Typography variant="caption">{permission.label}</Typography>
                                      <Switch
                                        size="small"
                                        checked={Boolean(member.finePermissions?.[permission.key])}
                                        onChange={(_, checked) => {
                                          updateGarden(index, (currentGarden) => ({
                                            ...currentGarden,
                                            accessControl: {
                                              ...(currentGarden.accessControl || normalizeAccessControl({})),
                                              collaborators: (currentGarden.accessControl?.collaborators || []).map(
                                                (currentMember) =>
                                                  currentMember.id === member.id
                                                    ? {
                                                        ...currentMember,
                                                        finePermissions: {
                                                          ...(currentMember.finePermissions ||
                                                            createPermissionSet(currentMember.role)),
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
                          Eventos rastreados: alteração de automação, acionamento manual de dispositivo e
                          exclusão/alteração de dados.
                        </Typography>
                        {(garden.accessControl?.auditLogs || []).length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Sem registros ainda. O log de acesso ficará disponível em fase avançada.
                          </Typography>
                        ) : (
                          (garden.accessControl?.auditLogs || []).slice(0, 8).map((entry) => (
                            <Alert key={entry.id} severity="info" variant="outlined">
                              <strong>{entry.action}</strong> — {entry.actor} • {entry.target}
                            </Alert>
                          ))
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                </Stack>

                {index < form.gardens.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-outline" />}
              onClick={() =>
                setField('gardens', [
                  ...form.gardens,
                  {
                    ...createEmptyGarden(),
                    accessControl: normalizeAccessControl({}),
                  },
                ])
              }
            >
              Adicionar horta
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

GardenAccessSection.propTypes = { controller: PropTypes.object.isRequired };
