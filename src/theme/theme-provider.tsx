import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { Palettes, type ColorScheme, type ThemeColors } from '@/constants/theme';
import { getSetting, setSetting } from '@/db/settings';

/** "system": telefonun açık/koyu ayarını takip eder. */
export type ThemeMode = 'system' | ColorScheme;

const THEME_MODE_KEY = 'theme_mode';

type ThemeContextValue = {
  colors: ThemeColors;
  scheme: ColorScheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** Kaydedilmiş tema tercihini yükler ve aktif paleti bütün uygulamaya sağlar. */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode | null>(null);

  useEffect(() => {
    let active = true;
    getSetting(db, THEME_MODE_KEY)
      .then((saved) => {
        if (active) setModeState(isThemeMode(saved) ? saved : 'system');
      })
      .catch(() => {
        if (active) setModeState('system');
      });
    return () => {
      active = false;
    };
  }, [db]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      setSetting(db, THEME_MODE_KEY, next).catch((error) => console.warn('Tema kaydedilemedi', error));
    },
    [db],
  );

  // Tercih yüklenene kadar hiçbir şey çizilmez; böylece yanlış temada bir anlık parlama olmaz.
  if (mode === null) return null;

  const scheme: ColorScheme = mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;

  return (
    <ThemeContext.Provider value={{ colors: Palettes[scheme], scheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme, AppThemeProvider içinde kullanılmalı.');
  return value;
}
