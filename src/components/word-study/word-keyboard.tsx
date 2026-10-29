import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Gradients, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

type WordKeyboardProps = {
  onKey: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
};

/**
 * Yazma testi için uygulama içi İngilizce klavye. Telefon klavyesinin otomatik düzeltmesini,
 * Türkçe karakterlerini (ı, ş…) ve ekranı kaplamasını önler.
 */
export function WordKeyboard({ onKey, onBackspace, onClear, onSubmit, submitDisabled }: WordKeyboardProps) {
  const styles = useThemedStyles(createStyles);

  function press(action: () => void) {
    Haptics.selectionAsync();
    action();
  }

  const renderKey = (char: string, label = char, extraStyle?: StyleProp<ViewStyle>) => (
    <Pressable
      key={char}
      accessibilityRole="button"
      accessibilityLabel={label === ' ' ? 'boşluk' : label}
      onPress={() => press(() => onKey(char))}
      style={({ pressed }) => [styles.key, extraStyle, pressed && styles.keyPressed]}>
      <ThemedText style={styles.keyText}>{label}</ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.keyboard}>
      <View style={styles.row}>{[...ROWS[0]].map((char) => renderKey(char))}</View>
      <View style={[styles.row, styles.rowIndented]}>{[...ROWS[1]].map((char) => renderKey(char))}</View>
      <View style={styles.row}>
        {[...ROWS[2]].map((char) => renderKey(char))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sil"
          accessibilityHint="Basılı tutunca hepsini siler"
          onPress={() => press(onBackspace)}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onClear();
          }}
          style={({ pressed }) => [styles.key, styles.wideKey, styles.actionKey, pressed && styles.keyPressed]}>
          <ThemedText style={styles.keyText}>⌫</ThemedText>
        </Pressable>
      </View>
      <View style={styles.row}>
        {renderKey("'", "'", styles.actionKey)}
        {renderKey('-', '-', styles.actionKey)}
        {renderKey(' ', 'boşluk', styles.spaceKey)}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kontrol et"
          disabled={submitDisabled}
          onPress={() => press(onSubmit)}
          style={({ pressed }) => [styles.submitWrapper, submitDisabled && styles.disabled, pressed && styles.keyPressed]}>
          <LinearGradient colors={Gradients.sunset} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submit}>
            <ThemedText type="smallBold" style={styles.submitText}>
              Kontrol ✓
            </ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const KEY_HEIGHT = 46;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    keyboard: {
      gap: Spacing.two,
      padding: Spacing.two,
      borderRadius: Radius.md,
      backgroundColor: colors.subtle,
    },
    row: {
      flexDirection: 'row',
      gap: 5,
    },
    rowIndented: {
      paddingHorizontal: '5%',
    },
    key: {
      flex: 1,
      height: KEY_HEIGHT,
      borderRadius: Radius.sm - 4,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyPressed: {
      opacity: 0.55,
      transform: [{ scale: 0.94 }],
    },
    keyText: {
      fontFamily: Fonts.semibold,
      fontSize: 18,
      lineHeight: 22,
    },
    wideKey: {
      flex: 1.6,
    },
    actionKey: {
      backgroundColor: colors.backgroundSelected,
    },
    spaceKey: {
      flex: 4,
    },
    submitWrapper: {
      flex: 3,
      height: KEY_HEIGHT,
    },
    submit: {
      flex: 1,
      borderRadius: Radius.sm - 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitText: {
      color: '#ffffff',
    },
    disabled: {
      opacity: 0.45,
    },
  });
