import { useState } from 'react';
import { Divider, GridLegacy as Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../components/Iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../../sections/@dashboard/app';
import { sensorWidgets } from './model';

export default function MonitoringAnalytics() {
  const theme = useTheme();
  const [dashboardReferenceTime] = useState(() => Date.now());

  return (
    <>
      <Grid item xs={12}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          Painel analítico consolidado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Organização única dos dashboards com indicadores operacionais, sensores, custos e evolução das hortas.
        </Typography>
      </Grid>

      {sensorWidgets.map((sensor) => (
        <Grid key={sensor.title} item xs={12} sm={6} md={3}>
          <AppWidgetSummary title={sensor.title} total={sensor.total} color={sensor.color} icon1={sensor.icon1} />
        </Grid>
      ))}

      <Grid item xs={12} md={6} lg={8}>
        <AppWebsiteVisits
          title="Desempenho das hortas"
          subheader="Comparativo de produtividade mensal"
          chartLabels={[
            '01/01/2022',
            '02/01/2022',
            '03/01/2022',
            '04/01/2022',
            '05/01/2022',
            '06/01/2022',
            '07/01/2022',
            '08/01/2022',
            '09/01/2022',
            '10/01/2022',
            '11/01/2022',
          ]}
          chartData={[
            {
              name: 'Estufa A',
              type: 'column',
              fill: 'solid',
              data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
            },
            {
              name: 'Canteiro B',
              type: 'area',
              fill: 'gradient',
              data: [44, 55, 76, 67, 22, 43, 21, 41, 56, 27, 43],
            },
            {
              name: 'Hidroponia',
              type: 'line',
              fill: 'solid',
              data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
            },
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <AppCurrentVisits
          title="Distribuição de produção por horta"
          chartData={[
            { label: 'Estufa A', value: 4344 },
            { label: 'Canteiro B', value: 5435 },
            { label: 'Hidroponia', value: 1443 },
            { label: 'Jardim Vertical', value: 4443 },
          ]}
          chartColors={[
            theme.palette.primary.main,
            theme.palette.chart.red[0],
            theme.palette.chart.violet[0],
            theme.palette.chart.yellow[0],
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <AppConversionRates
          title="Custos operacionais por horta"
          subheader="Comparativo por unidade monitorada"
          chartData={[
            { label: 'Estufa A', value: 400 },
            { label: 'Canteiro B', value: 430 },
            { label: 'Hidroponia', value: 448 },
            { label: 'Jardim Vertical', value: 470 },
            { label: 'Mudas', value: 540 },
            { label: 'Irrigação', value: 580 },
            { label: 'Nutrientes', value: 690 },
            { label: 'Manutenção', value: 1100 },
            { label: 'Energia', value: 1200 },
            { label: 'Logística', value: 1380 },
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <AppCurrentSubject
          title="Sensores ativos por cultivo"
          chartLabels={[
            'Umidade do solo',
            'Temperatura ambiente',
            'Umidade do ar',
            'Luminosidade',
            'pH',
            'EC / condutividade',
            'Nível de reservatório',
            'Fluxo',
          ]}
          chartData={[
            { name: 'Estufa A', data: [82, 71, 65, 78, 73, 52, 69, 48] },
            { name: 'Canteiro B', data: [74, 67, 61, 70, 69, 45, 72, 41] },
            { name: 'Hidroponia', data: [88, 69, 72, 66, 76, 81, 77, 64] },
          ]}
          chartColors={[...Array(8)].map(() => theme.palette.text.secondary)}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <AppNewsUpdate
          title="Atualizações e comunicados relevantes"
          list={[...Array(5)].map((_, index) => ({
            id: `atualizacao-${index + 1}`,
            title: 'Atualização operacional registrada',
            description: 'Acompanhe os detalhes no painel de monitoramento',
            image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
            postedAt: new Date(dashboardReferenceTime - (index + 1) * 60 * 60 * 1000),
          }))}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <AppOrderTimeline
          title="Linha do tempo operacional"
          list={[...Array(5)].map((_, index) => ({
            id: `atividade-${index + 1}`,
            title: [
              'Estufa A registrada',
              'Compra de insumos concluída',
              'Chamado técnico aberto',
              'Canteiro B atualizado',
              'Checklist diário finalizado',
            ][index],
            type: `order${index + 1}`,
            time: new Date(dashboardReferenceTime - (index + 1) * 24 * 60 * 60 * 1000),
          }))}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <AppTrafficBySite
          title="Monitoramento de infraestrutura"
          list={[
            {
              name: 'Nível de água',
              value: 10,
              icon: <Iconify icon={'icon-park:water-level'} color="#1877F2" width={32} height={32} />,
            },
            {
              name: 'Nível da bateria',
              value: 100,
              icon: <Iconify icon={'emojione:battery'} color="#DF3E30" width={32} height={32} />,
            },
            {
              name: 'Alertas de praga',
              value: 0,
              icon: <Iconify icon={'icon-park:bug'} color="#006097" width={32} height={32} />,
            },
            {
              name: 'Notificações',
              value: 0,
              icon: <Iconify icon={'streamline-emojis:bell'} color="#1C9CEA" width={32} height={32} />,
            },
          ]}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <AppTasks
          title="Tarefas planejadas da operação"
          list={[
            { id: '1', label: 'Agendar poda preventiva para a Estufa A' },
            { id: '2', label: 'Programar controle de pragas na Hidroponia' },
            { id: '3', label: 'Reorganizar plantas no Jardim Vertical' },
            { id: '4', label: 'Ajustar umidade do solo para 70%' },
            { id: '5', label: 'Realizar troca de água do reservatório' },
          ]}
        />
      </Grid>
    </>
  );
}
