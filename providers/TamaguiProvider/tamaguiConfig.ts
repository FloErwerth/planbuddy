import { createFont, createTamagui } from 'tamagui';
import { config } from '@tamagui/config';
import { color } from '@tamagui/themes';

export const colors = {
  ...color,
  inputBackground: 'rgb(220,220,220)',
};

const font = createFont({
  family: 'Normal',
  size: {
    1: 8,
    2: 10,
    3: 12,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 28,
    10: 32,
    11: 38,
    12: 50,
  },
  lineHeight: {
    1: 10,
    2: 14,
    3: 18,
    4: 22,
    5: 26,
    6: 30,
    7: 34,
    8: 38,
    9: 42,
    10: 44,
    11: 48,
    12: 56,
  },
  weight: {
    3: 400,
    5: 500,
    12: 700,
  },
  face: {
    100: {
      normal: 'Normal',
      italic: 'Italic',
    },
    500: {
      normal: 'SemiBold',
      italic: 'SemiBoldItalic',
    },
    700: {
      normal: 'Bold',
      italic: 'BoldItalic',
    },
  },
});

export const tamaguiConfig = createTamagui({
  ...config,

  fonts: {
    body: font,
    heading: font,
  },

  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      primary: '#3f4e93',
      secondary: '#a8aee1',
      accent: '#DD7568',
      lightShade: '#F4F3F7',
      darkShade: '#354173',
      inputBackground: colors.inputBackground,
    },
  },

  themes: {
    default: {
      background: '#F4F3F7', // Ein allgemeines helles Grau, oft für Hintergründe verwendet
      color: color.gray12Light, // Ein typisches dunkles Grau von Airbnb für Text
      borderColor: '#656565',
      focusColor: '#354173',
      placeholderColor: color.gray10Light,
    },
    error: {
      darkShade: color.red9Light,
      primary: color.red9Light,
      background: color.red4Light,
      color: color.red9Light,
      borderColor: color.red10Light,
      fill: color.red9Light,
      colorFocus: color.red9Light,
      colorActive: color.red9Light,
      backgroundColorFocus: color.red2Light,
      backgroundColorActive: color.red2Light,
    },
    dark: {
      bg: '#111',
      color: '#000',
    },
  },
});
