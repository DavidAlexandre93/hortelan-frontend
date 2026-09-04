import PropTypes from 'prop-types';
import { Box, Button, Stack, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { StatusBadge } from '../states/OperationalState';

export default function PageContext({ badge, heading, subheading, hasAiContext, onOpenAssistant }) {
  return (
    <Stack
      spacing={0.75}
      component="header"
      sx={{
        pt: { xs: 3, md: 4 },
        pb: { xs: 2.5, md: 3 },
        mb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 800 }}>
        {badge}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.25}>
        <Stack direction="row" alignItems="center" gap={1.25} sx={{ minWidth: 0, flex: 1, flexWrap: 'wrap' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
            {heading}
          </Typography>
          <StatusBadge label="Dados ilustrativos" severity="neutral" />
        </Stack>
        {hasAiContext ? (
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={() => onOpenAssistant('')}
            sx={{ flexShrink: 0 }}
          >
            Perguntar a IA
          </Button>
        ) : null}
      </Stack>
      <Box component="p" sx={{ m: 0, maxWidth: 760, color: 'text.secondary', lineHeight: 1.65 }}>
        {subheading}
      </Box>
    </Stack>
  );
}

PageContext.propTypes = {
  badge: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
  hasAiContext: PropTypes.bool,
  onOpenAssistant: PropTypes.func.isRequired,
};

PageContext.defaultProps = {
  hasAiContext: false,
};
