import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Box, Card, CardHeader } from '@mui/material';
import { fNumber } from '../../../utils/formatNumber';
import { AccessibleChart, ChartTooltip } from '../../../components/chart';

// ----------------------------------------------------------------------

AppCurrentVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function AppCurrentVisits({ title, subheader, chartColors, chartData, ...other }) {
  const theme = useTheme();
  const colors = chartColors || [theme.palette.primary.main, theme.palette.warning.main, theme.palette.info.main];
  const summary = chartData.map((item) => `${item.label}: ${fNumber(item.value)}`).join('. ');

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ px: 2, pt: 2, pb: 1 }} dir="ltr">
        <AccessibleChart label={`${title}: gráfico de distribuição`} summary={summary} height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
              <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={58} outerRadius={96} paddingAngle={2}>
                {chartData.map((item, index) => (
                  <Cell key={item.label} fill={colors[index % colors.length]} stroke={theme.palette.background.paper} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip valueFormatter={fNumber} />} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </AccessibleChart>
      </Box>
    </Card>
  );
}
