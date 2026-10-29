import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GrammarExerciseCard } from '@/components/grammar/grammar-exercise-card';
import { GrammarSectionCard } from '@/components/grammar/grammar-section-card';
import { RichText } from '@/components/grammar/rich-text';
import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { enter } from '@/constants/motion';
import { Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import type { GrammarContent } from '@/data/grammar-content/types';
import { getGrammarScores, markActiveToday, saveGrammarAnswer } from '@/db/progress';
import { saveInBackground, useUserQuery } from '@/db/use-user-query';
import { useUser } from '@/db/user-context';

/** Bir gramer konusunun anlatımını (açılır bölümler) ve alıştırmalarını gösterir. */
export function GrammarLesson({ topicId, content }: { topicId: string; content: GrammarContent }) {
  const styles = useThemedStyles(createStyles);
  const db = useSQLiteContext();
  const { user } = useUser();
  const savedScores = useUserQuery(getGrammarScores, {});
  const previous = savedScores[topicId];
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set([content.sections[0]?.id]));
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(Boolean).length;
  const totalExercises = content.exercises.length;

  function handleAnswer(index: number, isCorrect: boolean) {
    setAnswers((prev) => ({ ...prev, [index]: isCorrect }));
    saveInBackground(saveGrammarAnswer(db, user.id, topicId, index, isCorrect));
    saveInBackground(markActiveToday(db, user.id));
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={enter(1)}>
        <GlassCard style={styles.intro}>
          <RichText text={content.intro} type="small" style={styles.introText} />
        </GlassCard>
      </Animated.View>

      <View style={styles.group}>
        <ThemedText type="label" themeColor="textSecondary">
          📚 Konu Anlatımı · {content.sections.length} bölüm
        </ThemedText>
        {content.sections.map((section, index) => (
          <Animated.View key={section.id} entering={enter(Math.min(index + 2, 8))}>
            <GrammarSectionCard
              section={section}
              expanded={openSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          </Animated.View>
        ))}
      </View>

      {totalExercises > 0 && (
        <View style={styles.group}>
          <View style={styles.exerciseHeader}>
            <ThemedText type="label" themeColor="textSecondary">
              ✍️ Alıştırmalar
            </ThemedText>
            <ThemedText type="smallBold" style={styles.score}>
              {correctCount} / {totalExercises} doğru
            </ThemedText>
          </View>
          <ProgressBar progress={answeredCount / totalExercises} gradient="success" />
          {previous && answeredCount === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Önceki sonucun: {previous.correct} / {totalExercises} doğru · tekrar çözerek geliştirebilirsin.
            </ThemedText>
          )}

          {content.exercises.map((exercise, index) => (
            <GrammarExerciseCard
              key={exercise.sentence}
              exercise={exercise}
              number={index + 1}
              onAnswer={(isCorrect) => handleAnswer(index, isCorrect)}
            />
          ))}

          {answeredCount === totalExercises && (
            <Animated.View entering={enter()}>
              <GlassCard style={styles.summary}>
                <ThemedText type="subtitle" style={styles.center}>
                  {correctCount === totalExercises
                    ? 'Mükemmel! 🏆'
                    : correctCount / totalExercises >= 0.7
                      ? 'Harika iş! 🔥'
                      : 'Tekrar etmeye değer! 💪'}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  {totalExercises} sorudan {correctCount} tanesini doğru yaptın.
                </ThemedText>
              </GlassCard>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: Spacing.four,
    },
    intro: {
      padding: Spacing.three,
    },
    introText: {
      lineHeight: 22,
    },
    group: {
      gap: Spacing.three - Spacing.one,
    },
    exerciseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    score: {
      color: colors.success,
    },
    summary: {
      alignItems: 'center',
      gap: Spacing.one,
    },
    center: {
      textAlign: 'center',
    },
  });
