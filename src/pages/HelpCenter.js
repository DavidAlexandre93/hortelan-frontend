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
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import Page from '../components/Page';
import HortelanPromoBanner from '../components/HortelanPromoBanner';
import GSAPTypingText from '../components/GSAPTypingText';

const faqItems = [
  {
    question: 'Como reconectar um sensor offline?',
    answer: 'Acesse Dispositivos > Diagnóstico, confirme bateria e sinal LoRa/Wi-Fi e execute a reconexão assistida.',
  },
  {
    question: 'Como ajustar metas de irrigação?',
    answer: 'No módulo de automação, selecione a horta e altere os limites alvo de umidade e temperatura.',
  },
  {
    question: 'Como exportar relatórios?',
    answer: 'Abra Relatórios, escolha o período e use Exportar em PDF ou CSV para compartilhar com sua equipe.',
  },
];

const quickGuides = ['Primeiros 15 minutos na plataforma', 'Configuração de alertas críticos', 'Checklist semanal da horta'];
const tutorials = ['Tour do painel de monitoramento', 'Como abrir e acompanhar chamados', 'Automação de irrigação por regras'];
const knowledgeBase = ['Troubleshooting de sensores', 'Boas práticas de cultivo por espécie', 'Integração com clima e prevenção de riscos'];

const ticketSeed = [
  {
    id: 'CH-2198',
    issue: 'Sensor de umidade sem telemetria',
    status: 'Em análise',
    priority: 'Alta',
    updatedAt: 'Hoje, 11:12',
    messages: 3,
  },
  {
    id: 'CH-2171',
    issue: 'Atraso na rotina de irrigação automática',
    status: 'Aguardando cliente',
    priority: 'Média',
    updatedAt: 'Ontem, 17:40',
    messages: 5,
  },
  {
    id: 'CH-2139',
    issue: 'Falha de autenticação em dispositivo de campo',
    status: 'Resolvido',
    priority: 'Alta',
    updatedAt: '22/01, 09:24',
    messages: 7,
  },
];

const statusColor = {
  'Em análise': 'info',
  'Aguardando cliente': 'warning',
  Resolvido: 'success',
};

const priorities = ['Baixa', 'Média', 'Alta', 'Crítica'];
const categories = ['Conectividade', 'Automação', 'App/Web', 'Conta e acesso', 'Cobrança'];

const socialChannels = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hortelan_agtech/',
    helper: '@hortelan_agtech',
    icon: <InstagramIcon fontSize="small" />,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@HortelanAgTechLtda',
    helper: '@HortelanAgTechLtda',
    icon: <YouTubeIcon fontSize="small" />,
  },
  {
    label: 'E-mail',
    href: 'mailto:hortelanagtechltda@gmail.com',
    helper: 'hortelanagtechltda@gmail.com',
    icon: <EmailRoundedIcon fontSize="small" />,
  },
];

