import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GradientButton } from '@/components/ui/gradient-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { SpeakButton } from '@/components/ui/speak-button';
import { enter } from '@/constants/motion';
import { Gradients, Radius, Spacing, type GradientName, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import type { Question } from '@/utils/word-quiz';

const LETTERS = ['A', 'B', 'C', 'D'];

type QuizCardProps = {
  question: Question;
  index: number;
  total: number;
  /** Sorunun altındaki yönlendirme, ör. "Türkçe anlamı hangisi?" */
  hint: string;
  /** Son sorudan sonraki butonun yazısı. */
  lastActionLabel: string;
  progressGradient?: GradientName;
  /** Sorulan metnin yanında hoparlör gösterir; yalnızca İngilizce sorulan testte açılmalı. */
  speakPrompt?: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
};

export function QuizCard({
  question,
  index,
  total,
  hint,
  lastActionLabel,
  progressGradient = 'grammar',
  speakPrompt = false,
  onAnswer,
  onNext,
}: QuizCardProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === question.answer;
  const isLast = index === total - 1;

  function handleSelect(option: string) {
    if (answered) return;
    const correct = option === question.answer;
    setSelected(option);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );
    onAnswer(correct);
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <ThemedText type="label" themeColor="textSecondary">
            Soru
          </ThemedText>
          <ThemedText type="smallBold">
            {index + 1} <ThemedText type="small" themeColor="textFaint">/ {total}</ThemedText>
          </ThemedText>
        </View>
        <ProgressBar progress={(index + 1) / total} gradient={progressGradient} />
      </View>

      <Animated.View entering={enter()} style={styles.prompt}>
        <View style={styles.promptRow}>
          <ThemedText type="display" style={[styles.center, styles.promptText]} adjustsFontSizeToFit numberOfLines={2}>
            {question.prompt}
          </ThemedText>
          {speakPrompt && <SpeakButton text={question.prompt} />}
        </View>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {hint}
        </ThemedText>
      </Animated.View>

      <View style={styles.options}>
        {question.options.map((option, optionIndex) => {
          const isAnswer = option === question.answer;
          const isSelected = option === selected;
          const gradient = answered && isAnswer ? 'success' : answered && isSelected ? 'danger' : null;
          const dimmed = answered && !gradient;

          return (
            <Animated.View
              key={option}
              entering={enter(optionIndex + 1)}>
              <ScalePressable
                onPress={() => handleSelect(option)}
                disabled={answered}
                haptic={false}
                style={[styles.option, dimmed && styles.dimmed]}>
                {gradient && (
                  <LinearGradient
                    colors={Gradients[gradient]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <View style={[styles.letter, gradient && styles.letterActive]}>
                  <ThemedText type="smallBold" style={gradient && styles.white}>
                    {gradient === 'success' ? '✓' : gradient === 'danger' ? '✕' : LETTERS[optionIndex]}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.optionText, gradient && styles.white]}>{option}</ThemedText>
              </ScalePressable>
            </Animated.View>
          );
        })}
      </View>

      {answered && (
        <Animated.View entering={enter()} style={styles.footer}>
          <View style={[styles.feedback, { backgroundColor: isCorrect ? 'rgba(46, 230, 166, 0.12)' : 'rgba(255, 92, 122, 0.12)' }]}>
            <ThemedText type="smallBold" style={{ color: isCorrect ? colors.success : colors.danger }}>
              {isCorrect ? 'Harika! Doğru cevap 🎉' : 'Olsun, bir dahakine! 💪'}
            </ThemedText>
            {!isCorrect && (
              <ThemedText type="small" themeColor="textSecondary">
                Doğru cevap: {question.answer}
              </ThemedText>
            )}
          </View>
          <GradientButton
            title={isLast ? lastActionLabel : 'Sonraki Soru  →'}
            gradient={isLast ? 'sunset' : 'primary'}
            onPress={onNext}
          />
        </Animated.View>
      )}
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
    promptRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.three,
    },
    promptText: {
      flexShrink: 1,
    },
    prompt: {
      gap: Spacing.one,
    },
    center: {
      textAlign: 'center',
    },
    options: {
      gap: Spacing.two,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      overflow: 'hidden',
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    dimmed: {
      opacity: 0.45,
    },
    letter: {
      width: 32,
      height: 32,
      borderRadius: Radius.sm,
      backgroundColor: colors.backgroundSelected,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letterActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    optionText: {
      flex: 1,
    },
    white: {
      color: '#ffffff',
    },
    footer: {
      gap: Spacing.three,
    },
    feedback: {
      borderRadius: Radius.md,
      padding: Spacing.three,
      gap: Spacing.half,
      alignItems: 'center',
    },
  });
