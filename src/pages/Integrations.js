import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import Page from '../components/Page';
import useAuth from '../auth/useAuth';

const INTEGRATION_SECTIONS = [
  {
    id: 'weather',
    title: '23.1 Integrações de clima e geodados',
    icon: <CloudSyncRoundedIcon color="primary" />,
    items: [
      { id: 'weatherApis', label: 'APIs de clima', phase: 'active' },
      { id: 'seasonalityData', label: 'Dados regionais de sazonalidade', phase: 'active' },
    ],
  },
  {
    id: 'payments',
    title: '23.2 Integrações de pagamento',
    icon: <ScienceRoundedIcon color="primary" />,
    items: [
      { id: 'paymentGateway', label: 'Gateway de pagamento', phase: 'active' },
      { id: 'antifraud', label: 'Antifraude (se e-commerce robusto)', phase: 'beta' },
    ],
  },
  {
    id: 'logistics',
    title: '23.3 Integrações logísticas',
    icon: <LocalShippingRoundedIcon color="primary" />,
    items: [
      { id: 'shippingTracking', label: 'Frete/rastreamento', phase: 'active' },
      { id: 'carriers', label: 'Correios/transportadoras (quando loja ativa)', phase: 'beta' },
    ],
  },
  {
    id: 'messaging',
    title: '23.4 Integrações de mensageria',
    icon: <MarkEmailReadRoundedIcon color="primary" />,
    items: [
      { id: 'transactionalEmail', label: 'E-mail transacional', phase: 'active' },
      { id: 'pushNotifications', label: 'Push notifications', phase: 'active' },
      { id: 'whatsappSms', label: 'WhatsApp/SMS (futuro)', phase: 'future' },
    ],
  },
  {
    id: 'ecosystem',
    title: '23.5 Integrações IoT/ecossistema',
    icon: <MemoryRoundedIcon color="primary" />,
    items: [
      { id: 'multiManufacturer', label: 'Suporte a múltiplos fabricantes (futuro)', phase: 'future' },
      { id: 'publicPartnerApi', label: 'API pública para parceiros (fase avançada)', phase: 'future' },
    ],
  },
];

const phaseChipProps = {
  active: { label: 'Disponível', color: 'success' },
  beta: { label: 'Beta', color: 'warning' },
  future: { label: 'Futuro', color: 'default' },
};

const buildProfilePayload = (user, integrationSettings) => ({
  name: user?.name || '',
  photoURL: user?.photoURL || '',
  bio: user?.bio || '',
  preferences: {
    ...(user?.preferences || {}),
    integrationSettings,
  },
  notifications: user?.notifications || {},
  savedAddresses: user?.savedAddresses || [],
  cultivationLevel: user?.cultivationLevel || 'iniciante',
  gardens: user?.gardens || [],
  subscription: user?.subscription,
});

export default function Integrations() {
  const { user, updateProfile } = useAuth();
  const [feedback, setFeedback] = useState(null);

  const initialStates = useMemo(() => {
    const saved = user?.preferences?.integrationSettings || {};
    return INTEGRATION_SECTIONS.flatMap((section) => section.items).reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: typeof saved[item.id] === 'boolean' ? saved[item.id] : item.phase !== 'future',
      }),
      {}
    );
  }, [user?.preferences?.integrationSettings]);

  const [enabledById, setEnabledById] = useState(initialStates);

  const handleToggle = (integrationId) => {
    setEnabledById((prev) => ({ ...prev, [integrationId]: !prev[integrationId] }));
  };

  const handleSave = () => {
    const result = updateProfile(buildProfilePayload(user, enabledById));

    if (result?.error) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ type: 'success', message: 'Configurações de integrações salvas com sucesso.' });
  };

  return (
    <Page title="Integrações externas">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Integrações externas
            </Typography>
            <Typography color="text.secondary">
              Configure e acompanhe integrações estratégicas para clima, pagamentos, logística, mensageria e ecossistema IoT.
            </Typography>
          </Box>

          {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

          <Alert severity="info">
            Este painel centraliza o roadmap 23.x. Integrações em fase futura podem ser pré-configuradas para facilitar ativação quando disponíveis.
          </Alert>

          <Grid container spacing={2}>
            {INTEGRATION_SECTIONS.map((section) => (
              <Grid item xs={12} md={6} key={section.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {section.icon}
                        <Typography variant="h6">{section.title}</Typography>
                      </Stack>

                      <Divider />

                      {section.items.map((item) => {
                        const phaseProps = phaseChipProps[item.phase];
                        const isFuture = item.phase === 'future';

                        return (
                          <Stack
                            key={item.id}
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                          >
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                              <Typography variant="body2">{item.label}</Typography>
                              <Chip size="small" label={phaseProps.label} color={phaseProps.color} variant="outlined" />
                            </Stack>
                            <Switch checked={Boolean(enabledById[item.id])} onChange={() => handleToggle(item.id)} color="primary" />
                            {isFuture && (
                              <Typography variant="caption" color="text.secondary">
                                Pré-configuração
                              </Typography>
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => setEnabledById(initialStates)}>
              Restaurar padrão
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Salvar integrações
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Page>
  );
}
