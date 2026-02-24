import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Page from '../components/Page';
import useAuth from '../auth/useAuth';

const PLAN_CATALOG = {
  free: {
    label: 'Plano gratuito',
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: {
      gardens: 1,
      devices: 2,
      dataHistoryDays: 30,
      aiPhotoDiagnostics: 10,
      advancedExports: 1,
    },
    features: ['Até 1 horta', '2 dispositivos', '30 dias de histórico', 'IA básica por foto'],
  },
  premium: {
    label: 'Plano premium',
    monthlyPrice: 39,
    yearlyPrice: 390,
    limits: {
      gardens: 5,
      devices: 12,
      dataHistoryDays: 365,
      aiPhotoDiagnostics: 120,
      advancedExports: 15,
    },
    features: ['5 hortas', 'Monitoramento estendido', 'Exportações avançadas', 'Suporte prioritário'],
  },
  family: {
    label: 'Plano família/equipe',
    monthlyPrice: 79,
    yearlyPrice: 790,
    limits: {
      gardens: 12,
      devices: 40,
      dataHistoryDays: 730,
      aiPhotoDiagnostics: 320,
      advancedExports: 60,
    },
    features: ['Colaboração em equipe', 'Permissões por membro', 'Histórico estendido', 'Relatórios compartilhados'],
  },
  b2b: {
    label: 'Plano educacional/empresa (B2B)',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    limits: {
      gardens: 80,
      devices: 200,
      dataHistoryDays: 1825,
      aiPhotoDiagnostics: 999,
      advancedExports: 240,
    },
    features: ['SLA dedicado', 'Gestão multiunidade', 'SSO/controles corporativos', 'Integrações avançadas'],
  },
};

const DEFAULT_SUBSCRIPTION = {
  plan: 'free',
  status: 'active',
  billingCycle: 'monthly',
  renewalDate: null,
  seats: 1,
  limits: PLAN_CATALOG.free.limits,
  usage: {
    gardens: 0,
    devices: 0,
    aiPhotoDiagnostics: 0,
    advancedExports: 0,
  },
  billingHistory: [],
};

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR');

