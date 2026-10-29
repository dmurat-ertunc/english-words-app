import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Screen } from '@/components/ui/screen';
import { CountPicker } from '@/components/word-study/count-picker';
import { LearnCard } from '@/components/word-study/learn-card';
import { QuizCard } from '@/components/word-study/quiz-card';
import { ResultCard } from '@/components/word-study/result-card';
import { StudyModal } from '@/components/word-study/study-modal';
import { WritingCard } from '@/components/word-study/writing-card';
import { enter } from '@/constants/motion';
import { Gradients, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import {
  getWordProgress,
  markActiveToday,
  recordSessionResults,
  recordWordAnswer,
  recordWordsSeen,
  saveQuizSession,
} from '@/db/progress';
import { saveInBackground } from '@/db/use-user-query';
import { useUser } from '@/db/user-context';
import {
  buildQuestions,
  pickWordsForStudy,
  shuffle,
  type Question,
  type Word,
} from '@/utils/word-quiz';

type Phase = 'idle' | 'pick' | 'learn' | 'quiz' | 'writing' | 'reverse' | 'result';

const PHASE_TITLES: Record<Phase, string> = {
  idle: '',
  pick: 'Seviyeni seç',
  learn: 'Öğrenme',
  quiz: 'Çoktan Seçmeli',
  writing: 'Yazma Testi',
  reverse: 'Türkçeden İngilizceye',
  result: 'Sonuç',
};

const STEPS = [
  { emoji: '📖', title: 'Öğren', description: 'Kelimeleri tek tek keşfet' },
  { emoji: '🎯', title: 'Seç', description: 'Çoktan seçmeli sorularla pekiştir' },
  { emoji: '✍️', title: 'Yaz', description: 'Kelimeleri kendin yazarak kalıcı yap' },
  { emoji: '🔁', title: 'Tersine çevir', description: 'Türkçeden İngilizceyi bul' },
  { emoji: '🏆', title: 'Kazan', description: 'Skorunu gör, eksiklerini tamamla' },
];

export default function WordsScreen() {
  const db = useSQLiteContext();
  const { user } = useUser();
  const [phase, setPhase] = useState<Phase>('idle');
  const [words, setWords] = useState<Word[]>([]);
  const [learnIndex, setLearnIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizWrong, setQuizWrong] = useState<Word[]>([]);
  const [writingWords, setWritingWords] = useState<Word[]>([]);
  const [writingIndex, setWritingIndex] = useState(0);
  const [writingWrong, setWritingWrong] = useState<Word[]>([]);
  const [reverseQuestions, setReverseQuestions] = useState<Question[]>([]);
  const [reverseIndex, setReverseIndex] = useState(0);
  const [reverseWrong, setReverseWrong] = useState<Word[]>([]);

  async function handleSelectCount(count: number) {
    // Kelimeler kullanıcının ilerlemesine göre seçilir; okunamazsa tamamen rastgele seçilir.
    const progress = await getWordProgress(db, user.id).catch(() => []);
    setWords(pickWordsForStudy(count, progress));
    setLearnIndex(0);
    setPhase('learn');
  }

  function recordAnswer(word: Word, isCorrect: boolean) {
    saveInBackground(recordWordAnswer(db, user.id, word.id, isCorrect));
  }

  function handleLearnNext() {
    if (learnIndex < words.length - 1) {
      setLearnIndex(learnIndex + 1);
      return;
    }
    saveInBackground(recordWordsSeen(db, user.id, words.map((word) => word.id)));
    setQuestions(buildQuestions(words));
    setQuestionIndex(0);
    setQuizWrong([]);
    setPhase('quiz');
  }

  function handleQuizAnswer(isCorrect: boolean) {
    recordAnswer(questions[questionIndex].word, isCorrect);
    if (!isCorrect) {
      setQuizWrong((prev) => [...prev, questions[questionIndex].word]);
    }
  }

  function handleQuizNext() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }
    setWritingWords(shuffle(words));
    setWritingIndex(0);
    setWritingWrong([]);
    setPhase('writing');
  }

  function handleWritingAnswer(isCorrect: boolean) {
    recordAnswer(writingWords[writingIndex], isCorrect);
    if (!isCorrect) {
      setWritingWrong((prev) => [...prev, writingWords[writingIndex]]);
    }
  }

  function handleWritingNext() {
    if (writingIndex < writingWords.length - 1) {
      setWritingIndex(writingIndex + 1);
      return;
    }
    setReverseQuestions(buildQuestions(words, 'tr-en'));
    setReverseIndex(0);
    setReverseWrong([]);
    setPhase('reverse');
  }

  function handleReverseAnswer(isCorrect: boolean) {
    recordAnswer(reverseQuestions[reverseIndex].word, isCorrect);
    if (!isCorrect) {
      setReverseWrong((prev) => [...prev, reverseQuestions[reverseIndex].word]);
    }
  }

  function handleReverseNext() {
    if (reverseIndex < reverseQuestions.length - 1) {
      setReverseIndex(reverseIndex + 1);
      return;
    }
    saveInBackground(
      saveQuizSession(db, user.id, {
        wordCount: words.length,
        enTrCorrect: questions.length - quizWrong.length,
        writingCorrect: writingWords.length - writingWrong.length,
        trEnCorrect: reverseQuestions.length - reverseWrong.length,
      }),
    );
    // Kelime, 3 testin hiçbirinde yanlış yapılmadıysa öğrenilmiş sayılır.
    const wrongIds = new Set([...quizWrong, ...writingWrong, ...reverseWrong].map((word) => word.id));
    saveInBackground(
      recordSessionResults(
        db,
        user.id,
        words.map((word) => ({ wordId: word.id, learned: !wrongIds.has(word.id) })),
      ),
    );
    saveInBackground(markActiveToday(db, user.id));
    setPhase('result');
  }

  // Birden fazla testte yanlış yapılan kelimeler tek sefer listelenir.
  const wrongWords = [
    ...new Map([...quizWrong, ...writingWrong, ...reverseWrong].map((word) => [word.id, word])).values(),
  ];

  return (
    <Screen showBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter(0)} style={styles.hero}>
          <LinearGradient
            colors={Gradients.words}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroIcon}>
            <ThemedText style={styles.heroEmoji}>🚀</ThemedText>
          </LinearGradient>
          <ThemedText type="display" style={styles.center}>
            Kelime Öğren
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.center}>
            Rastgele seçilen kelimeleri keşfet, ardından üç farklı testle kendini sına.
          </ThemedText>
        </Animated.View>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <Animated.View key={step.title} entering={enter(index + 1)}>
              <GlassCard style={styles.step}>
                <ThemedText style={styles.stepEmoji}>{step.emoji}</ThemedText>
                <View style={styles.stepTexts}>
                  <ThemedText type="smallBold">
                    {index + 1}. {step.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {step.description}
                  </ThemedText>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={enter(4)}>
          <GradientButton
            title="Hadi Başlayalım  🚀"
            gradient="words"
            size="lg"
            onPress={() => setPhase('pick')}
          />
        </Animated.View>
      </ScrollView>

      <StudyModal visible={phase !== 'idle'} title={PHASE_TITLES[phase]} onClose={() => setPhase('idle')}>
        {phase === 'pick' && <CountPicker onSelect={handleSelectCount} />}

        {phase === 'learn' && words[learnIndex] && (
          <LearnCard
            word={words[learnIndex]}
            index={learnIndex}
            total={words.length}
            onPrevious={() => setLearnIndex(learnIndex - 1)}
            onNext={handleLearnNext}
          />
        )}

        {phase === 'quiz' && questions[questionIndex] && (
          <QuizCard
            key={questionIndex}
            question={questions[questionIndex]}
            index={questionIndex}
            total={questions.length}
            hint="Türkçe anlamı hangisi?"
            speakPrompt
            lastActionLabel="Yazma Testine Geç  ✍️"
            onAnswer={handleQuizAnswer}
            onNext={handleQuizNext}
          />
        )}

        {phase === 'writing' && writingWords[writingIndex] && (
          <WritingCard
            key={writingIndex}
            word={writingWords[writingIndex]}
            index={writingIndex}
            total={writingWords.length}
            onAnswer={handleWritingAnswer}
            onNext={handleWritingNext}
          />
        )}

        {phase === 'reverse' && reverseQuestions[reverseIndex] && (
          <QuizCard
            key={reverseIndex}
            question={reverseQuestions[reverseIndex]}
            index={reverseIndex}
            total={reverseQuestions.length}
            hint="İngilizcesi hangisi?"
            lastActionLabel="Sonucu Gör  🏆"
            progressGradient="words"
            onAnswer={handleReverseAnswer}
            onNext={handleReverseNext}
          />
        )}

        {phase === 'result' && (
          <ResultCard
            scores={[
              {
                label: 'EN → TR',
                emoji: '🎯',
                correct: questions.length - quizWrong.length,
                total: questions.length,
              },
              {
                label: 'Yazma',
                emoji: '✍️',
                correct: writingWords.length - writingWrong.length,
                total: writingWords.length,
              },
              {
                label: 'TR → EN',
                emoji: '🔁',
                correct: reverseQuestions.length - reverseWrong.length,
                total: reverseQuestions.length,
              },
            ]}
            wrongWords={wrongWords}
            learnedCount={words.length - wrongWords.length}
            onRestart={() => setPhase('pick')}
            onClose={() => setPhase('idle')}
          />
        )}
      </StudyModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 16px 40px rgba(255, 92, 170, 0.45)',
  },
  heroEmoji: {
    fontSize: 42,
    lineHeight: 50,
  },
  center: {
    textAlign: 'center',
  },
  steps: {
    gap: Spacing.two,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  stepEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  stepTexts: {
    flex: 1,
  },
});
