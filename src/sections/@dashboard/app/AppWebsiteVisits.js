import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, Card, CardHeader } from '@mui/material';
import { AccessibleChart, ChartTooltip, seriesToRows } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {
  const theme = useTheme();
  const rows = seriesToRows(chartLabels, chartData);
  const colors = [theme.palette.primary.main, theme.palette.warning.main, theme.palette.info.main];
  const summary = chartData.map((series) => `${series.name}: último valor ${series.data.at(-1)}%`).join('. ');

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <AccessibleChart label={`${title}: gráfico combinado`} summary={summary} height={364}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows} accessibilityLayer margin={{ top: 12, right: 12, left: -12, bottom: 4 }}>
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip valueFormatter={(value) => `${Number(value).toFixed(0)}%`} />} />
              <Legend />
              {chartData.map((series, index) =>
                series.type === 'column' ? (
                  <Bar
                    key={series.name}
                    dataKey={series.name}
                    fill={colors[index % colors.length]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                ) : (
                  <Line
                    key={series.name}
                    dataKey={series.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={3}
                    dot={false}
                    type="monotone"
                  />
                )
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </AccessibleChart>
      </Box>
    </Card>
  );
}
