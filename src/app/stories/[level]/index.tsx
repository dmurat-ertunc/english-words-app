import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { Gradients, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { getReadingMinutes, getStoriesByLevel } from '@/data/stories';
import type { Story } from '@/data/stories/types';
import { getStoryLevel, type StoryLevel } from '@/data/story-levels';
import { getReadStoryKeys } from '@/db/progress';
import { useUserQuery } from '@/db/use-user-query';

type StoryRowProps = {
  story: Story;
  index: number;
  level: StoryLevel;
  read: boolean;
};

function StoryRow({ story, index, level, read }: StoryRowProps) {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  return (
    <ScalePressable
      style={styles.row}
      onPress={() =>
        router.push({ pathname: '/stories/[level]/[story]', params: { level: level.id, story: story.id } })
      }>
      <LinearGradient
        colors={Gradients[level.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emojiBubble}>
        <ThemedText style={styles.emoji}>{story.emoji}</ThemedText>
      </LinearGradient>
      <View style={styles.rowTexts}>
        <ThemedText type="label" themeColor="textFaint">
          Hikaye {index + 1}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.rowTitle}>
          {story.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {story.titleTr} · ~{getReadingMinutes(story)} dk
        </ThemedText>
      </View>
      {read && (
        <View style={styles.readPill}>
          <ThemedText type="label" style={styles.readText}>
            ✓ Okundu
          </ThemedText>
        </View>
      )}
      <ThemedText type="subtitle" themeColor="textFaint">
        ›
      </ThemedText>
    </ScalePressable>
  );
}

export default function StoryLevelScreen() {
  const styles = useThemedStyles(createStyles);
  const { level: levelId } = useLocalSearchParams<{ level: string }>();
  const level = getStoryLevel(levelId);
  const readKeys = useUserQuery(getReadStoryKeys, new Set<string>());

  if (!level) {
    return (
      <Screen showBack>
        <View style={styles.centered}>
          <ThemedText>Seviye bulunamadı.</ThemedText>
        </View>
      </Screen>
    );
  }

  const stories = getStoriesByLevel(level.id);
  const readCount = stories.filter((story) => readKeys.has(`${level.id}/${story.id}`)).length;

  return (
    <Screen showBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter()}>
          <LinearGradient
            colors={Gradients[level.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.ring} />
            <ThemedText type="label" style={styles.heroLabel}>
              Hikayeler{stories.length > 0 && ` · ${readCount}/${stories.length} okundu`}
            </ThemedText>
            <ThemedText type="display" style={styles.white}>
              {level.label}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.white}>
              {level.name}
            </ThemedText>
            <ThemedText type="small" style={styles.heroSubtitle}>
              {level.description}
            </ThemedText>
          </LinearGradient>
        </Animated.View>

        {stories.length > 0 ? (
          <View style={styles.list}>
            {stories.map((story, index) => (
              <Animated.View key={story.id} entering={enter(Math.min(index + 1, 8))}>
                <StoryRow story={story} index={index} level={level} read={readKeys.has(`${level.id}/${story.id}`)} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <Animated.View entering={enter(1)}>
            <GlassCard style={styles.placeholder}>
              <ThemedText style={styles.placeholderEmoji}>✍️</ThemedText>
              <ThemedText type="subtitle" style={styles.center}>
                Hikayeler hazırlanıyor
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                {level.label} seviyesine uygun hikayeler çok yakında burada olacak.
              </ThemedText>
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      width: '100%',
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      padding: Spacing.four,
      paddingTop: Spacing.two,
      gap: Spacing.four,
    },
    hero: {
      borderRadius: Radius.xl,
      borderCurve: 'continuous',
      padding: Spacing.four,
      gap: Spacing.one,
      overflow: 'hidden',
    },
    ring: {
      position: 'absolute',
      width: 200,
      height: 200,
      top: -90,
      right: -60,
      borderRadius: Radius.pill,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    heroLabel: {
      color: 'rgba(255, 255, 255, 0.85)',
    },
    white: {
      color: '#ffffff',
    },
    heroSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
    list: {
      gap: Spacing.two,
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
    emojiBubble: {
      width: 48,
      height: 48,
      borderRadius: Radius.sm,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 24,
      lineHeight: 30,
    },
    readPill: {
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.half + 1,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(46, 230, 166, 0.14)',
    },
    readText: {
      color: colors.success,
      fontSize: 10,
      lineHeight: 14,
    },
    rowTexts: {
      flex: 1,
    },
    rowTitle: {
      fontSize: 16,
    },
    placeholder: {
      alignItems: 'center',
      gap: Spacing.two,
      paddingVertical: Spacing.five,
    },
    placeholderEmoji: {
      fontSize: 40,
      lineHeight: 48,
    },
    center: {
      textAlign: 'center',
    },
  });
