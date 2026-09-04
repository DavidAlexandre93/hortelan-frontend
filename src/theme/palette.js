import { alpha } from '@mui/material/styles';

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const PRIMARY = {
  lighter: '#DDF4E8',
  light: '#68C89A',
  main: '#158052',
  dark: '#0B603C',
  darker: '#073E29',
  contrastText: '#fff',
};

const SECONDARY = {
  lighter: '#E4F1FF',
  light: '#78B6EA',
  main: '#2878B8',
  dark: '#185885',
  darker: '#103B59',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#D5F9FF',
  light: '#68DAFF',
  main: '#0DB3E8',
  dark: '#0A6EAA',
  darker: '#04416F',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const CHART_COLORS = {
  violet: ['#6B5CC5', '#8D80D8', '#B8AFE9', '#E2DFF5'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
};

function getPalette(mode = 'light') {
  const isLight = mode === 'light';

  return {
    mode,
    common: { black: '#000', white: '#fff' },
    primary: { ...PRIMARY },
    secondary: { ...SECONDARY },
    info: { ...INFO },
    success: { ...SUCCESS },
    warning: { ...WARNING },
    error: { ...ERROR },
    grey: GREY,
    chart: CHART_COLORS,
    surface: {
      canvas: isLight ? '#F5F7F5' : '#101915',
      base: isLight ? '#FFFFFF' : '#17231D',
      subtle: isLight ? '#EEF3EF' : '#1D2B24',
      raised: isLight ? '#FFFFFF' : '#22332A',
    },
    border: {
      subtle: isLight ? '#E2E9E3' : '#304238',
      strong: isLight ? '#C8D6CB' : '#496052',
    },
    focus: { ring: isLight ? '#0B603C' : '#68C89A' },
    status: {
      info: INFO.main,
      success: SUCCESS.dark,
      warning: WARNING.dark,
      critical: ERROR.dark,
      neutral: GREY[600],
    },
    action: {
      primary: PRIMARY.main,
      primaryHover: PRIMARY.dark,
      secondary: SECONDARY.main,
      secondaryHover: SECONDARY.dark,
      active: isLight ? GREY[600] : GREY[400],
      hover: GREY[500_8],
      selected: GREY[500_16],
      disabled: GREY[500_80],
      disabledBackground: GREY[500_24],
      focus: GREY[500_24],
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
    chartTokens: {
      grid: isLight ? '#D9E4DC' : '#385044',
      axis: isLight ? GREY[600] : GREY[400],
      threshold: WARNING.dark,
      focus: isLight ? PRIMARY.dark : PRIMARY.light,
      series: CHART_COLORS,
    },
    divider: GREY[500_24],
    text: {
      primary: isLight ? GREY[800] : '#fff',
      secondary: isLight ? GREY[600] : GREY[500],
      disabled: GREY[500],
    },
    background: {
      paper: isLight ? '#fff' : '#17231D',
      default: isLight ? '#F5F7F5' : '#101915',
      neutral: isLight ? GREY[200] : alpha(GREY[500], 0.12),
    },
  };
}

export default getPalette;
