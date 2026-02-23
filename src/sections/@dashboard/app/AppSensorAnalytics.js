import { useMemo, useState } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { BaseOptionChart } from '../../../components/chart';

const periodOptions = [
  { value: 'hora', label: 'Hora', points: 24 },
  { value: 'dia', label: 'Dia', points: 14 },
  { value: 'semana', label: 'Semana', points: 12 },
  { value: 'mes', label: 'Mês', points: 12 },
];

const sensorCatalog = [
  {
    id: 'temp',
    label: 'Temperatura (°C)',
    unit: '°C',
    base: 22,
    variation: 4,
  },
  {
    id: 'umidade',
    label: 'Umidade do solo (%)',
    unit: '%',
    base: 68,
    variation: 16,
  },
  {
    id: 'ph',
    label: 'pH',
    unit: 'pH',
    base: 6.3,
    variation: 0.8,
  },
  {
    id: 'luminosidade',
    label: 'Luminosidade (lux)',
    unit: 'lux',
    base: 18000,
    variation: 6000,
  },
];

const structure = {
  'Horta Aurora': ['Estufa Leste', 'Estufa Norte'],
  'Horta Primavera': ['Bancada A', 'Bancada B'],
  'Horta Horizonte': ['Campo 1', 'Campo 2'],
};

const formatLabel = (period, index) => {
  if (period === 'hora') return `${String(index).padStart(2, '0')}:00`;
  if (period === 'dia') return `Dia ${index + 1}`;
  if (period === 'semana') return `Sem ${index + 1}`;
  return `Mês ${index + 1}`;
};

const valueForPoint = (sensor, pointIndex, scopeFactor) => {
  const wave = Math.sin(pointIndex * 0.75 + scopeFactor) * sensor.variation;
  const trend = pointIndex * (sensor.variation / 20) * (scopeFactor / 4);
  return Number((sensor.base + wave + trend).toFixed(sensor.id === 'ph' ? 2 : 1));
};

const buildExportRows = ({ labels, series, period, horta, area }) => {
  const header = ['período', 'horta', 'área', 'referência', ...series.map((item) => item.name)];

  const rows = labels.map((label, index) => [
    period,
    horta,
    area || 'Todas',
    label,
    ...series.map((item) => item.data[index]),
  ]);

  return [header, ...rows];
};

const downloadTable = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function AppSensorAnalytics() {
  const [period, setPeriod] = useState('hora');
  const [horta, setHorta] = useState('Horta Aurora');
  const [area, setArea] = useState('');
  const [sensor, setSensor] = useState('temp');
  const [comparisonSensors, setComparisonSensors] = useState(['temp', 'umidade']);

  const areaOptions = structure[horta] || [];

  const activePeriod = periodOptions.find((option) => option.value === period);
  const labels = Array.from({ length: activePeriod.points }, (_, index) => formatLabel(period, index));

  const sensorOptions = useMemo(
    () => sensorCatalog.map((item) => ({ value: item.id, label: item.label, unit: item.unit })),
    []
  );

  const filteredComparisonSensors = comparisonSensors.filter((item) => item !== sensor);
  const sensorsForChart = [sensor, ...filteredComparisonSensors].slice(0, 3);

  const chartSeries = sensorsForChart.map((sensorId, seriesIndex) => {
    const selectedSensor = sensorCatalog.find((item) => item.id === sensorId) || sensorCatalog[0];
    const scopeFactor = horta.length + (area || 'todas').length + seriesIndex;

    return {
      name: selectedSensor.label,
      data: labels.map((_, pointIndex) => valueForPoint(selectedSensor, pointIndex, scopeFactor)),
    };
  });

  const tableRows = buildExportRows({ labels, series: chartSeries, period, horta, area });

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      toolbar: { show: false },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories: labels,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  });

  const exportCsv = () => {
    const csv = tableRows.map((row) => row.join(';')).join('\n');
    downloadTable(`sensores-${period}.csv`, csv, 'text/csv;charset=utf-8;');
  };

  const exportExcel = () => {
    const tsv = tableRows.map((row) => row.join('\t')).join('\n');
    downloadTable(`sensores-${period}.xls`, tsv, 'application/vnd.ms-excel;charset=utf-8;');
  };

  return (
    <Card>
      <CardHeader
        title="Análise de sensores"
        subheader="Gráficos por período, comparação entre sensores e exportação de dados"
      />
      <CardContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="periodo-label">Período</InputLabel>
              <Select labelId="periodo-label" label="Período" value={period} onChange={(event) => setPeriod(event.target.value)}>
                {periodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="horta-label">Horta</InputLabel>
              <Select
                labelId="horta-label"
                label="Horta"
                value={horta}
                onChange={(event) => {
                  setHorta(event.target.value);
                  setArea('');
                }}
              >
                {Object.keys(structure).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="area-label">Área</InputLabel>
              <Select labelId="area-label" label="Área" value={area} onChange={(event) => setArea(event.target.value)}>
                <MenuItem value="">Todas</MenuItem>
                {areaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sensor-principal-label">Sensor principal</InputLabel>
              <Select
                labelId="sensor-principal-label"
                label="Sensor principal"
                value={sensor}
                onChange={(event) => setSensor(event.target.value)}
              >
                {sensorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="comparacao-sensores-label">Comparar com sensores</InputLabel>
              <Select
                labelId="comparacao-sensores-label"
                label="Comparar com sensores"
                multiple
                value={comparisonSensors}
                onChange={(event) => {
                  const { value } = event.target;
                  setComparisonSensors(typeof value === 'string' ? value.split(',') : value);
                }}
              >
                {sensorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box dir="ltr">
          <ReactApexChart type="line" series={chartSeries} options={chartOptions} height={360} />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Filtros ativos: {horta} • {area || 'Todas as áreas'} • {activePeriod.label.toLowerCase()} • {chartSeries.length} sensor(es)
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={exportCsv}>
              Exportar CSV
            </Button>
            <Button variant="contained" onClick={exportExcel}>
              Exportar Excel
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
