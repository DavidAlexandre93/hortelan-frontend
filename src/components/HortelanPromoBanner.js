import PropTypes from 'prop-types';
import { Box } from '@mui/material';

export default function HortelanPromoBanner({ sx, className }) {
  return (
    <Box
      component="img"
      className={className}
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
  className: PropTypes.string,
  sx: PropTypes.object,
};

HortelanPromoBanner.defaultProps = {
  className: undefined,
  sx: {},
};
