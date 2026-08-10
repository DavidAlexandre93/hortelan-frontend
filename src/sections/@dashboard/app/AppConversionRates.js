import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, Card, CardHeader } from '@mui/material';
import { fNumber } from '../../../utils/formatNumber';
import { AccessibleChart, ChartTooltip } from '../../../components/chart';

// ----------------------------------------------------------------------

AppConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppConversionRates({ title, subheader, chartData, ...other }) {
  const theme = useTheme();
  const summary = chartData.map((item) => `${item.label}: ${fNumber(item.value)}`).join('. ');

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 2, mt: 1 }} dir="ltr">
        <AccessibleChart label={`${title}: gráfico de barras`} summary={summary} height={380}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              accessibilityLayer
              margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
            >
              <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="label"
                type="category"
                width={104}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip valueFormatter={fNumber} />} />
              <Bar
                dataKey="value"
                name="Custo"
                fill={theme.palette.primary.main}
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </AccessibleChart>
      </Box>
    </Card>
  );
}
