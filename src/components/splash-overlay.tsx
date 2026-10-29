import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Fonts } from '@/constants/theme';

/** Sistem açılış ekranıyla (app.json → expo-splash-screen) aynı zemin ve logo boyutu. */
const BACKGROUND = '#07071A';
const LOGO_SIZE = 160;
/** "made by dme" okunabilsin diye ekran bir süre sabit kalır, sonra kaybolur. */
const HOLD_MS = 700;
const FADE_MS = 700;

const exitKeyframe = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  [Math.round((HOLD_MS / (HOLD_MS + FADE_MS)) * 100)]: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 1.06 }], easing: Easing.out(Easing.cubic) },
});

/**
 * Sistem açılış ekranının hemen ardından gösterilen, uygulama yüklenirken üstte duran açılış katmanı:
 * ortada EW logosu, altta "made by dme". Sistem açılış ekranı kapanınca kısa bir süre sonra kaybolur.
 */
export function SplashOverlay() {
  const insets = useSafeAreaInsets();
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const content = (
    <>
      <Image style={styles.logo} source={require('@/assets/images/splash-icon.png')} />
      <Text style={[styles.credit, { bottom: insets.bottom + 32 }]}>made by dme</Text>
    </>
  );

  return leaving ? (
    <Animated.View
      pointerEvents="none"
      entering={exitKeyframe.duration(HOLD_MS + FADE_MS).withCallback((finished) => {
        'worklet';
        if (finished) scheduleOnRN(setVisible, false);
      })}
      style={styles.overlay}>
      {content}
    </Animated.View>
  ) : (
    <View
      // İlk çizimden sonra sistem açılış ekranı kapatılır; bu katman onun yerini kesintisiz alır.
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => setLeaving(true));
      }}
      style={styles.overlay}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  credit: {
    position: 'absolute',
    color: 'rgba(228, 228, 255, 0.55)',
    fontFamily: Fonts.medium,
    fontSize: 13,
    letterSpacing: 2,
  },
});
