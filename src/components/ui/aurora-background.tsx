import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

type OrbProps = {
  color: string;
  size: number;
  top: number | `${number}%`;
  left: number | `${number}%`;
  drift: number;
  duration: number;
};

/** Yavaşça süzülen, kenarları yumuşak parlayan bir ışık küresi. */
function Orb({ color, size, top, left, drift, duration }: OrbProps) {
  const styles = useThemedStyles(createStyles);
  const t = useSharedValue(0);

  useEffect(() => {
    t.set(withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [duration, t]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.get() * drift },
      { translateY: t.get() * -drift * 0.6 },
      { scale: 1 + t.get() * 0.075 },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 0.8}px ${size * 0.5}px ${color}`,
        },
        animatedStyle,
      ]}
    />
  );
}

/** Ekranların arkasında duran, canlı "aurora" ışıklı zemin. */
export function AuroraBackground() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <View style={styles.container} pointerEvents="none">
      <Orb color={colors.orbViolet} size={220} top={-60} left={-60} drift={20} duration={9000} />
      <Orb color={colors.orbPink} size={180} top="35%" left="60%" drift={-25} duration={11000} />
      <Orb color={colors.orbCyan} size={200} top="75%" left={-40} drift={22} duration={13000} />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.background,
      overflow: 'hidden',
    },
    orb: {
      position: 'absolute',
    },
  });
