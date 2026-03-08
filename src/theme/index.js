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
      shape: { borderRadius: 8 },
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
            }}
          />
          {children}
        </MUIThemeProvider>
      </ThemeModeContext.Provider>
    </StyledEngineProvider>
  );
}
