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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Page from '../components/Page';

const accountStatusColor = {
  ativa: 'success',
  inativa: 'default',
  bloqueada: 'error',
  pendente: 'warning',
};

const users = [
  { id: 1, nome: 'Ana Souza', perfil: 'Produtor', status: 'ativa', ultimoAcesso: 'Hoje 09:22' },
  { id: 2, nome: 'Carlos Lima', perfil: 'Revenda', status: 'bloqueada', ultimoAcesso: 'Ontem 18:11' },
  { id: 3, nome: 'Marina Melo', perfil: 'Consultora', status: 'inativa', ultimoAcesso: '12/02/2026 07:43' },
  { id: 4, nome: 'Equipe Fazenda Sol', perfil: 'Empresa', status: 'pendente', ultimoAcesso: '11/02/2026 20:14' },
];

const devices = [
  { modelo: 'Hortelan Sense v2', firmware: '2.4.1', parque: 1240, problematicos: 28 },
  { modelo: 'Hortelan Pump Pro', firmware: '1.9.8', parque: 890, problematicos: 12 },
  { modelo: 'Hortelan Hub Mini', firmware: '3.1.0', parque: 642, problematicos: 41 },
];

const cmsContent = [
  { tipo: 'Artigo', titulo: '5 práticas para melhorar a umidade do solo', status: 'Publicado' },
  { tipo: 'Guia', titulo: 'Guia de cultivo de alface hidropônica', status: 'Em revisão' },
  { tipo: 'FAQ', titulo: 'Como resetar meu dispositivo IoT?', status: 'Publicado' },
  { tipo: 'Onboarding', titulo: 'Primeiros 7 dias no Hortelan', status: 'Rascunho' },
];

const communityQueue = [
  { item: 'Post “Insetos nas folhas”', acao: 'Moderar comentário', severidade: 'Média' },
  { item: 'Comentário com ofensa', acao: 'Revisar denúncia', severidade: 'Alta' },
  { item: 'Campanha “Colheita de Outono”', acao: 'Publicar destaque', severidade: 'Baixa' },
];

const storeSnapshot = [
  { categoria: 'Sensores', produtos: 14, estoqueBaixo: 2, promocao: 'Kit irrigação -10%' },
  { categoria: 'Nutrientes', produtos: 21, estoqueBaixo: 5, promocao: 'Frete grátis acima de R$250' },
  { categoria: 'Acessórios', produtos: 32, estoqueBaixo: 4, promocao: 'Cupom BEMVINDO15' },
];

const billingSnapshot = {
  planosAtivos: 1876,
  cobrancasAbertas: 142,
  inadimplentes: 34,
  receitaMensal: 'R$ 428.900,00',
};

const observability = [
  { metrica: 'Saúde dos serviços', valor: 98, detalhe: 'API, auth e IoT broker' },
  { metrica: 'Erros frontend/backend', valor: 82, detalhe: 'Taxa de resolução em 24h' },
  { metrica: 'Disponibilidade', valor: 99.7, detalhe: 'Últimos 30 dias' },
  { metrica: 'Cobertura de logs', valor: 91, detalhe: 'Logs com rastreio por tenant' },
];

