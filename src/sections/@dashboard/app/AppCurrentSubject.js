import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Box, Card, CardHeader } from '@mui/material';
import { AccessibleChart, ChartTooltip, seriesToRows } from '../../../components/chart';

// ----------------------------------------------------------------------

AppCurrentSubject.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppCurrentSubject({ title, subheader, chartData, chartColors, chartLabels, ...other }) {
  const theme = useTheme();
  const rows = seriesToRows(chartLabels, chartData);
  const colors = [theme.palette.primary.main, theme.palette.warning.main, theme.palette.info.main];
  const summary = chartData
    .map(
      (series) =>
        `${series.name}: média ${Math.round(series.data.reduce((sum, value) => sum + value, 0) / series.data.length)}`
    )
    .join('. ');

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ px: 1, pt: 2 }} dir="ltr">
        <AccessibleChart label={`${title}: gráfico radar`} summary={summary} height={370}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={rows} accessibilityLayer outerRadius="68%">
              <PolarGrid stroke={theme.palette.divider} />
              <PolarAngleAxis
                dataKey="label"
                tick={{
                  fill: chartColors[0] || theme.palette.text.secondary,
                  fontSize: 11,
                }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              {chartData.map((series, index) => (
                <Radar
                  key={series.name}
                  dataKey={series.name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.16}
                  strokeWidth={2}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </AccessibleChart>
      </Box>
    </Card>
  );
}
