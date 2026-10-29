import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PRESS_TIMING } from '@/constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ScalePressableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Basılınca hafif titreşim verir. */
  haptic?: boolean;
};

/** Basıldığında yaylı bir şekilde küçülen dokunulabilir alan. */
export function ScalePressable({ style, haptic = true, onPressIn, onPressOut, ...rest }: ScalePressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        scale.set(withTiming(0.97, PRESS_TIMING));
        if (haptic) Haptics.selectionAsync();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withTiming(1, PRESS_TIMING));
        onPressOut?.(event);
      }}
      {...rest}
    />
  );
}