function SectionCard({ title, subtitle, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5} mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

export default function User() {
  const [selectedSupportAction, setSelectedSupportAction] = useState('reset');
  const [selectedUser, setSelectedUser] = useState(users[0].id);

  const selectedUserData = useMemo(() => users.find((user) => user.id === selectedUser), [selectedUser]);

  return (
    <Page title="Admin | Gestão operacional">
      <Container>
        <Stack spacing={1} mb={4}>
          <Typography variant="h4">Central de Gestão (Admin)</Typography>
          <Typography variant="body2" color="text.secondary">
            Painel único para operação de usuários, dispositivos IoT, conteúdo, comunidade, loja,
            faturamento e observabilidade.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SectionCard
              title="18.1 Gestão de usuários"
              subtitle="Listagem, status da conta e ações de suporte operacional."
            >
              <Stack spacing={2.5}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Usuário</TableCell>
                        <TableCell>Perfil</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Último acesso</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.nome}</TableCell>
                          <TableCell>{user.perfil}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={user.status}
                              color={accountStatusColor[user.status]}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{user.ultimoAcesso}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" variant="outlined">
                                {user.status === 'ativa' ? 'Desativar' : 'Ativar'}
                              </Button>
                              <Button size="small" variant="text">
                                Verificar conta
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <TextField
                    select
                    label="Usuário para suporte"
                    value={selectedUser}
                    onChange={(event) => setSelectedUser(Number(event.target.value))}
                    sx={{ minWidth: 280 }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Ação"
                    value={selectedSupportAction}
                    onChange={(event) => setSelectedSupportAction(event.target.value)}
                    sx={{ minWidth: 220 }}
                  >
                    <MenuItem value="reset">Reset de conta</MenuItem>
                    <MenuItem value="bloqueio">Bloqueio preventivo</MenuItem>
                    <MenuItem value="analise">Abrir análise de segurança</MenuItem>
                  </TextField>
                  <Button variant="contained">Executar suporte</Button>
                </Stack>
                <Alert severity="info">
                  Conta selecionada: <strong>{selectedUserData?.nome}</strong> ({selectedUserData?.status}).
                </Alert>
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard
              title="18.2 Dispositivos e catálogo IoT"
              subtitle="Modelos suportados, firmware, parque instalado e diagnóstico."
            >
              <List dense disablePadding>
                {devices.map((device) => (
                  <ListItem key={device.modelo} divider>
                    <ListItemText
                      primary={`${device.modelo} • Firmware ${device.firmware}`}
                      secondary={`Parque instalado: ${device.parque} • Problemáticos: ${device.problematicos}`}
                    />
                    <Button size="small">Diagnóstico</Button>
                  </ListItem>
                ))}
              </List>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard
              title="18.3 Gestão de conteúdo (CMS leve)"
              subtitle="Artigos, dicas, guias, FAQs e conteúdo de onboarding."
            >
              <Stack spacing={1.2}>
                {cmsContent.map((content) => (
                  <Card key={content.titulo} variant="outlined" sx={{ p: 1.2 }}>
                    <Typography variant="subtitle2">{content.titulo}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {content.tipo} • {content.status}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard
              title="18.4 Gestão da comunidade"
              subtitle="Moderação, denúncias, regras e destaques de campanhas."
            >
              <Stack spacing={1.2}>
                {communityQueue.map((entry) => (
                  <Box
                    key={entry.item}
                    sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}
                  >
                    <Typography variant="subtitle2">{entry.item}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.acao} • Severidade {entry.severidade}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard
              title="18.5 Gestão da loja"
              subtitle="Produtos, categorias, estoque, promoções, cupons e pedidos/logística."
            >
              <List dense disablePadding>
                {storeSnapshot.map((category) => (
                  <ListItem key={category.categoria} divider>
                    <ListItemText
                      primary={`${category.categoria} • ${category.produtos} produtos`}
                      secondary={`Estoque baixo: ${category.estoqueBaixo} • Promoção: ${category.promocao}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="caption" color="text.secondary">
                Integração com ERP/frete planejada para a fase avançada.
              </Typography>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionCard
              title="18.6 Assinaturas e faturamento"
              subtitle="Planos, cobranças, inadimplência e relatórios financeiros operacionais."
            >
              <Stack spacing={1.5}>
                <Typography variant="body2">Planos ativos: {billingSnapshot.planosAtivos}</Typography>
                <Typography variant="body2">Cobranças em aberto: {billingSnapshot.cobrancasAbertas}</Typography>
                <Typography variant="body2">Inadimplentes: {billingSnapshot.inadimplentes}</Typography>
                <Typography variant="body2">Receita mensal: {billingSnapshot.receitaMensal}</Typography>
                <Button variant="outlined" size="small">
                  Exportar relatório operacional
                </Button>
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12}>
            <SectionCard
              title="18.7 Observabilidade da plataforma"
              subtitle="Logs, saúde de serviços, erros FE/BE, métricas de uso e alertas de disponibilidade."
            >
              <Grid container spacing={2}>
                {observability.map((item) => (
                  <Grid key={item.metrica} item xs={12} md={3}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">{item.metrica}</Typography>
                        <Typography variant="h5">{item.valor}%</Typography>
                        <LinearProgress variant="determinate" value={item.valor} />
                        <Typography variant="caption" color="text.secondary">
                          {item.detalhe}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
