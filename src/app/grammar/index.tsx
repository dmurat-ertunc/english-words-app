import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { AccentGradients, Gradients, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { getGrammarContent } from '@/data/grammar-content';
import { GRAMMAR_TOPICS, type GrammarTopic } from '@/data/grammar-topics';
import { getGrammarScores, type GrammarScore } from '@/db/progress';
import { useUserQuery } from '@/db/use-user-query';

type TopicRowProps = {
  topic: GrammarTopic;
  index: number;
  score?: GrammarScore;
};

function TopicRow({ topic, index, score }: TopicRowProps) {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const gradient = Gradients[AccentGradients[index % AccentGradients.length]];
  const exerciseCount = getGrammarContent(topic.id)?.exercises.length ?? 0;
  const completed = exerciseCount > 0 && score !== undefined && score.answered >= exerciseCount;

  return (
    <Animated.View entering={enter(Math.min(index, 10))}>
      <ScalePressable
        style={styles.row}
        onPress={() => router.push({ pathname: '/grammar/[id]', params: { id: topic.id } })}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
          <ThemedText type="smallBold" style={styles.badgeText}>
            {topic.number ?? '🔊'}
          </ThemedText>
        </LinearGradient>
        <View style={styles.texts}>
          <ThemedText type="smallBold" style={styles.title}>
            {topic.title}
          </ThemedText>
          {topic.turkish && (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {topic.turkish}
            </ThemedText>
          )}
        </View>
        {exerciseCount > 0 && (
          <View style={styles.readyPill}>
            <ThemedText type="label" style={styles.readyText}>
              {completed && score ? `✓ ${score.correct}/${exerciseCount}` : 'Hazır'}
            </ThemedText>
          </View>
        )}
        <ThemedText type="subtitle" themeColor="textFaint">
          ›
        </ThemedText>
      </ScalePressable>
    </Animated.View>
  );
}

function ListHeader() {
  const styles = useThemedStyles(createStyles);
  return (
    <Animated.View entering={enter()} style={styles.header}>
      <View style={styles.headerBadge}>
        <ThemedText type="label" style={styles.headerBadgeText}>
          🧠 {GRAMMAR_TOPICS.length} konu
        </ThemedText>
      </View>
      <ThemedText type="display">Gramer Yolculuğu</ThemedText>
      <ThemedText themeColor="textSecondary">
        Temelden ileri seviyeye, her konu bir sonrakine köprü.
      </ThemedText>
    </Animated.View>
  );
}

export default function GrammarScreen() {
  const styles = useThemedStyles(createStyles);
  const scores = useUserQuery(getGrammarScores, {});

  return (
    <Screen showBack>
      <FlatList
        data={GRAMMAR_TOPICS}
        keyExtractor={(topic) => topic.id}
        renderItem={({ item, index }) => <TopicRow topic={item} index={index} score={scores[item.id]} />}
        extraData={scores}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    list: {
      width: '100%',
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      padding: Spacing.four,
      paddingTop: Spacing.two,
      gap: Spacing.two,
    },
    header: {
      gap: Spacing.two,
      marginBottom: Spacing.three,
    },
    headerBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(34, 211, 255, 0.12)',
    },
    headerBadgeText: {
      color: colors.cyan,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    badge: {
      width: 44,
      height: 44,
      borderRadius: Radius.sm,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: '#ffffff',
      fontSize: 16,
    },
    readyPill: {
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.half + 1,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(46, 230, 166, 0.14)',
    },
    readyText: {
      color: colors.success,
      fontSize: 10,
      lineHeight: 14,
    },
    texts: {
      flex: 1,
      gap: Spacing.half,
    },
    title: {
      fontSize: 15,
    },
  });
