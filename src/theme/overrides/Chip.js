const semanticColors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

export default function Chip(theme) {
  const root = {};
  semanticColors.forEach((color) => {
    root[`&.MuiChip-color${color[0].toUpperCase()}${color.slice(1)}`] = {
      color: theme.palette[color].darker,
      borderColor: theme.palette[color].dark,
      '&.MuiChip-filled': {
        color: theme.palette.common.white,
        backgroundColor: theme.palette[color].darker,
      },
    };
  });

  return {
    MuiChip: {
      styleOverrides: { root },
    },
  };
}
