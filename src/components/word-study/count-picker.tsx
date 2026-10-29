import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { enter } from '@/constants/motion';
import { AccentGradients, Gradients, Radius, Spacing } from '@/constants/theme';
import { WORD_COUNT_OPTIONS } from '@/utils/word-quiz';

const LEVELS: Record<(typeof WORD_COUNT_OPTIONS)[number], string> = {
  5: 'Isınma 🔥',
  10: 'Normal ⚡',
  15: 'Güçlü 💪',
  20: 'Efsane 🏆',
};

type CountPickerProps = {
  onSelect: (count: number) => void;
};

export function CountPicker({ onSelect }: CountPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.center}>
          Kaç kelime?
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Küçük başla, her gün biraz daha büyüt.
        </ThemedText>
      </View>

      <View style={styles.grid}>
        {WORD_COUNT_OPTIONS.map((count, index) => (
          <Animated.View
            key={count}
            entering={enter(index)}
            style={styles.cell}>
            <ScalePressable onPress={() => onSelect(count)}>
              <LinearGradient
                colors={Gradients[AccentGradients[index % AccentGradients.length]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tile}>
                <ThemedText type="display" style={styles.white}>
                  {count}
                </ThemedText>
                <ThemedText type="label" style={styles.tileLabel}>
                  kelime
                </ThemedText>
                <View style={styles.levelPill}>
                  <ThemedText type="smallBold" style={styles.white}>
                    {LEVELS[count]}
                  </ThemedText>
                </View>
              </LinearGradient>
            </ScalePressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  center: {
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '40%',
  },
  tile: {
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    paddingVertical: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
  },
  white: {
    color: '#ffffff',
  },
  tileLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  levelPill: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
