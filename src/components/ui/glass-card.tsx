import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

/** Yarı saydam, ince kenarlıklı "cam" yüzey. */
export function GlassCard({ style, ...rest }: ViewProps) {
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.card, style]} {...rest} />;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundElement,
      borderColor: colors.border,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: Radius.lg,
      padding: Spacing.four,
      borderCurve: 'continuous',
    },
  });
