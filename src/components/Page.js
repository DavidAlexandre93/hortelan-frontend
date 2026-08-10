import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Box } from '@mui/material';

const Page = forwardRef(
  (
    {
      children,
      title: _title,
      description: _description,
      canonicalPath: _canonicalPath,
      image: _image,
      meta: _meta,
      noIndex: _noIndex,
      ...other
    },
    ref
  ) => (
    <Box ref={ref} {...other}>
      {children}
    </Box>
  )
);

Page.displayName = 'Page';

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalPath: PropTypes.string,
  image: PropTypes.string,
  meta: PropTypes.node,
  noIndex: PropTypes.bool,
};

export default Page;
