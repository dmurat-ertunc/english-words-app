import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Gradients, Radius, type GradientName, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type ProgressBarProps = {
  /** 0 ile 1 arasında ilerleme oranı. */
  progress: number;
  gradient?: GradientName;
};

export function ProgressBar({ progress, gradient = 'words' }: ProgressBarProps) {
  const styles = useThemedStyles(createStyles);
  const width = useSharedValue(0);

  useEffect(() => {
    width.set(withTiming(Math.min(Math.max(progress, 0), 1), { duration: 300, easing: Easing.out(Easing.cubic) }));
  }, [progress, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.get() * 100}%` }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fillStyle]}>
        <LinearGradient
          colors={Gradients[gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    track: {
      height: 8,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundSelected,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: Radius.pill,
      overflow: 'hidden',
    },
  });
