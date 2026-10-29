import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

const LANGUAGE = 'en-US';
/** Kelimenin biraz yavaş ve anlaşılır okunması için. */
const RATE = 0.9;

/** Cihazda İngilizce ses olup olmadığı yalnızca bir kez kontrol edilir. */
let englishVoiceCheck: Promise<boolean> | null = null;

function hasEnglishVoice(): Promise<boolean> {
  englishVoiceCheck ??= Speech.getAvailableVoicesAsync()
    // Ses listesi boş dönebiliyor (motor henüz hazır değil); bu durumda okumayı engellemeyiz.
    .then((voices) => voices.length === 0 || voices.some((voice) => voice.language.toLowerCase().startsWith('en')))
    .catch(() => true);
  return englishVoiceCheck;
}

function showMissingVoiceAlert() {
  Alert.alert(
    'İngilizce ses bulunamadı',
    'Kelimeleri dinleyebilmek için telefonunun metin okuma ayarlarından İngilizce (ABD) ses paketini yüklemelisin.',
    [
      { text: 'Tamam', style: 'cancel' },
      {
        text: 'Ayarları aç',
        onPress: () =>
          Platform.OS === 'android'
            ? Linking.sendIntent('com.android.settings.TTS_SETTINGS').catch(() => Linking.openSettings())
            : Linking.openSettings(),
      },
    ],
  );
}

type SpeakButtonProps = {
  text: string;
  size?: number;
  /** Ekran okuyucunun söyleyeceği etiket; verilmezse "<metin> kelimesini dinle". */
  accessibilityLabel?: string;
};

/** İngilizce metni cihazın metin okuma motoruyla (Amerikan aksanı) seslendiren hoparlör butonu. */
export function SpeakButton({ text, size = 40, accessibilityLabel }: SpeakButtonProps) {
  const styles = useThemedStyles(createStyles);
  const [speaking, setSpeaking] = useState(false);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (speaking) {
      pulse.set(withRepeat(withTiming(1.12, { duration: 420 }), -1, true));
    } else {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 150 }));
    }
  }, [speaking, pulse]);

  // Kart değişince ya da ekrandan çıkınca okuma durdurulur.
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, [text]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));

  async function handlePress() {
    Haptics.selectionAsync();
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }
    if (!(await hasEnglishVoice())) {
      showMissingVoiceAlert();
      return;
    }
    // Başka bir butonun okuması sürüyorsa kesilir; sesler üst üste binmez.
    await Speech.stop();
    Speech.speak(text, {
      language: LANGUAGE,
      rate: RATE,
      onStart: () => setSpeaking(true),
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `${text} kelimesini dinle`}
      hitSlop={8}
      onPress={handlePress}>
      <Animated.View
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
          speaking && styles.speaking,
          animatedStyle,
        ]}>
        <ThemedText style={{ fontSize: size * 0.45, lineHeight: size * 0.6 }}>🔊</ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundSelected,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    speaking: {
      backgroundColor: 'rgba(139, 92, 255, 0.28)',
      borderColor: colors.violet,
    },
  });
