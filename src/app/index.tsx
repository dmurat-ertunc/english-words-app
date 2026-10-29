import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { FeatureCard } from '@/components/home/feature-card';
import { StatsCard } from '@/components/home/stats-card';
import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { GRAMMAR_TOPICS } from '@/data/grammar-topics';
import { STORY_LEVELS } from '@/data/story-levels';
import { getUserStats, type UserStats } from '@/db/progress';
import { useUserQuery } from '@/db/use-user-query';
import { useUser } from '@/db/user-context';
import { getWordOfTheDay, WORDS } from '@/utils/word-quiz';

const EMPTY_STATS: UserStats = { learnedWords: 0, streak: 0, storiesRead: 0, quizzes: 0 };

export default function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { user } = useUser();
  const stats = useUserQuery(getUserStats, EMPTY_STATS);
  const wordOfTheDay = getWordOfTheDay();

  return (
    <Screen
      headerLeft={
        <View style={styles.badge}>
          <ThemedText type="label" themeColor="textSecondary" numberOfLines={1}>
            👋 Merhaba, {user.name}
          </ThemedText>
        </View>
      }
      headerRight={
        <ScalePressable
          accessibilityRole="button"
          accessibilityLabel="Profil"
          style={styles.avatar}
          onPress={() => router.push('/profile')}>
          <ThemedText type="smallBold" style={styles.avatarText}>
            {user.name.charAt(0).toLocaleUpperCase('tr-TR')}
          </ThemedText>
        </ScalePressable>
      }>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter(0)} style={styles.hero}>
          <ThemedText type="display">
            Bugün bir adım daha <ThemedText type="display" style={styles.accent}>ileri.</ThemedText>
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Günde sadece 5 dakika. Farkı bir haftada hissedeceksin.
          </ThemedText>
        </Animated.View>

        <Animated.View entering={enter(1)}>
          <StatsCard stats={stats} onPressLearned={() => router.push('/learned-words')} />
        </Animated.View>

        <Animated.View entering={enter(1)}>
          <GlassCard style={styles.wordOfDay}>
            <ThemedText style={styles.wordOfDayEmoji}>☀️</ThemedText>
            <View style={styles.wordOfDayTexts}>
              <ThemedText type="label" style={styles.wordOfDayLabel}>
                Günün Kelimesi
              </ThemedText>
              <ThemedText type="small" numberOfLines={1}>
                <ThemedText type="smallBold">{wordOfTheDay.word}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {'  ·  '}
                  {wordOfTheDay.turkish}
                </ThemedText>
              </ThemedText>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={styles.features}>
          <Animated.View entering={enter(2)}>
            <FeatureCard
              href="/words"
              emoji="📚"
              title="Kelime Çalış"
              stat={`${WORDS.length.toLocaleString('tr-TR')} kelime`}
              gradient="words"
              glowColor="rgba(139, 92, 255, 0.4)"
            />
          </Animated.View>

          <Animated.View entering={enter(3)}>
            <FeatureCard
              href="/grammar"
              emoji="🧠"
              title="Grammer Çalış"
              stat={`${GRAMMAR_TOPICS.length} konu`}
              gradient="grammar"
              glowColor="rgba(34, 211, 255, 0.3)"
            />
          </Animated.View>

          <Animated.View entering={enter(4)}>
            <FeatureCard
              href="/stories"
              emoji="📖"
              title="Hikayeler"
              stat={`${STORY_LEVELS[0].label}–${STORY_LEVELS[STORY_LEVELS.length - 1].label} seviyeleri`}
              gradient="sunset"
              glowColor="rgba(255, 140, 90, 0.3)"
            />
          </Animated.View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      width: '100%',
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      padding: Spacing.four,
      gap: Spacing.four,
    },
    features: {
      gap: Spacing.three - Spacing.one,
    },
    hero: {
      gap: Spacing.three,
      marginTop: Spacing.three,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(139, 92, 255, 0.25)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(139, 92, 255, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: colors.accentText,
      fontSize: 16,
    },
    badge: {
      flexShrink: 1,
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    accent: {
      color: colors.pink,
    },
    wordOfDay: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three - Spacing.one,
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.md,
    },
    wordOfDayEmoji: {
      fontSize: 18,
      lineHeight: 24,
    },
    wordOfDayTexts: {
      flex: 1,
    },
    wordOfDayLabel: {
      color: colors.amber,
      fontSize: 10,
      lineHeight: 14,
    },
  });
