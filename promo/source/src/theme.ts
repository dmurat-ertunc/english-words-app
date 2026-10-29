import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';

// Uygulamadaki "Aurora" tasarım sistemiyle aynı renkler (src/constants/theme.ts).
export const { fontFamily } = loadFont('normal', { weights: ['500', '600', '700', '800'] });

export const dark = {
  background: '#07071A',
  element: 'rgba(255, 255, 255, 0.06)',
  selected: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.10)',
  surface: '#11112B',
  text: '#F4F4FF',
  textSecondary: 'rgba(228, 228, 255, 0.64)',
  textFaint: 'rgba(228, 228, 255, 0.38)',
  accentText: '#D9CCFF',
  success: '#2EE6A6',
  danger: '#FF5C7A',
  violet: '#8B5CFF',
  pink: '#FF5CAA',
  cyan: '#22D3FF',
  amber: '#FFB547',
};

export type Palette = typeof dark;

export const light: Palette = {
  background: '#F4F3FB',
  element: 'rgba(255, 255, 255, 0.85)',
  selected: 'rgba(20, 20, 60, 0.07)',
  border: 'rgba(20, 20, 60, 0.10)',
  surface: '#FFFFFF',
  text: '#15152E',
  textSecondary: 'rgba(21, 21, 46, 0.66)',
  textFaint: 'rgba(21, 21, 46, 0.42)',
  accentText: '#5B3FD6',
  success: '#0E9F6E',
  danger: '#E11D48',
  violet: '#6D43F0',
  pink: '#DB2777',
  cyan: '#0E7490',
  amber: '#B45309',
};

export const gradients = {
  words: 'linear-gradient(135deg, #8B5CFF, #FF5CAA)',
  grammar: 'linear-gradient(135deg, #22D3FF, #2EE6A6)',
  primary: 'linear-gradient(135deg, #8B5CFF, #5C7CFF)',
  success: 'linear-gradient(135deg, #2EE6A6, #00B884)',
  sunset: 'linear-gradient(135deg, #FFB547, #FF5C7A)',
};

/** Telefon ekranının mantıksal boyutu (uygulamadaki ölçülerle tasarlanır, sonra büyütülür). */
export const SCREEN = { width: 390, height: 844 };
