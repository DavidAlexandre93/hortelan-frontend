import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
// material
import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import getPalette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedMode = window.localStorage.getItem('themeMode');
    return savedMode === 'dark' ? 'dark' : 'light';
  });

  const toggleMode = useCallback(() => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('themeMode', nextMode);
      return nextMode;
    });
  }, []);

  const themeOptions = useMemo(
    () => ({
      palette: getPalette(mode),
      shape: { borderRadius: 6 },
      spacing: 4,
      zIndex: { appBar: 1200, drawer: 1300, modal: 1400, snackbar: 1500, tooltip: 1600 },
      tokens: {
        radius: { compact: 4, control: 6, section: 8, pill: 999 },
        controlHeight: { compact: 36, standard: 44, large: 52 },
        elevation: { none: 'none', subtle: '0 1px 2px rgba(16, 25, 21, 0.06)', raised: '0 8px 24px rgba(16, 25, 21, 0.10)' },
        layers: { shell: 1100, appBar: 1200, drawer: 1300, modal: 1400, snackbar: 1500, tooltip: 1600 },
      },
      transitions: {
        duration: { shortest: 120, shorter: 160, short: 200, standard: 240, complex: 320 },
      },
      typography,
      shadows,
      customShadows,
    }),
    [mode]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  const themeModeValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode, toggleMode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeModeContext.Provider value={themeModeValue}>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles
            styles={{
              html: { width: '100%', height: '100%' },
              body: { width: '100%', minHeight: '100%', overflowX: 'hidden' },
              '#root': { width: '100%', minHeight: '100%' },
              img: { maxWidth: '100%', height: 'auto' },
              button: { minWidth: 44, minHeight: 44 },
              '*:focus-visible': {
                outline: '3px solid',
                outlineColor: theme.palette.focus.ring,
                outlineOffset: 2,
              },
              '@media (prefers-reduced-motion: reduce)': {
                '*, *::before, *::after': {
                  animationDuration: '0.01ms !important',
                  animationIterationCount: '1 !important',
                  transitionDuration: '0.01ms !important',
                  scrollBehavior: 'auto !important',
                },
              },
            }}
          />
          {children}
        </MUIThemeProvider>
      </ThemeModeContext.Provider>
    </StyledEngineProvider>
  );
}
