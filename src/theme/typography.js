// ----------------------------------------------------------------------

function pxToRem(value) {
  return `${value / 16}rem`;
}

const FONT_PRIMARY = '"Manrope", Arial, sans-serif';

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 1.15,
    fontSize: pxToRem(48),
    letterSpacing: 0,
  },
  h2: {
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: pxToRem(36),
    letterSpacing: 0,
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.25,
    fontSize: pxToRem(30),
    letterSpacing: 0,
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.3,
    fontSize: pxToRem(24),
    letterSpacing: 0,
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.35,
    fontSize: pxToRem(18),
    letterSpacing: 0,
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    letterSpacing: 0,
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    letterSpacing: 0,
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    letterSpacing: 0,
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    letterSpacing: 0,
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    letterSpacing: 0,
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 0,
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    letterSpacing: 0,
    textTransform: 'none',
  },
};

export default typography;
