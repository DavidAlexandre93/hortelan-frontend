import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import Page from '../components/Page';

const steps = ['Perfil', 'Primeira horta', 'Ambiente', 'IoT e ativação'];

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);

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
