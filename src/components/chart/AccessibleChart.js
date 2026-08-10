import PropTypes from 'prop-types';
import { Box, Paper, Stack, Typography } from '@mui/material';

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
};

export function seriesToRows(labels, series) {
  return labels.map((label, index) =>
    series.reduce((row, item) => ({ ...row, [item.name]: item.data[index] }), {
      label,
    })
  );
}

export function AccessibleChart({ label, summary, height = 340, children }) {
  return (
    <Box role="img" aria-label={label} sx={{ height, minWidth: 0, position: 'relative' }}>
      <Typography component="span" sx={visuallyHidden}>
        {summary}
      </Typography>
      {children}
    </Box>
  );
}

AccessibleChart.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number,
  label: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};

export function ChartTooltip({ active, label, payload, valueFormatter = String }) {
  if (!active || !payload?.length) return null;

  return (
    <Paper elevation={8} sx={{ p: 1.5, border: 1, borderColor: 'divider' }}>
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      <Stack spacing={0.5} sx={{ mt: label ? 0.5 : 0 }}>
        {payload.map((item) => (
          <Stack key={`${item.dataKey}-${item.name}`} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: item.color || item.fill,
              }}
            />
            <Typography variant="body2">
              {item.name}: <strong>{valueFormatter(item.value)}</strong>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payload: PropTypes.array,
  valueFormatter: PropTypes.func,
};
