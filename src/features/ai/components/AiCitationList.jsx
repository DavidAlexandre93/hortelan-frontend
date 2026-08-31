import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Stack, Typography } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

function SourceLink({ citation, index }) {
  const isInternal = citation.url.startsWith('/');
  const commonProps = isInternal
    ? { component: RouterLink, to: citation.url }
    : { href: citation.url, target: '_blank', rel: 'noopener noreferrer' };

  return (
    <Link
      {...commonProps}
      underline="none"
      sx={{
        display: 'grid',
        gridTemplateColumns: '24px minmax(0, 1fr) auto',
        gap: 1,
        alignItems: 'start',
        px: 1.25,
        py: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        color: 'text.primary',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center', pt: 0.2 }}>
        <ArticleOutlinedIcon sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" fontWeight={800} display="block">
          {index + 1}. {citation.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {citation.authority}
          {citation.revision ? ` · ${citation.revision}` : ''}
        </Typography>
      </Box>
      {!isInternal ? <OpenInNewRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> : null}
    </Link>
  );
}

SourceLink.propTypes = {
  citation: PropTypes.shape({
    authority: PropTypes.string.isRequired,
    revision: PropTypes.string,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default function AiCitationList({ citations }) {
  if (!citations.length) return null;
  return (
    <Stack component="section" aria-label="Fontes da resposta" spacing={0.75} sx={{ mt: 1.5 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={800}>
        Fontes consultadas
      </Typography>
      {citations.map((citation, index) => (
        <SourceLink key={citation.id} citation={citation} index={index} />
      ))}
    </Stack>
  );
}

AiCitationList.propTypes = {
  citations: PropTypes.arrayOf(PropTypes.object).isRequired,
};
