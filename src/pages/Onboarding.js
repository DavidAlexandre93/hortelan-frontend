import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
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

const guidedFlow = [
  {
    id: 'garden',
    title: 'Criar primeira horta',
    description: 'Defina nome, local e estrutura base para iniciar o cultivo.',
    doneLabel: 'Horta criada',
  },
  {
    id: 'plant',
    title: 'Adicionar primeira planta',
    description: 'Cadastre sua primeira espécie e personalize o espaço de cultivo.',
    doneLabel: 'Planta cadastrada',
  },
  {
    id: 'pairing',
    title: 'Parear dispositivo',
    description: 'Conecte sensor/controlador para monitoramento em tempo real.',
    doneLabel: 'Sensor conectado',
  },
  {
    id: 'automation',
    title: 'Criar primeira automação',
    description: 'Ative regras automáticas para irrigação e alertas.',
    doneLabel: 'Primeira automação criada',
  },
];

const automationSuggestions = [
  {
    id: 'rega',
    label: 'Rega inteligente por umidade',
    description: 'Aciona irrigação quando umidade < 35% por 5 minutos.',
    pedagogicalAlert: 'Evite excesso de rega: mantenha pausa mínima de 3h entre ciclos.',
  },
  {
    id: 'luz',
    label: 'Alerta de luminosidade',
    description: 'Notifica quando houver menos de 4h de luz útil no dia.',
    pedagogicalAlert: 'Mudas jovens precisam de transição gradual para sol pleno.',
  },
  {
    id: 'nutrientes',
    label: 'Lembrete de inspeção semanal',
    description: 'Cria tarefa automática para verificar pH e nutrientes.',
    pedagogicalAlert: 'Registrar medições melhora a precisão das recomendações futuras.',
  },
];

const cultivationTypeTemplates = [
  {
    id: 'folhosas-canteiro',
    label: 'Folhosas em canteiro',
    description: 'Modelo para alface, rúcula e couve com rotação simples.',
    gardenName: 'Canteiro de folhosas',
    initialPlants: 'alface, rúcula, couve',
    structures: [{ type: 'Canteiro', name: 'Canteiro principal', capacity: '180', material: 'Madeira', sensor: 'sensor_umidade_01', actuator: 'valvula_setor_01' }],
  },
  {
    id: 'ervas-vasos',
    label: 'Ervas em vasos',
    description: 'Template compacto para plantas aromáticas de ciclo rápido.',
    gardenName: 'Horta de ervas',
    initialPlants: 'manjericão, hortelã, salsinha',
    structures: [
      { type: 'Vaso', name: 'Vaso aromáticas A', capacity: '18', material: 'Cerâmica', sensor: 'sensor_umidade_ervas', actuator: 'bomba_irrigacao_01' },
      { type: 'Vaso', name: 'Vaso aromáticas B', capacity: '18', material: 'Cerâmica', sensor: 'sensor_umidade_ervas_02', actuator: '' },
    ],
  },
];

const speciesTemplates = [
  { id: 'alface-crespa', label: 'Alface', plants: 'alface crespa, cebolinha', structure: { type: 'Canteiro', name: 'Canteiro alface', capacity: '120', material: 'Madeira' } },
  { id: 'manjericao', label: 'Manjericão', plants: 'manjericão genovês, orégano', structure: { type: 'Vaso', name: 'Vaso manjericão', capacity: '15', material: 'Cerâmica' } },
  { id: 'tomate-cereja', label: 'Tomate-cereja', plants: 'tomate-cereja, manjericão', structure: { type: 'Módulo', name: 'Módulo tomate', capacity: '45', material: 'Plástico' } },
];

const environmentTemplates = [
  { id: 'indoor', label: 'Indoor', environment: 'interno', space: 'estufa', sunlight: 'media', location: 'Ambiente interno com iluminação complementar' },
  { id: 'varanda', label: 'Varanda', environment: 'externo', space: 'varanda', sunlight: 'alta', location: 'Varanda residencial' },
];

