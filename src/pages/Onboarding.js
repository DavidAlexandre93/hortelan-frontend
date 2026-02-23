import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormHelperText,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Page from '../components/Page';

const steps = ['Perfil', 'Primeira horta', 'Ambiente', 'IoT e ativação'];
const structureTypes = ['Vaso', 'Canteiro', 'Módulo', 'Torre', 'Reservatório'];
const materialOptions = ['Plástico', 'Cerâmica', 'Madeira', 'Cimento', 'Metal', 'Fibra de coco'];
const pairingMethods = [
  { value: 'qr', label: 'QR Code', helper: 'Escaneie o QR Code exibido no dispositivo para concluir o pareamento.' },
  { value: 'serial', label: 'Código serial', helper: 'Digite o código serial impresso na etiqueta do dispositivo.' },
];
const gardenAreas = ['Horta principal', 'Estufa interna', 'Setor de mudas', 'Jardim vertical'];

const createStructure = () => ({
  type: 'Vaso',
  name: '',
  capacity: '',
  material: 'Plástico',
  sensor: '',
  actuator: '',
});

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [structures, setStructures] = useState([createStructure()]);
  const [pairingMethod, setPairingMethod] = useState('qr');
  const [friendlyName, setFriendlyName] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [selectedArea, setSelectedArea] = useState(gardenAreas[0]);
  const [linkedDevices, setLinkedDevices] = useState([]);

  const updateStructureField = (index, field, value) => {
    setStructures((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const addStructure = () => {
    setStructures((prev) => [...prev, createStructure()]);
  };

  const removeStructure = (index) => {
    setStructures((prev) => {
      if (prev.length === 1) {
        return [createStructure()];
      }

      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const selectedPairingMethod = pairingMethods.find((method) => method.value === pairingMethod);

  const handleLinkDevice = () => {
    if (!friendlyName.trim() || !pairingCode.trim()) {
      return;
    }

    setLinkedDevices((prev) => [
      {
        id: `linked-${Date.now()}`,
        name: friendlyName.trim(),
        code: pairingCode.trim(),
        method: selectedPairingMethod?.label || 'QR Code',
        area: selectedArea,
      },
      ...prev,
    ]);

    setFriendlyName('');
    setPairingCode('');
  };

  return (
    <Page title="Onboarding">
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Onboarding Inteligente — Primeira experiência Hortelan
        </Typography>

        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Nível</InputLabel>
                  <Select label="Nível" defaultValue="iniciante">
                    <MenuItem value="iniciante">Iniciante</MenuItem>
                    <MenuItem value="intermediario">Intermediário</MenuItem>
                    <MenuItem value="avancado">Avançado</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Perfil</InputLabel>
                  <Select label="Perfil" defaultValue="domestico">
                    <MenuItem value="domestico">Doméstico</MenuItem>
                    <MenuItem value="educacional">Educacional</MenuItem>
                    <MenuItem value="comercial">Comercial</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                <TextField label="Nome da horta" defaultValue="Minha horta principal" fullWidth />
                <TextField label="Plantas iniciais" helperText="Ex.: hortelã, alface, manjericão" fullWidth />
                <TextField label="Localização" fullWidth />

                <Divider sx={{ pt: 1 }}>Estruturas de cultivo</Divider>
                <Typography variant="body2" color="text.secondary">
                  Cadastre vasos, canteiros, módulos, torres e reservatórios com volume, material e vínculo IoT.
                </Typography>

                {structures.map((structure, index) => (
                  <Card key={`structure-${index}`} variant="outlined" sx={{ bgcolor: 'background.neutral' }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">Estrutura {index + 1}</Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeStructure(index)}
                            disabled={structures.length === 1}
                            aria-label="Remover estrutura"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <FormControl fullWidth>
                          <InputLabel>Tipo</InputLabel>
                          <Select
                            label="Tipo"
                            value={structure.type}
                            onChange={(event) => updateStructureField(index, 'type', event.target.value)}
                          >
                            {structureTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          label="Nome / Identificador"
                          fullWidth
                          value={structure.name}
                          onChange={(event) => updateStructureField(index, 'name', event.target.value)}
                          placeholder="Ex.: Torre vertical A1"
                        />

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField
                            type="number"
                            label="Capacidade / volume (L)"
                            fullWidth
                            value={structure.capacity}
                            onChange={(event) => updateStructureField(index, 'capacity', event.target.value)}
                          />

                          <FormControl fullWidth>
                            <InputLabel>Material</InputLabel>
                            <Select
                              label="Material"
                              value={structure.material}
                              onChange={(event) => updateStructureField(index, 'material', event.target.value)}
                            >
                              {materialOptions.map((material) => (
                                <MenuItem key={material} value={material}>
                                  {material}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField
                            label="Sensor associado"
                            fullWidth
                            value={structure.sensor}
                            onChange={(event) => updateStructureField(index, 'sensor', event.target.value)}
                            helperText="Ex.: sensor_umidade_01"
                          />
                          <TextField
                            label="Atuador associado"
                            fullWidth
                            value={structure.actuator}
                            onChange={(event) => updateStructureField(index, 'actuator', event.target.value)}
                            helperText="Ex.: valvula_setor_03"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}

                <Box>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={addStructure}>
                    Adicionar estrutura
                  </Button>
                </Box>
              </Stack>
            )}

            {activeStep === 2 && (
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Ambiente</InputLabel>
                  <Select label="Ambiente" defaultValue="externo">
                    <MenuItem value="interno">Interno</MenuItem>
                    <MenuItem value="externo">Externo</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Tipo de espaço</InputLabel>
                  <Select label="Tipo de espaço" defaultValue="varanda">
                    <MenuItem value="varanda">Varanda</MenuItem>
                    <MenuItem value="quintal">Quintal</MenuItem>
                    <MenuItem value="estufa">Estufa</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Incidência solar</InputLabel>
                  <Select label="Incidência solar" defaultValue="media">
                    <MenuItem value="baixa">Baixa</MenuItem>
                    <MenuItem value="media">Média</MenuItem>
                    <MenuItem value="alta">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}

            {activeStep === 3 && (
              <Stack spacing={2}>
                <Typography variant="h6">Vincular dispositivo à conta</Typography>
                <Typography variant="body2" color="text.secondary">
                  Faça o pareamento por QR Code ou código serial, associe o dispositivo à área correta e defina um nome
                  amigável para facilitar o monitoramento.
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Método de pareamento</InputLabel>
                  <Select
                    label="Método de pareamento"
                    value={pairingMethod}
                    onChange={(event) => setPairingMethod(event.target.value)}
                  >
                    {pairingMethods.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{selectedPairingMethod?.helper}</FormHelperText>
                </FormControl>

                <TextField
                  label={pairingMethod === 'qr' ? 'QR Code do dispositivo' : 'Código serial do dispositivo'}
                  value={pairingCode}
                  onChange={(event) => setPairingCode(event.target.value)}
                  fullWidth
                  placeholder={pairingMethod === 'qr' ? 'Ex.: QR-HRT-001-9AF2' : 'Ex.: HRT-SERIAL-45BX-98'}
                />

                <TextField
                  label="Nome amigável do dispositivo"
                  value={friendlyName}
                  onChange={(event) => setFriendlyName(event.target.value)}
                  fullWidth
                  placeholder="Ex.: Sensor de umidade da estufa"
                />

                <FormControl fullWidth>
                  <InputLabel>Horta / área de associação</InputLabel>
                  <Select
                    label="Horta / área de associação"
                    value={selectedArea}
                    onChange={(event) => setSelectedArea(event.target.value)}
                  >
                    {gardenAreas.map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Button
                    variant="contained"
                    onClick={handleLinkDevice}
                    disabled={!friendlyName.trim() || !pairingCode.trim()}
                  >
                    Vincular dispositivo
                  </Button>
                </Box>

                {linkedDevices.length > 0 ? (
                  <Stack spacing={1}>
                    {linkedDevices.map((device) => (
                      <Alert key={device.id} severity="success" variant="outlined">
                        <strong>{device.name}</strong> vinculado via {device.method} ({device.code}) em <strong>{device.area}</strong>.
                      </Alert>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info" variant="outlined">
                    Nenhum dispositivo vinculado nesta etapa ainda.
                  </Alert>
                )}

                <Divider />
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Vincular dispositivo IoT agora" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Habilitar modo manual como fallback" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Checklist de ativação inicial" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Tour guiado no dashboard" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Assistente: Como começar hoje" />
                </FormGroup>
              </Stack>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
                Voltar
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))}
              >
                {activeStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
