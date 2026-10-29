import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { enter } from '@/constants/motion';
import { Fonts, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import type { GrammarExercise } from '@/data/grammar-content/types';

type GrammarExerciseCardProps = {
  exercise: GrammarExercise;
  number: number;
  onAnswer: (isCorrect: boolean) => void;
};

/** Boşluk doldurma sorusu; şıkka dokununca anında doğru/yanlış ve açıklama gösterir. */
export function GrammarExerciseCard({ exercise, number, onAnswer }: GrammarExerciseCardProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === exercise.answer;
  const [before, after] = exercise.sentence.split('___');

  function handleSelect(option: string) {
    if (answered) return;
    const correct = option === exercise.answer;
    setSelected(option);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );
    onAnswer(correct);
  }

  return (
    <View style={styles.card}>
      <ThemedText type="label" themeColor="textFaint">
        Soru {number}
      </ThemedText>
      <ThemedText style={styles.sentence}>
        {before}
        <ThemedText
          style={[
            styles.blank,
            answered && { color: isCorrect ? colors.success : colors.danger },
          ]}>
          {answered ? selected : '_____'}
        </ThemedText>
        {after}
      </ThemedText>

      <View style={styles.options}>
        {exercise.options.map((option) => {
          const showCorrect = answered && option === exercise.answer;
          const showWrong = answered && option === selected && !isCorrect;
          return (
            <ScalePressable
              key={option}
              haptic={false}
              disabled={answered}
              onPress={() => handleSelect(option)}
              style={[
                styles.option,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
                answered && !showCorrect && !showWrong && styles.optionDimmed,
              ]}>
              <ThemedText type="small" style={(showCorrect || showWrong) && styles.optionTextActive}>
                {option}
              </ThemedText>
            </ScalePressable>
          );
        })}
      </View>

      {answered && (
        <Animated.View entering={enter()} style={styles.explanation}>
          <ThemedText type="smallBold" style={{ color: isCorrect ? colors.success : colors.danger }}>
            {isCorrect ? 'Doğru! 🎉' : `Doğrusu: ${exercise.answer}`}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {exercise.explanation}
          </ThemedText>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: Radius.lg,
      borderCurve: 'continuous',
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sentence: {
      fontSize: 17,
      lineHeight: 26,
    },
    blank: {
      fontFamily: Fonts.bold,
      color: colors.amber,
    },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    option: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundSelected,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    optionCorrect: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    optionWrong: {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
    },
    optionDimmed: {
      opacity: 0.4,
    },
    optionTextActive: {
      color: '#07071A',
      fontFamily: Fonts.bold,
    },
    explanation: {
      gap: Spacing.half,
    },
  });
