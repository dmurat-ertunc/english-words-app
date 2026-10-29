import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GradientButton } from '@/components/ui/gradient-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WordKeyboard } from '@/components/word-study/word-keyboard';
import { enter } from '@/constants/motion';
import { Fonts, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { isWrittenAnswerCorrect, maskWord, type Word } from '@/utils/word-quiz';

/** En uzun kelimeden bile rahatça uzun; yanlışlıkla sınırsız yazmayı önler. */
const MAX_LENGTH = 30;

type WritingCardProps = {
  word: Word;
  index: number;
  total: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
};

/** Cevap kutusundaki yanıp sönen imleç. */
function Caret() {
  const styles = useThemedStyles(createStyles);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0, { duration: 500 }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  return <Animated.View style={[styles.caret, animatedStyle]} />;
}

export function WritingCard({ word, index, total, onAnswer, onNext }: WritingCardProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const answered = result !== null;
  const isLast = index === total - 1;
  const letterCount = word.word.replace(/[^a-z]/gi, '').length;
  const isEmpty = input.trim().length === 0;

  function handleKey(char: string) {
    // Başta boşluk ve art arda iki boşluk yazılmaz.
    if (char === ' ' && (input.length === 0 || input.endsWith(' '))) return;
    setInput((prev) => (prev.length >= MAX_LENGTH ? prev : prev + char));
  }

  function handleCheck() {
    if (answered || isEmpty) return;
    const correct = isWrittenAnswerCorrect(input, word);
    setResult(correct);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );
    onAnswer(correct);
  }

  const answerBorder = result === true ? colors.success : result === false ? colors.danger : colors.border;

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <ThemedText type="label" themeColor="textSecondary">
            Yazma Testi
          </ThemedText>
          <ThemedText type="smallBold">
            {index + 1} <ThemedText type="small" themeColor="textFaint">/ {total}</ThemedText>
          </ThemedText>
        </View>
        <ProgressBar progress={(index + 1) / total} gradient="sunset" />
      </View>

      <Animated.View entering={enter()} style={styles.prompt}>
        <ThemedText type="title" style={styles.center} adjustsFontSizeToFit numberOfLines={3}>
          {word.turkish}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          İngilizcesini yaz · {letterCount} harf
        </ThemedText>
      </Animated.View>

      <View
        accessibilityRole="text"
        accessibilityLabel={input ? `Cevabın: ${input}` : 'Cevap boş'}
        style={[styles.answer, { borderColor: answerBorder }]}>
        {input ? (
          <ThemedText style={styles.answerText} numberOfLines={1} adjustsFontSizeToFit>
            {input}
          </ThemedText>
        ) : (
          <ThemedText style={[styles.answerText, styles.placeholder]}>Cevabını yaz…</ThemedText>
        )}
        {!answered && <Caret />}
      </View>

      {answered ? (
        <Animated.View entering={enter()} style={styles.footer}>
          <View
            style={[
              styles.feedback,
              { backgroundColor: result ? 'rgba(46, 230, 166, 0.12)' : 'rgba(255, 92, 122, 0.12)' },
            ]}>
            <ThemedText type="smallBold" style={{ color: result ? colors.success : colors.danger }}>
              {result ? 'Mükemmel yazdın! 🎉' : 'Az kaldı! 💪'}
            </ThemedText>
            {!result && (
              <ThemedText type="small" themeColor="textSecondary">
                Doğrusu: <ThemedText type="smallBold">{word.word}</ThemedText>
              </ThemedText>
            )}
          </View>
          <GradientButton
            title={isLast ? 'Son Teste Geç  🔁' : 'Sonraki Kelime  →'}
            gradient={isLast ? 'sunset' : 'primary'}
            onPress={onNext}
          />
        </Animated.View>
      ) : (
        <>
          <Pressable onPress={() => setHintVisible(true)} disabled={hintVisible} hitSlop={8}>
            <ThemedText type="small" style={styles.hint}>
              {hintVisible ? maskWord(word.word, true) : '💡 İpucu göster'}
            </ThemedText>
          </Pressable>
          <WordKeyboard
            onKey={handleKey}
            onBackspace={() => setInput((prev) => prev.slice(0, -1))}
            onClear={() => setInput('')}
            onSubmit={handleCheck}
            submitDisabled={isEmpty}
          />
        </>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: Spacing.three,
    },
    progress: {
      gap: Spacing.two,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    prompt: {
      gap: Spacing.one,
    },
    center: {
      textAlign: 'center',
    },
    answer: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      backgroundColor: colors.backgroundElement,
    },
    answerText: {
      flexShrink: 1,
      fontFamily: Fonts.semibold,
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: 0.5,
    },
    placeholder: {
      color: colors.textFaint,
    },
    caret: {
      width: 2,
      height: 26,
      marginLeft: 2,
      borderRadius: 1,
      backgroundColor: colors.pink,
    },
    hint: {
      color: colors.amber,
      textAlign: 'center',
      letterSpacing: 1,
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