export default function Subscriptions() {
  const { user, updateProfile } = useAuth();
  const subscription = user?.subscription || DEFAULT_SUBSCRIPTION;

  const [selectedPlan, setSelectedPlan] = useState(subscription.plan);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle || 'monthly');
  const [feedback, setFeedback] = useState(null);

  const activePlan = PLAN_CATALOG[selectedPlan] || PLAN_CATALOG.free;

  const currentUsage = useMemo(
    () => ({
      gardens: user?.gardens?.length || subscription.usage?.gardens || 0,
      devices: subscription.usage?.devices || 0,
      aiPhotoDiagnostics: subscription.usage?.aiPhotoDiagnostics || 0,
      advancedExports: subscription.usage?.advancedExports || 0,
    }),
    [subscription.usage, user?.gardens?.length]
  );

  const buildProfilePayload = (nextSubscription) => ({
    name: user?.name || '',
    photoURL: user?.photoURL || '',
    bio: user?.bio || '',
    preferences: user?.preferences || {},
    notifications: user?.notifications || {},
    savedAddresses: user?.savedAddresses || [],
    cultivationLevel: user?.cultivationLevel || 'iniciante',
    gardens: user?.gardens || [],
    subscription: nextSubscription,
  });

  const saveSubscription = (nextSubscription, successMessage) => {
    const result = updateProfile(buildProfilePayload(nextSubscription));

    if (result?.error) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ type: 'success', message: successMessage });
  };

  const handlePlanChange = () => {
    const now = new Date();
    const renewalDate = billingCycle === 'yearly'
      ? new Date(now.setFullYear(now.getFullYear() + 1)).toISOString()
      : new Date(now.setMonth(now.getMonth() + 1)).toISOString();

    const nextSubscription = {
      ...subscription,
      plan: selectedPlan,
      status: 'active',
      billingCycle,
      renewalDate,
      limits: activePlan.limits,
      seats: selectedPlan === 'family' ? 5 : selectedPlan === 'b2b' ? 20 : 1,
      billingHistory: [
        {
          id: `invoice-${Date.now()}`,
          date: new Date().toISOString(),
          description: `${activePlan.label} (${billingCycle === 'yearly' ? 'anual' : 'mensal'})`,
          amount: billingCycle === 'yearly' ? activePlan.yearlyPrice : activePlan.monthlyPrice,
          status: 'paid',
        },
        ...(subscription.billingHistory || []),
      ],
      usage: {
        ...currentUsage,
      },
    };

    saveSubscription(nextSubscription, 'Assinatura atualizada com sucesso.');
  };

  const handleCancel = () => {
    saveSubscription(
      {
        ...subscription,
        status: 'canceled',
      },
      'Assinatura cancelada. Você mantém acesso até o fim do ciclo atual.'
    );
  };

  const handleRenew = () => {
    saveSubscription(
      {
        ...subscription,
        status: 'active',
      },
      'Renovação reativada com sucesso.'
    );
  };

  return (
    <Page title="Assinaturas e planos">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Assinaturas e planos</Typography>

          {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">16.1 Planos de uso</Typography>
              <Typography variant="body2" color="text.secondary">
                Escolha o melhor plano para sua operação: gratuito, premium, família/equipe ou educacional/empresa (B2B).
              </Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="plan-select-label">Plano</InputLabel>
                  <Select
                    labelId="plan-select-label"
                    value={selectedPlan}
                    label="Plano"
                    onChange={(event) => setSelectedPlan(event.target.value)}
                  >
                    {Object.entries(PLAN_CATALOG).map(([value, plan]) => (
                      <MenuItem key={value} value={value}>{plan.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="billing-select-label">Ciclo de cobrança</InputLabel>
                  <Select
                    labelId="billing-select-label"
                    value={billingCycle}
                    label="Ciclo de cobrança"
                    onChange={(event) => setBillingCycle(event.target.value)}
                  >
                    <MenuItem value="monthly">Mensal</MenuItem>
                    <MenuItem value="yearly">Anual</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Typography variant="h5">
                  {formatCurrency(billingCycle === 'yearly' ? activePlan.yearlyPrice : activePlan.monthlyPrice)}
                  <Typography component="span" variant="body2" color="text.secondary"> / {billingCycle === 'yearly' ? 'ano' : 'mês'}</Typography>
                </Typography>
                <Button variant="contained" onClick={handlePlanChange}>Confirmar upgrade/downgrade</Button>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {activePlan.features.map((feature) => (
                  <Chip key={feature} label={feature} sx={{ mb: 1 }} />
                ))}
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">16.2 Gestão da assinatura</Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">Status atual</Typography>
                  <Chip
                    color={subscription.status === 'active' ? 'success' : 'warning'}
                    label={subscription.status === 'active' ? 'Ativa' : 'Cancelada'}
                    sx={{ width: 'fit-content' }}
                  />
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">Próxima renovação</Typography>
                  <Typography variant="subtitle2">{subscription.renewalDate ? formatDate(subscription.renewalDate) : 'Não definido'}</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" color="error" onClick={handleCancel}>Cancelar</Button>
                  <Button variant="outlined" onClick={handleRenew}>Renovar</Button>
                </Stack>
              </Stack>

              <Divider />

              <Typography variant="subtitle2">Histórico de cobrança</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(subscription.billingHistory || []).slice(0, 6).map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">16.3 Controle de limites por plano</Typography>
              {[
                ['Número de hortas', currentUsage.gardens, subscription.limits?.gardens || 1],
                ['Número de dispositivos', currentUsage.devices, subscription.limits?.devices || 1],
                ['IA/diagnóstico por foto', currentUsage.aiPhotoDiagnostics, subscription.limits?.aiPhotoDiagnostics || 1],
                ['Exportações avançadas', currentUsage.advancedExports, subscription.limits?.advancedExports || 1],
              ].map(([label, used, limit]) => {
                const ratio = Math.min((Number(used) / Number(limit)) * 100, 100);

                return (
                  <Box key={label}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2" color="text.secondary">{used}/{limit}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={Number.isNaN(ratio) ? 0 : ratio} sx={{ mt: 1 }} />
                  </Box>
                );
              })}

              <Alert severity="info">
                Histórico de dados disponível por {subscription.limits?.dataHistoryDays || 30} dias para o plano atual.
              </Alert>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
