import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { NavigationBar } from 'expo-navigation-bar';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { SplashOverlay } from '@/components/splash-overlay';
import { DATABASE_NAME, migrateDbIfNeeded } from '@/db/database';
import { NotificationManager } from '@/notifications/notification-manager';
import { configureNotificationHandler } from '@/notifications/scheduler';
import { UserProvider } from '@/db/user-context';
import { AppThemeProvider, useAppTheme } from '@/theme/theme-provider';

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

/** Aktif temaya göre navigasyon teması, sistem çubukları ve sayfa yığını. */
function ThemedApp() {
  const { colors, scheme } = useAppTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.violet,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };
  // Koyu temada açık renkli, açık temada koyu renkli sistem simgeleri.
  const barStyle = scheme === 'dark' ? 'light' : 'dark';

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={barStyle} />
      {/* Android gezinme çubuğu gizli; alttan kaydırınca geçici olarak görünür. */}
      <NavigationBar hidden style={barStyle} />
      <UserProvider>
        <NotificationManager />
        {/* Yerel başlık gizli; geri butonu her ekranda aurora zemini üzerinde çiziliyor. */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </UserProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Fontlar yüklenene kadar splash ekranı görünür kalır.
  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
        {/* Tema tercihi veritabanında saklandığı için tema sağlayıcı SQLite'ın içinde. */}
        <AppThemeProvider>
          <ThemedApp />
        </AppThemeProvider>
      </SQLiteProvider>
      <SplashOverlay />
    </>
  );
}
