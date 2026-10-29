/**
 * "Aurora" tasarım sistemi: cam (glass) yüzeyler ve canlı gradientler.
 * Açık ve koyu olmak üzere iki palet vardır; bileşenler renkleri `useTheme()` ile alır.
 * Gradientler iki temada da aynıdır (üzerlerindeki metin her zaman beyazdır).
 */

const dark = {
  background: '#07071A',
  backgroundElement: 'rgba(255, 255, 255, 0.06)',
  backgroundSelected: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.10)',
  /** Yarı saydam olmayan yüzey (modal kartı, skor halkası içi). */
  surface: '#11112B',
  /** Kartların içindeki çok hafif vurgulu alanlar (örnek cümle, kelime kutusu). */
  subtle: 'rgba(255, 255, 255, 0.04)',
  backdrop: 'rgba(3, 3, 15, 0.82)',
  text: '#F4F4FF',
  textSecondary: 'rgba(228, 228, 255, 0.64)',
  textFaint: 'rgba(228, 228, 255, 0.38)',
  /** Mor tonlu rozet ve etiketlerin üzerindeki metin. */
  accentText: '#D9CCFF',
  success: '#2EE6A6',
  danger: '#FF5C7A',
  violet: '#8B5CFF',
  pink: '#FF5CAA',
  cyan: '#22D3FF',
  amber: '#FFB547',
  orbViolet: 'rgba(139, 92, 255, 0.30)',
  orbPink: 'rgba(255, 92, 170, 0.20)',
  orbCyan: 'rgba(34, 211, 255, 0.18)',
};

export type ThemeColors = typeof dark;

const light: ThemeColors = {
  background: '#F4F3FB',
  backgroundElement: 'rgba(255, 255, 255, 0.78)',
  backgroundSelected: 'rgba(20, 20, 60, 0.07)',
  border: 'rgba(20, 20, 60, 0.10)',
  surface: '#FFFFFF',
  subtle: 'rgba(20, 20, 60, 0.04)',
  backdrop: 'rgba(20, 20, 46, 0.45)',
  text: '#15152E',
  textSecondary: 'rgba(21, 21, 46, 0.66)',
  textFaint: 'rgba(21, 21, 46, 0.42)',
  accentText: '#5B3FD6',
  // Açık zeminde okunabilirlik için vurgu renkleri bir ton koyulaştırıldı.
  success: '#0E9F6E',
  danger: '#E11D48',
  violet: '#6D43F0',
  pink: '#DB2777',
  cyan: '#0E7490',
  amber: '#B45309',
  orbViolet: 'rgba(139, 92, 255, 0.18)',
  orbPink: 'rgba(255, 92, 170, 0.14)',
  orbCyan: 'rgba(34, 211, 255, 0.14)',
};

export const Palettes = { light, dark } as const;

export type ColorScheme = keyof typeof Palettes;

export type ThemeColor = keyof ThemeColors;

type Gradient = readonly [string, string, ...string[]];

export const Gradients = {
  words: ['#8B5CFF', '#FF5CAA'],
  grammar: ['#22D3FF', '#2EE6A6'],
  primary: ['#8B5CFF', '#5C7CFF'],
  success: ['#2EE6A6', '#00B884'],
  danger: ['#FF5C7A', '#FF8A5C'],
  sunset: ['#FFB547', '#FF5C7A'],
  neutral: ['rgba(255, 255, 255, 0.14)', 'rgba(255, 255, 255, 0.06)'],
} as const satisfies Record<string, Gradient>;

export type GradientName = keyof typeof Gradients;

/** Liste öğelerine sırayla dağıtılan vurgu gradientleri. */
export const AccentGradients: GradientName[] = ['words', 'grammar', 'sunset', 'primary'];

export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const MaxContentWidth = 560;
