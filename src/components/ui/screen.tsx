import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** Sol üstte cam görünümlü geri butonu gösterir. */
  showBack?: boolean;
  /** Geri butonu yoksa sol üstte gösterilecek içerik. */
  headerLeft?: ReactNode;
  /** Tema seçicinin solunda gösterilecek içerik. */
  headerRight?: ReactNode;
};

/**
 * Her ekranı tam sayfa aurora zemini üzerinde, güvenli alan içinde çizer.
 * Üst çubukta solda geri butonu, sağda her zaman tema seçici bulunur.
 */
export function Screen({ children, showBack = false, headerLeft, headerRight }: ScreenProps) {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.left}>
            {showBack ? (
              <ScalePressable
                accessibilityRole="button"
                accessibilityLabel="Geri"
                hitSlop={8}
                style={styles.backButton}
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
                <ThemedText type="subtitle" style={styles.backIcon}>
                  ←
                </ThemedText>
              </ScalePressable>
            ) : (
              headerLeft
            )}
          </View>
          <View style={styles.right}>
            {headerRight}
            <ThemeToggle />
          </View>
        </View>
        {children}
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
      minHeight: 44,
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.two,
      paddingBottom: Spacing.one,
    },
    left: {
      flexShrink: 1,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      lineHeight: 26,
    },
  });
