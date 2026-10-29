import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Fonts, Gradients, Radius, Spacing, type GradientName, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

type GradientButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  gradient?: GradientName;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

export function GradientButton({
  title,
  gradient = 'primary',
  size = 'md',
  style,
  ...rest
}: GradientButtonProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const isNeutral = gradient === 'neutral';
  // Nötr buton temanın yüzey rengini kullanır; diğerleri iki temada da aynı canlı gradienttir.
  const gradientColors = isNeutral ? ([colors.backgroundSelected, colors.backgroundElement] as const) : Gradients[gradient];

  return (
    <ScalePressable style={[styles.wrapper, !isNeutral && styles.glow, style]} {...rest}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, size === 'lg' && styles.large, isNeutral && styles.neutralBorder]}>
        <ThemedText style={[styles.title, size === 'lg' && styles.largeTitle, isNeutral && styles.neutralTitle]}>
          {title}
        </ThemedText>
      </LinearGradient>
    </ScalePressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      borderRadius: Radius.md,
    },
    glow: {
      boxShadow: '0 10px 30px rgba(139, 92, 255, 0.35)',
    },
    button: {
      minHeight: 54,
      paddingHorizontal: Spacing.four,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
    },
    large: {
      minHeight: 64,
    },
    neutralBorder: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    title: {
      color: '#ffffff',
      fontFamily: Fonts.bold,
      fontSize: 16,
      textAlign: 'center',
    },
    neutralTitle: {
      color: colors.text,
    },
    largeTitle: {
      fontSize: 18,
    },
  });
