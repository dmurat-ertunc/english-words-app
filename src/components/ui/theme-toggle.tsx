import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { useAppTheme, type ThemeMode } from '@/theme/theme-provider';

const OPTIONS: { mode: ThemeMode; emoji: string; label: string }[] = [
  { mode: 'system', emoji: '📱', label: 'Sistem teması' },
  { mode: 'light', emoji: '☀️', label: 'Açık tema' },
  { mode: 'dark', emoji: '🌙', label: 'Koyu tema' },
];

/** Her ekranın sağ üstünde duran kompakt Sistem / Açık / Koyu tema seçici. */
export function ThemeToggle() {
  const styles = useThemedStyles(createStyles);
  const { mode, setMode } = useAppTheme();

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const selected = option.mode === mode;
        return (
          <Pressable
            key={option.mode}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            hitSlop={4}
            onPress={() => {
              if (selected) return;
              Haptics.selectionAsync();
              setMode(option.mode);
            }}
            style={[styles.option, selected && styles.optionSelected]}>
            <ThemedText style={[styles.emoji, !selected && styles.dimmed]}>{option.emoji}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 2,
      padding: 3,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    option: {
      width: 32,
      height: 32,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionSelected: {
      backgroundColor: colors.backgroundSelected,
      borderWidth: 1,
      borderColor: colors.violet,
    },
    emoji: {
      fontSize: 15,
      lineHeight: 19,
    },
    dimmed: {
      opacity: 0.45,
    },
  });
