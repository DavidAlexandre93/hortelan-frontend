import PropTypes from 'prop-types';
import { Box } from '@mui/material';

export default function HortelanPromoBanner({ sx }) {
  return (
    <Box
      component="img"
      src="/static/logos.png"
      alt="Banner Hortelan Agtech Ltda - Tecnologia Sustentável para Hortas Inteligentes"
      sx={{
        width: '100%',
        display: 'block',
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[8],
        ...sx,
      }}
    />
  );
}

HortelanPromoBanner.propTypes = {
  sx: PropTypes.object,
};

HortelanPromoBanner.defaultProps = {
  sx: {},
};
