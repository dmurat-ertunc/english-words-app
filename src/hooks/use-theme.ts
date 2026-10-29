import { useMemo } from 'react';

import type { ThemeColors } from '@/constants/theme';
import { useAppTheme } from '@/theme/theme-provider';

/** Aktif temanın renkleri. */
export function useTheme(): ThemeColors {
  return useAppTheme().colors;
}

/**
 * Aktif temanın renkleriyle stil üretir; tema değişince stiller yeniden hesaplanır.
 * `factory` modül düzeyinde tanımlanmış sabit bir fonksiyon olmalı.
 */
export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const colors = useTheme();
  return useMemo(() => factory(colors), [factory, colors]);
}
