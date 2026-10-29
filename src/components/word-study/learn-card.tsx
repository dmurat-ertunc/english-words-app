import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SpeakButton } from '@/components/ui/speak-button';
import { enter } from '@/constants/motion';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import type { Word } from '@/utils/word-quiz';

type LearnCardProps = {
  word: Word;
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function LearnCard({ word, index, total, onPrevious, onNext }: LearnCardProps) {
  const styles = useThemedStyles(createStyles);
  const isLast = index === total - 1;

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <ThemedText type="label" themeColor="textSecondary">
            Kelime
          </ThemedText>
          <ThemedText type="smallBold">
            {index + 1} <ThemedText type="small" themeColor="textFaint">/ {total}</ThemedText>
          </ThemedText>
        </View>
        <ProgressBar progress={(index + 1) / total} gradient="words" />
      </View>

      <Animated.View key={word.id} entering={enter()}>
        <GlassCard style={styles.wordCard}>
          <View style={styles.wordRow}>
            <ThemedText type="display" style={[styles.center, styles.word]} adjustsFontSizeToFit numberOfLines={2}>
              {word.word}
            </ThemedText>
            <SpeakButton text={word.word} />
          </View>
          <View style={styles.divider} />
          <View style={styles.meaningPill}>
            <ThemedText type="subtitle" style={[styles.center, styles.meaning]}>
              {word.turkish}
            </ThemedText>
          </View>
        </GlassCard>
      </Animated.View>

      <View style={styles.actions}>
        {index > 0 && (
          <GradientButton title="←" gradient="neutral" style={styles.backAction} onPress={onPrevious} />
        )}
        <GradientButton
          title={isLast ? 'Teste Başla  🎯' : 'Sonraki  →'}
          gradient={isLast ? 'success' : 'words'}
          style={styles.mainAction}
          onPress={onNext}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: Spacing.four,
    },
    progress: {
      gap: Spacing.two,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    center: {
      textAlign: 'center',
    },
    wordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.three,
      alignSelf: 'stretch',
    },
    word: {
      flexShrink: 1,
    },
    wordCard: {
      paddingVertical: Spacing.five,
      alignItems: 'center',
      gap: Spacing.three,
    },
    divider: {
      width: 48,
      height: 4,
      borderRadius: Radius.pill,
      backgroundColor: colors.pink,
    },
    meaningPill: {
      paddingHorizontal: Spacing.three,
    },
    meaning: {
      color: colors.cyan,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.three,
    },
    backAction: {
      width: 64,
    },
    mainAction: {
      flex: 1,
    },
  });
