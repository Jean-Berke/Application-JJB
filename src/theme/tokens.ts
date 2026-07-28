export const colors = {
  bg: '#100d0b',
  bgOffDevice: '#0b0908',
  surface: '#171310',
  text: '#f3efe9',
  textMuted: 'rgba(243,239,233,0.5)',
  textTertiary: 'rgba(243,239,233,0.4)',
  textTertiaryAlt: 'rgba(243,239,233,0.35)',
  divider: 'rgba(243,239,233,0.09)',
  accent: '#E8543A',

  neutral100: '#1c1815',
  neutral200: '#241f1b',
  neutral300: '#332c27',
  neutral400: '#5d534b',
  neutral500: '#8a7f75',
  neutral600: '#a99e93',
  neutral700: '#c7bfb5',
  neutral800: '#e3ddd5',
  neutral900: '#f5f2ec',

  accent100: '#2a1512',
  accent200: '#3a1c16',
  accent300: '#5e2b21',
  accent400: '#8d3b2c',
  accent500: '#c2492f',
  accent600: '#E8543A',
  accent700: '#f0715c',
  accent800: '#f7a08d',
  accent900: '#fcc9bd',

  belt: {
    white: '#e9e6df',
    blue: '#2E5AAC',
    purple: '#6B3FA0',
    brown: '#6E4A2A',
    black: '#2b2b2d',
  },
  beltBar: '#141414',
  beltStripe: '#ffffff',

  onAccent: '#100d0b',
} as const;

export const spacing = {
  1: 4,
  2: 7,
  3: 11,
  4: 14,
  6: 20,
  8: 28,
  screenPadding: 14,
  cardMargin: 20,
  cardPadding: 11,
} as const;

export const radii = {
  sm: 7,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSize = {
  h3: 25,
  h4: 21,
  h5: 17,
  h6: 12,
  postBody: 14,
  body: 15,
  meta: 12,
  metaSmall: 11,
  statSmall: 26,
  statLarge: 42,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.45,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 34,
    elevation: 12,
  },
} as const;

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export const beltLabels: Record<BeltLevel, string> = {
  white: 'Blanche',
  blue: 'Bleue',
  purple: 'Violette',
  brown: 'Marron',
  black: 'Noire',
};
