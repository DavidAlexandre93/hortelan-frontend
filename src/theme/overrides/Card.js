import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Card(theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.dark, 0.08)}`,
          borderRadius: Number(theme.shape.borderRadius) * 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          backgroundImage: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(
            theme.palette.primary.lighter,
            0.12
          )} 100%)`,
          position: 'relative',
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
