import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GradientButton } from '@/components/ui/gradient-button';
import { enter } from '@/constants/motion';
import { Gradients, Radius, Spacing, type GradientName, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import type { Word } from '@/utils/word-quiz';

export type TestScore = {
  label: string;
  emoji: string;
  correct: number;
  total: number;
};

type ResultCardProps = {
  scores: TestScore[];
  wrongWords: Word[];
  /** Bu oturumda 3 sorusunun hepsi doğru cevaplanan kelime sayısı. */
  learnedCount: number;
  onRestart: () => void;
  onClose: () => void;
};

function getVerdict(ratio: number): { title: string; message: string; gradient: GradientName } {
  if (ratio === 1) return { title: 'Mükemmel! 🏆', message: 'Hepsini bildin, sen bir efsanesin.', gradient: 'sunset' };
  if (ratio >= 0.7) return { title: 'Harika iş! 🔥', message: 'Çok iyi gidiyorsun, böyle devam!', gradient: 'success' };
  if (ratio >= 0.4) return { title: 'İyi gidiyorsun! 💪', message: 'Biraz tekrar ile zirvedesin.', gradient: 'primary' };
  return { title: 'Pes etmek yok! 🌱', message: 'Her tekrar seni bir adım ileri taşır.', gradient: 'words' };
}

export function ResultCard({ scores, wrongWords, learnedCount, onRestart, onClose }: ResultCardProps) {
  const styles = useThemedStyles(createStyles);
  const correctCount = scores.reduce((sum, score) => sum + score.correct, 0);
  const total = scores.reduce((sum, score) => sum + score.total, 0);
  const ratio = total === 0 ? 0 : correctCount / total;
  const verdict = getVerdict(ratio);

  return (
    <View style={styles.container}>
      <Animated.View entering={enter()} style={styles.ringWrapper}>
        <LinearGradient
          colors={Gradients[verdict.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ring}>
          <View style={styles.ringInner}>
            <ThemedText type="display">{Math.round(ratio * 100)}%</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {correctCount} / {total} doğru
            </ThemedText>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={enter(2)} style={styles.verdict}>
        <ThemedText type="title" style={styles.center}>
          {verdict.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {verdict.message}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.scores}>
        {scores.map((score) => (
          <View key={score.label} style={styles.score}>
            <ThemedText type="small" themeColor="textSecondary">
              {score.emoji} {score.label}
            </ThemedText>
            <ThemedText type="subtitle">
              {score.correct}
              <ThemedText type="small" themeColor="textFaint"> / {score.total}</ThemedText>
            </ThemedText>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={enter(3)} style={styles.learnedBanner}>
        <ThemedText type="smallBold" style={styles.learnedText}>
          {learnedCount > 0
            ? `🎉 Bu oturumda ${learnedCount} kelime öğrendin!`
            : 'Bu oturumda öğrenilen kelime yok. Tekrar dene, başaracaksın! 💪'}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Bir kelime, 3 sorusunun hepsini doğru bildiğinde öğrenilmiş sayılır.
        </ThemedText>
      </Animated.View>

      {wrongWords.length > 0 && (
        <Animated.View entering={enter(4)} style={styles.wrongSection}>
          <ThemedText type="label" themeColor="textSecondary">
            Tekrar et
          </ThemedText>
          <View style={styles.chips}>
            {wrongWords.map((word) => (
              <View key={word.id} style={styles.chip}>
                <ThemedText type="smallBold">{word.word}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {word.turkish}
                </ThemedText>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      <View style={styles.actions}>
        <GradientButton title="Kapat" gradient="neutral" style={styles.action} onPress={onClose} />
        <GradientButton title="Yeniden  🔁" gradient="words" style={styles.action} onPress={onRestart} />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: Spacing.four,
    },
    ringWrapper: {
      alignSelf: 'center',
      borderRadius: Radius.pill,
      boxShadow: '0 16px 50px rgba(139, 92, 255, 0.4)',
    },
    ring: {
      width: 176,
      height: 176,
      borderRadius: Radius.pill,
      padding: 8,
    },
    ringInner: {
      flex: 1,
      borderRadius: Radius.pill,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    verdict: {
      gap: Spacing.one,
    },
    center: {
      textAlign: 'center',
    },
    scores: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    score: {
      flex: 1,
      alignItems: 'center',
      gap: Spacing.half,
      paddingVertical: Spacing.three - Spacing.one,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    learnedBanner: {
      gap: Spacing.half,
      alignItems: 'center',
      padding: Spacing.three,
      borderRadius: Radius.md,
      backgroundColor: 'rgba(46, 230, 166, 0.10)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(46, 230, 166, 0.35)',
    },
    learnedText: {
      color: colors.success,
      textAlign: 'center',
    },
    wrongSection: {
      gap: Spacing.two,
    },
    chips: {
      gap: Spacing.two,
    },
    chip: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.three,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two + 2,
      borderRadius: Radius.sm,
      backgroundColor: 'rgba(255, 92, 122, 0.10)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255, 92, 122, 0.35)',
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.three,
    },
    action: {
      flex: 1,
    },
  });