const createStructure = () => ({ type: 'Vaso', name: '', capacity: '', material: 'Plástico', sensor: '', actuator: '' });

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [structures, setStructures] = useState([createStructure()]);
  const [pairingMethod, setPairingMethod] = useState('qr');
  const [gardenName, setGardenName] = useState('Minha horta principal');
  const [initialPlants, setInitialPlants] = useState('');
  const [location, setLocation] = useState('');
  const [environment, setEnvironment] = useState('externo');
  const [spaceType, setSpaceType] = useState('varanda');
  const [sunlight, setSunlight] = useState('media');
  const [selectedCultivationTemplate, setSelectedCultivationTemplate] = useState(cultivationTypeTemplates[0].id);
  const [selectedSpeciesTemplate, setSelectedSpeciesTemplate] = useState(speciesTemplates[0].id);
  const [selectedEnvironmentTemplate, setSelectedEnvironmentTemplate] = useState(environmentTemplates[0].id);
  const [friendlyName, setFriendlyName] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [selectedArea, setSelectedArea] = useState(gardenAreas[0]);
  const [linkedDevices, setLinkedDevices] = useState([]);
  const [automationName, setAutomationName] = useState('');
  const [automationCreated, setAutomationCreated] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [checklist, setChecklist] = useState({
    accountCreated: true,
    gardenCreated: false,
    plantRegistered: false,
    sensorConnected: false,
    notificationsEnabled: false,
    firstTaskCompleted: false,
  });

  const selectedPairingMethod = pairingMethods.find((method) => method.value === pairingMethod);

  const guideStatus = useMemo(
    () => ({
      garden: Boolean(gardenName.trim() && location.trim() && structures.some((item) => item.name.trim())),
      plant: Boolean(initialPlants.trim()),
      pairing: linkedDevices.length > 0,
      automation: automationCreated.length > 0,
    }),
    [automationCreated.length, gardenName, initialPlants, linkedDevices.length, location, structures],
  );

  const completion = useMemo(() => {
    const totalChecklist = Object.keys(checklist).length;
    const checklistDone = Object.values(checklist).filter(Boolean).length;
    const guidedDone = Object.values(guideStatus).filter(Boolean).length;
    return Math.round(((checklistDone + guidedDone) / (totalChecklist + guidedFlow.length)) * 100);
  }, [checklist, guideStatus]);

  const updateStructureField = (index, field, value) => {
    setStructures((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const applyCultivationTemplate = () => {
    const template = cultivationTypeTemplates.find((item) => item.id === selectedCultivationTemplate);
    if (!template) return;
    setGardenName(template.gardenName);
    setInitialPlants(template.initialPlants);
    setStructures(template.structures.map((structure) => ({ ...createStructure(), ...structure })));
  };

  const applySpeciesTemplate = () => {
    const template = speciesTemplates.find((item) => item.id === selectedSpeciesTemplate);
    if (!template) return;
    setInitialPlants(template.plants);
    setStructures((prev) => [{ ...prev[0], ...template.structure }, ...prev.slice(1)]);
  };

  const applyEnvironmentTemplate = () => {
    const template = environmentTemplates.find((item) => item.id === selectedEnvironmentTemplate);
    if (!template) return;
    setEnvironment(template.environment);
    setSpaceType(template.space);
    setSunlight(template.sunlight);
    setLocation(template.location);
  };

  const handleChecklistToggle = (field) => {
    setChecklist((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLinkDevice = () => {
    if (!friendlyName.trim() || !pairingCode.trim()) return;
    setLinkedDevices((prev) => [{ id: `linked-${Date.now()}`, name: friendlyName.trim(), code: pairingCode.trim(), method: selectedPairingMethod?.label || 'QR Code', area: selectedArea }, ...prev]);
    setFriendlyName('');
    setPairingCode('');
  };

  const createAutomation = () => {
    if (!automationName.trim()) return;
    setAutomationCreated((prev) => [automationName.trim(), ...prev]);
    setAutomationName('');
  };

  return (
    <Page title="Onboarding">
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Onboarding guiado Hortelan Agtech Ltda</Typography>
            <Typography variant="body2" color="text.secondary">
              Passo a passo para criar sua primeira horta, cadastrar plantas, parear dispositivo e ativar automações.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Progresso inicial</Typography>
                  <Chip label={`${completion}% concluído`} color={completion === 100 ? 'success' : 'primary'} />
                </Stack>
                <LinearProgress value={completion} variant="determinate" />

                <Divider>Checklist inicial</Divider>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={checklist.accountCreated} onChange={() => handleChecklistToggle('accountCreated')} />} label="Conta criada" />
                  <FormControlLabel control={<Checkbox checked={checklist.gardenCreated} onChange={() => handleChecklistToggle('gardenCreated')} />} label="Horta criada" />
                  <FormControlLabel control={<Checkbox checked={checklist.plantRegistered} onChange={() => handleChecklistToggle('plantRegistered')} />} label="Planta cadastrada" />
                  <FormControlLabel control={<Checkbox checked={checklist.sensorConnected} onChange={() => handleChecklistToggle('sensorConnected')} />} label="Sensor conectado" />
                  <FormControlLabel control={<Checkbox checked={checklist.notificationsEnabled} onChange={() => handleChecklistToggle('notificationsEnabled')} />} label="Notificações ativadas" />
                  <FormControlLabel control={<Checkbox checked={checklist.firstTaskCompleted} onChange={() => handleChecklistToggle('firstTaskCompleted')} />} label="Primeira tarefa concluída" />
                </FormGroup>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="subtitle1">Passo a passo guiado</Typography>
                <List dense>
                  {guidedFlow.map((item, index) => (
                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemText
                        primary={`${index + 1}. ${item.title}`}
                        secondary={item.description}
                      />
                      <Chip size="small" color={guideStatus[item.id] ? 'success' : 'default'} label={guideStatus[item.id] ? item.doneLabel : 'Pendente'} />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h6">Demo / modo simulado</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ambiente de demonstração com dados simulados para usuários sem dispositivo.
                    </Typography>
                  </Box>
                  <FormControlLabel control={<Checkbox checked={demoMode} onChange={() => setDemoMode((prev) => !prev)} />} label="Ativar demo" />
                </Stack>
                {demoMode ? (
                  <Alert severity="info" variant="outlined">
                    Dashboard simulado ativo: umidade 41%, luminosidade 78%, reservatório em 63% e recomendação automática de rega para amanhã às 07:00.
                  </Alert>
                ) : (
                  <Alert severity="warning" variant="outlined">
                    Modo demo desativado. Conecte um dispositivo para visualizar dados reais no dashboard.
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 1 && (
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de cultivo</InputLabel>
                      <Select label="Tipo de cultivo" value={selectedCultivationTemplate} onChange={(event) => setSelectedCultivationTemplate(event.target.value)}>
                        {cultivationTypeTemplates.map((template) => <MenuItem key={template.id} value={template.id}>{template.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={applyCultivationTemplate}>Aplicar modelo</Button>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                    <FormControl fullWidth>
                      <InputLabel>Espécie foco</InputLabel>
                      <Select label="Espécie foco" value={selectedSpeciesTemplate} onChange={(event) => setSelectedSpeciesTemplate(event.target.value)}>
                        {speciesTemplates.map((template) => <MenuItem key={template.id} value={template.id}>{template.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={applySpeciesTemplate}>Aplicar espécie</Button>
                  </Stack>

                  <Tooltip title="Dica: comece com 1 a 3 espécies para facilitar ajustes de irrigação.">
                    <TextField label="Plantas iniciais" value={initialPlants} onChange={(event) => setInitialPlants(event.target.value)} fullWidth />
                  </Tooltip>
                  <TextField label="Nome da horta" value={gardenName} onChange={(event) => setGardenName(event.target.value)} fullWidth />
                  <TextField label="Localização" value={location} onChange={(event) => setLocation(event.target.value)} fullWidth />

                  {structures.map((structure, index) => (
                    <Card key={`structure-${index}`} variant="outlined">
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2">Estrutura {index + 1}</Typography>
                            <IconButton color="error" disabled={structures.length === 1} onClick={() => setStructures((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select label="Tipo" value={structure.type} onChange={(event) => updateStructureField(index, 'type', event.target.value)}>
                              {structureTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                            </Select>
                          </FormControl>
                          <TextField label="Nome da estrutura" value={structure.name} onChange={(event) => updateStructureField(index, 'name', event.target.value)} fullWidth />
                          <TextField label="Capacidade (L)" type="number" value={structure.capacity} onChange={(event) => updateStructureField(index, 'capacity', event.target.value)} fullWidth />
                          <FormControl fullWidth>
                            <InputLabel>Material</InputLabel>
                            <Select label="Material" value={structure.material} onChange={(event) => updateStructureField(index, 'material', event.target.value)}>
                              {materialOptions.map((material) => <MenuItem key={material} value={material}>{material}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}

                  <Button startIcon={<AddIcon />} onClick={() => setStructures((prev) => [...prev, createStructure()])} variant="outlined">Adicionar estrutura</Button>
                </Stack>
              )}

              {activeStep === 2 && (
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                    <FormControl fullWidth>
                      <InputLabel>Template de ambiente</InputLabel>
                      <Select label="Template de ambiente" value={selectedEnvironmentTemplate} onChange={(event) => setSelectedEnvironmentTemplate(event.target.value)}>
                        {environmentTemplates.map((template) => <MenuItem key={template.id} value={template.id}>{template.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={applyEnvironmentTemplate}>Aplicar ambiente</Button>
                  </Stack>

                  <FormControl fullWidth>
                    <InputLabel>Ambiente</InputLabel>
                    <Select label="Ambiente" value={environment} onChange={(event) => setEnvironment(event.target.value)}>
                      <MenuItem value="interno">Interno</MenuItem>
                      <MenuItem value="externo">Externo</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de espaço</InputLabel>
                    <Select label="Tipo de espaço" value={spaceType} onChange={(event) => setSpaceType(event.target.value)}>
                      <MenuItem value="varanda">Varanda</MenuItem>
                      <MenuItem value="quintal">Quintal</MenuItem>
                      <MenuItem value="estufa">Estufa</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Incidência solar</InputLabel>
                    <Select label="Incidência solar" value={sunlight} onChange={(event) => setSunlight(event.target.value)}>
                      <MenuItem value="baixa">Baixa</MenuItem>
                      <MenuItem value="media">Média</MenuItem>
                      <MenuItem value="alta">Alta</MenuItem>
                    </Select>
                  </FormControl>

                  <Alert severity="warning" variant="outlined">
                    Alerta pedagógico: evite excesso de rega em ambientes internos; prefira validar umidade antes de cada ciclo.
                  </Alert>
                </Stack>
              )}

              {activeStep === 3 && (
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Método de pareamento</InputLabel>
                    <Select label="Método de pareamento" value={pairingMethod} onChange={(event) => setPairingMethod(event.target.value)}>
                      {pairingMethods.map((method) => <MenuItem key={method.value} value={method.value}>{method.label}</MenuItem>)}
                    </Select>
                    <FormHelperText>{selectedPairingMethod?.helper}</FormHelperText>
                  </FormControl>

                  <TextField label={pairingMethod === 'qr' ? 'QR Code do dispositivo' : 'Código serial do dispositivo'} value={pairingCode} onChange={(event) => setPairingCode(event.target.value)} fullWidth />
                  <TextField label="Nome amigável do dispositivo" value={friendlyName} onChange={(event) => setFriendlyName(event.target.value)} fullWidth />
                  <FormControl fullWidth>
                    <InputLabel>Horta / área de associação</InputLabel>
                    <Select label="Horta / área de associação" value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)}>
                      {gardenAreas.map((area) => <MenuItem key={area} value={area}>{area}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={handleLinkDevice} disabled={!friendlyName.trim() || !pairingCode.trim()}>Vincular dispositivo</Button>

                  <Divider>Primeira automação</Divider>
                  <Tooltip title="Recomendação: inicie por uma regra de irrigação para aprender o comportamento da sua horta.">
                    <TextField label="Nome da automação" value={automationName} onChange={(event) => setAutomationName(event.target.value)} fullWidth />
                  </Tooltip>
                  <Button variant="outlined" onClick={createAutomation} disabled={!automationName.trim()}>Criar automação</Button>

                  <Stack spacing={1}>
                    {automationSuggestions.map((suggestion) => (
                      <Alert key={suggestion.id} severity="info" variant="outlined">
                        <strong>{suggestion.label}</strong>: {suggestion.description} {suggestion.pedagogicalAlert}
                      </Alert>
                    ))}
                  </Stack>

                  {linkedDevices.map((device) => (
                    <Alert key={device.id} severity="success" variant="outlined">
                      {device.name} vinculado via {device.method} ({device.code}) em {device.area}.
                    </Alert>
                  ))}
                  {automationCreated.map((item) => (
                    <Alert key={item} severity="success" variant="outlined">
                      Automação &quot;{item}&quot; criada com sucesso.
                    </Alert>
                  ))}
                </Stack>
              )}

              {activeStep === 0 && (
                <Stack spacing={2}>
                  <Typography variant="subtitle1">Educação contextual</Typography>
                  <Alert severity="info" variant="outlined">Dicas inline aparecem em campos críticos para acelerar sua configuração inicial.</Alert>
                  <Alert severity="info" variant="outlined">Recomendação por etapa: complete um bloco por vez (horta &gt; planta &gt; sensor &gt; automação).</Alert>
                </Stack>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>Voltar</Button>
                <Button variant="contained" onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))}>
                  {activeStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