export default function HelpCenter() {
  const [tab, setTab] = useState('central-ajuda');
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[1]);
  const [withContext, setWithContext] = useState(true);
  const [remoteConsent, setRemoteConsent] = useState(false);

  const openTickets = useMemo(() => ticketSeed.filter((ticket) => ticket.status !== 'Resolvido'), []);

  return (
    <Page title="Central de Suporte">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              <GSAPTypingText
                texts={[
                  'Central de ajuda e suporte',
                  'Suporte técnico especializado para sua horta conectada',
                  'Resolva incidentes com contexto de sensores e automações',
                ]}
              />
            </Typography>
            <Typography color="text.secondary">
              <GSAPTypingText
                texts={[
                  'Consulte conteúdos de autoatendimento, abra chamados e acompanhe tickets com contexto técnico.',
                  'Tenha acesso rápido a FAQ, histórico de tickets e suporte contextual em um só lugar.',
                ]}
                speed={28}
                eraseSpeed={17}
                holdDuration={1100}
                startDelay={200}
              />
            </Typography>
          </Box>

          <HortelanPromoBanner />

          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Canais oficiais Hortelan AgTech Ltda</Typography>
                <Typography variant="body2" color="text.secondary">
                  Para conteúdos técnicos, novidades e suporte comercial, acompanhe e fale com a Hortelan AgTech Ltda pelos canais abaixo.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
                  {socialChannels.map((channel) => (
                    <Button
                      key={channel.label}
                      component={Link}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={channel.icon}
                      variant="outlined"
                    >
                      {channel.label}: {channel.helper}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
                <Tab value="central-ajuda" icon={<HelpOutlineRoundedIcon />} iconPosition="start" label="Central de ajuda" />
                <Tab value="abrir-chamado" icon={<SupportAgentRoundedIcon />} iconPosition="start" label="Abertura de chamado" />
                <Tab value="acompanhamento" icon={<HistoryRoundedIcon />} iconPosition="start" label="Acompanhamento" />
                <Tab value="contextual" icon={<SensorsRoundedIcon />} iconPosition="start" label="Suporte contextual" />
              </Tabs>
            </CardContent>
          </Card>

          {tab === 'central-ajuda' && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      FAQ
                    </Typography>
                    <List disablePadding>
                      {faqItems.map((item) => (
                        <ListItem key={item.question} disableGutters>
                          <ListItemText primary={item.question} secondary={item.answer} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Guias rápidos
                    </Typography>
                    <List dense disablePadding>
                      {quickGuides.map((guide) => (
                        <ListItem key={guide} disableGutters>
                          <ListItemText primary={guide} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tutoriais de uso
                    </Typography>
                    <List dense disablePadding>
                      {tutorials.map((tutorial) => (
                        <ListItem key={tutorial} disableGutters>
                          <ListItemText primary={tutorial} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Base de conhecimento
                    </Typography>
                    <List dense disablePadding>
                      {knowledgeBase.map((article) => (
                        <ListItem key={article} disableGutters>
                          <ListItemText primary={article} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tab === 'abrir-chamado' && (
            <Card>
              <CardContent>
                <Stack spacing={2.5}>
                  <Typography variant="h6">Formulário de suporte</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Categoria do problema</InputLabel>
                        <Select value={category} label="Categoria do problema" onChange={(event) => setCategory(event.target.value)}>
                          {categories.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Prioridade</InputLabel>
                        <Select value={priority} label="Prioridade" onChange={(event) => setPriority(event.target.value)}>
                          {priorities.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button fullWidth variant="outlined" sx={{ height: '100%' }}>
                        Anexar print/foto
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline minRows={4} label="Descreva o problema" placeholder="Informe sintomas, horário e ações já realizadas." />
                    </Grid>
                  </Grid>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained">Abrir chamado</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {tab === 'acompanhamento' && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Status do ticket e conversa com suporte
                    </Typography>
                    <List disablePadding>
                      {openTickets.map((ticket) => (
                        <ListItem key={ticket.id} divider>
                          <ListItemText
                            primary={`${ticket.id} · ${ticket.issue}`}
                            secondary={`Atualizado em ${ticket.updatedAt} · ${ticket.messages} mensagens`}
                          />
                          <Stack direction="row" spacing={1}>
                            <Chip label={ticket.priority} size="small" variant="outlined" />
                            <Chip label={ticket.status} color={statusColor[ticket.status]} size="small" />
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Histórico de chamados
                    </Typography>
                    <List disablePadding>
                      {ticketSeed.map((ticket) => (
                        <ListItem key={ticket.id} disableGutters>
                          <ListItemText primary={ticket.id} secondary={ticket.issue} />
                        </ListItem>
                      ))}
                    </List>
                    <Alert severity="info" sx={{ mt: 1.5 }}>
                      SLA detalhado será habilitado na fase avançada, com metas por criticidade e tipo de contrato.
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tab === 'contextual' && (
            <Card>
              <CardContent>
                <Stack spacing={2.5}>
                  <Typography variant="h6">Suporte contextual (fase avançada)</Typography>
                  <FormControlLabel
                    control={<Switch checked={withContext} onChange={(event) => setWithContext(event.target.checked)} />}
                    label="Abrir chamado com dados da horta e dispositivo anexados automaticamente"
                  />
                  <Alert severity={withContext ? 'success' : 'warning'}>
                    {withContext
                      ? 'Contexto ativo: horta Estufa A, gateway-01, leituras das últimas 24h e alarmes relacionados serão enviados no ticket.'
                      : 'Contexto desativado: o chamado será aberto sem dados técnicos automáticos.'}
                  </Alert>
                  <FormControlLabel
                    control={<Switch checked={remoteConsent} onChange={(event) => setRemoteConsent(event.target.checked)} />}
                    label="Consentimento para diagnóstico remoto assistido"
                  />
                  <Typography variant="body2" color="text.secondary">
                    O diagnóstico remoto acessa somente telemetria e logs técnicos durante a sessão de suporte. Você pode revogar o consentimento a qualquer momento.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </Page>
  );
}
