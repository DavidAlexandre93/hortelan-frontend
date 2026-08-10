import PropTypes from 'prop-types';
import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';

const colorByType = {
  order1: 'primary.main',
  order2: 'success.main',
  order3: 'info.main',
  order4: 'warning.main',
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>
        <Stack component="ol" spacing={0} sx={{ listStyle: 'none' }}>
          {list.map((item, index) => (
            <Box
              component="li"
              key={item.id}
              sx={{ display: 'grid', gridTemplateColumns: '18px minmax(0, 1fr)', columnGap: 1.5 }}
            >
              <Stack alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    mt: 0.75,
                    borderRadius: '50%',
                    bgcolor: colorByType[item.type] || 'error.main',
                  }}
                />
                {index < list.length - 1 && <Box sx={{ width: 2, flexGrow: 1, minHeight: 34, bgcolor: 'divider' }} />}
              </Stack>
              <Box sx={{ pb: index < list.length - 1 ? 2.5 : 0 }}>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {fDateTime(item.time)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

AppOrderTimeline.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      time: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
