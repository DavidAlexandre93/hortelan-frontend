import PropTypes from 'prop-types';
import { useMemo } from 'react';
// material
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape: { borderRadius: 8 },
      typography,
      shadows,
      customShadows,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: { width: '100%', height: '100%' },
            body: { width: '100%', minHeight: '100%', overflowX: 'hidden' },
            '#root': { width: '100%', minHeight: '100%' },
            img: { maxWidth: '100%', height: 'auto' },
          }}
        />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
