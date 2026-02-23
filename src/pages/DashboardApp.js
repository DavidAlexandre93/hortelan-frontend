import { faker } from '@faker-js/faker';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
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
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const [plantas, setPlantas] = useState([]);
  const [novaPlanta, setNovaPlanta] = useState({
    especie: '',
    dataPlantio: '',
    quantidade: '',
    faseCultivo: '',
  });

  const opcoesEspecie = [
    'Alface Crespa',
    'Alface Americana',
    'Tomate Cereja',
    'Manjericão',
    'Rúcula',
    'Couve Manteiga',
  ];

  const fasesCultivo = ['Germinação', 'Crescimento', 'Floração', 'Colheita'];

  const onChangeCampo = (field) => (event) => {
    setNovaPlanta((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const adicionarPlanta = (event) => {
    event.preventDefault();

    if (!novaPlanta.especie || !novaPlanta.dataPlantio || !novaPlanta.quantidade || !novaPlanta.faseCultivo) {
      return;
    }

    setPlantas((prev) => [
      {
        id: faker.datatype.uuid(),
        ...novaPlanta,
      },
      ...prev,
    ]);

    setNovaPlanta({
      especie: '',
      dataPlantio: '',
      quantidade: '',
      faseCultivo: '',
    });
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome User to the Hortelan System
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Adicionar planta manualmente
                </Typography>

                <Box component="form" onSubmit={adicionarPlanta}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id="especie-label">Espécie / variedade</InputLabel>
                        <Select
                          labelId="especie-label"
                          label="Espécie / variedade"
                          value={novaPlanta.especie}
                          onChange={onChangeCampo('especie')}
                        >
                          {opcoesEspecie.map((especie) => (
                            <MenuItem key={especie} value={especie}>
                              {especie}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Data de plantio"
                        type="date"
                        value={novaPlanta.dataPlantio}
                        onChange={onChangeCampo('dataPlantio')}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Quantidade"
                        type="number"
                        value={novaPlanta.quantidade}
                        onChange={onChangeCampo('quantidade')}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel id="fase-cultivo-label">Fase do cultivo</InputLabel>
                        <Select
                          labelId="fase-cultivo-label"
                          label="Fase do cultivo"
                          value={novaPlanta.faseCultivo}
                          onChange={onChangeCampo('faseCultivo')}
                        >
                          {fasesCultivo.map((fase) => (
                            <MenuItem key={fase} value={fase}>
                              {fase}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={1}>
                      <Button fullWidth type="submit" variant="contained" sx={{ height: '100%' }}>
                        Adicionar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Stack spacing={1.2} sx={{ mt: 3 }}>
                  {plantas.length === 0 ? (
                    <Typography color="text.secondary">Nenhuma planta cadastrada manualmente até o momento.</Typography>
                  ) : (
                    plantas.map((planta) => (
                      <Card key={planta.id} variant="outlined">
                        <CardContent sx={{ py: 2 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                            <Typography variant="subtitle1">{planta.especie}</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip label={`Plantio: ${planta.dataPlantio}`} size="small" />
                              <Chip label={`Qtd: ${planta.quantidade}`} size="small" color="primary" variant="outlined" />
                              <Chip label={planta.faseCultivo} size="small" color="success" />
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Soil moisture" total={20} icon1={'carbon:soil-moisture-field'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Temperature and relative humidity" total={25} color="info" icon1={'mdi:temperature'} icon2={'mdi:humidity-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="pH" total={7} color="success" icon1={'material-symbols:water-ph'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Lux" total={400} color="error" icon1={'ph:sun'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Garden performance analysis"
              subheader="(+47%) than last year"
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
                  name: 'Garden01',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Garden02',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 76, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Garden03',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current gardens"
              chartData={[
                { label: 'Garden01', value: 4344 },
                { label: 'Garden02', value: 5435 },
                { label: 'Garden03', value: 1443 },
                { label: 'Garden04', value: 4443 },
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
              title="Total cost gardens"
              subheader="(+47%) than last month"
              chartData={[
                { label: 'Garden01', value: 400 },
                { label: 'Garden02', value: 430 },
                { label: 'Garden03', value: 448 },
                { label: 'Garden04', value: 470 },
                { label: 'Garden05', value: 540 },
                { label: 'Garden06', value: 580 },
                { label: 'Garden07', value: 690 },
                { label: 'Garden08', value: 1100 },
                { label: 'Garden09', value: 1200 },
                { label: 'Garden10', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Gardens active"
              chartLabels={['Temperature °C/°F', 'Umidity %', 'Lúmen lux', 'pH', 'Battery', 'Reservoir']}
              chartData={[
                { name: 'Garden01', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Garden02', data: [20, 50, 40, 80, 70, 80] },
                { name: 'Garden03', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Relevant community information"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: 'Relevant post in community',
                description: 'Visit the community to learn more',
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Garden Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  'Garden01 registered',
                  'Purchase of accessories',
                  'Support request made',
                  'Garden02 registered',
                  'Post made in community',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Infrastructure monitoring"
              list={[
                {
                  name: 'Water level',
                  value: 10,
                  icon: <Iconify icon={'icon-park:water-level'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Battery level',
                  value: 100,
                  icon: <Iconify icon={'emojione:battery'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Pest Alert',
                  value: 0,
                  icon: <Iconify icon={'icon-park:bug'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Notifications',
                  value: 0,
                  icon: <Iconify icon={'streamline-emojis:bell'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks to be carried out in the Garden"
              list={[
                { id: '1', label: 'Schedule a professional to carry out pruning' },
                { id: '2', label: 'Make an appointment with a professional to carry out pest control' },
                { id: '3', label: 'Move plants to another location' },
                { id: '4', label: 'Set soil humidity to 70%' },
                { id: '5', label: 'Change water in the reservoir' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
