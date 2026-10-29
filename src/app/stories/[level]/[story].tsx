import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { Fonts, Gradients, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { countStoryWords, getReadingMinutes, getStoriesByLevel, getStory } from '@/data/stories';
import { getStoryLevel } from '@/data/story-levels';
import { markActiveToday, markStoryRead } from '@/db/progress';
import { saveInBackground } from '@/db/use-user-query';
import { useUser } from '@/db/user-context';

/** Sona bu kadar piksel kala hikaye okunmuş sayılır. */
const READ_THRESHOLD = 120;

export default function StoryScreen() {
  const styles = useThemedStyles(createStyles);
  const { level: levelId, story: storyId } = useLocalSearchParams<{ level: string; story: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const { user } = useUser();
  const markedStoryRef = useRef<string | null>(null);
  const level = getStoryLevel(levelId);
  const story = getStory(levelId, storyId);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());

  if (!level || !story) {
    return (
      <Screen showBack>
        <View style={styles.centered}>
          <ThemedText>Hikaye bulunamadı.</ThemedText>
        </View>
      </Screen>
    );
  }

  const levelStories = getStoriesByLevel(level.id);
  const nextStory = levelStories[levelStories.indexOf(story) + 1];
  const paragraphIndexes = story.paragraphs.map((_, index) => index);
  const allRevealed = revealed.size === paragraphIndexes.length;

  function toggleParagraph(index: number) {
    Haptics.selectionAsync();
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function markRead() {
    if (!level || !story || markedStoryRef.current === story.id) return;
    markedStoryRef.current = story.id;
    saveInBackground(markStoryRead(db, user.id, level.id, story.id));
    saveInBackground(markActiveToday(db, user.id));
  }

  function handleScroll({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - READ_THRESHOLD) markRead();
  }

  function toggleAll() {
    Haptics.selectionAsync();
    setRevealed(allRevealed ? new Set() : new Set(paragraphIndexes));
  }

  return (
    <Screen showBack>
      {/* key: başka hikayeye geçince kaydırma ve açık çeviriler sıfırlanır */}
      <ScrollView
        key={story.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}>
        <Animated.View entering={enter()} style={styles.header}>
          <View style={styles.meta}>
            <LinearGradient
              colors={Gradients[level.gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelPill}>
              <ThemedText type="label" style={styles.white}>
                {level.label}
              </ThemedText>
            </LinearGradient>
            <ThemedText type="small" themeColor="textSecondary">
              ~{getReadingMinutes(story)} dk · {countStoryWords(story)} kelime
            </ThemedText>
          </View>
          <ThemedText style={styles.storyEmoji}>{story.emoji}</ThemedText>
          <ThemedText type="title">{story.title}</ThemedText>
          <ThemedText themeColor="textSecondary">{story.titleTr}</ThemedText>
        </Animated.View>

        <Animated.View entering={enter(1)} style={styles.toolbar}>
          <ThemedText type="small" themeColor="textFaint" style={styles.toolbarHint}>
            Türkçesini görmek için paragrafa dokun
          </ThemedText>
          <Pressable onPress={toggleAll} hitSlop={8} style={styles.toggleAll}>
            <ThemedText type="smallBold" style={styles.toggleAllText}>
              {allRevealed ? 'Tümünü gizle' : '🇹🇷 Tümünü göster'}
            </ThemedText>
          </Pressable>
        </Animated.View>

        <View style={styles.paragraphs}>
          {story.paragraphs.map((paragraph, index) => {
            const isOpen = revealed.has(index);
            return (
              <Animated.View key={index} entering={enter(Math.min(index + 2, 8))}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityHint="Türkçe çeviriyi gösterir veya gizler"
                  onPress={() => toggleParagraph(index)}
                  style={({ pressed }) => [styles.paragraph, isOpen && styles.paragraphOpen, pressed && styles.pressed]}>
                  <ThemedText style={styles.english}>{paragraph.en}</ThemedText>
                  {isOpen && (
                    <Animated.View entering={enter()} style={styles.translation}>
                      <ThemedText type="small" style={styles.turkish}>
                        {paragraph.tr}
                      </ThemedText>
                    </Animated.View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <GlassCard style={styles.vocabulary}>
          <ThemedText type="label" style={styles.vocabularyLabel}>
            📌 Anahtar kelimeler
          </ThemedText>
          <View style={styles.words}>
            {story.vocabulary.map((item) => (
              <View key={item.word} style={styles.word}>
                <ThemedText type="smallBold">{item.word}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.tr}
                </ThemedText>
              </View>
            ))}
          </View>
        </GlassCard>

        {nextStory ? (
          <GradientButton
            title={`Sonraki: ${nextStory.title}  →`}
            gradient={level.gradient}
            onPress={() =>
              router.replace({ pathname: '/stories/[level]/[story]', params: { level: level.id, story: nextStory.id } })
            }
          />
        ) : (
          <GradientButton
            title={`🎉 ${level.label} hikayelerinin hepsi bitti!`}
            gradient={level.gradient}
            onPress={() => router.back()}
          />
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
    header: {
      gap: Spacing.one,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      marginBottom: Spacing.two,
    },
    levelPill: {
      paddingHorizontal: Spacing.two + 2,
      paddingVertical: Spacing.half + 1,
      borderRadius: Radius.pill,
    },
    white: {
      color: '#ffffff',
    },
    storyEmoji: {
      fontSize: 44,
      lineHeight: 54,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },
    toolbarHint: {
      flex: 1,
    },
    toggleAll: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.one + 2,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(34, 211, 255, 0.12)',
    },
    toggleAllText: {
      color: colors.cyan,
    },
    paragraphs: {
      gap: Spacing.three - Spacing.one,
    },
    paragraph: {
      padding: Spacing.three,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      gap: Spacing.three - Spacing.one,
    },
    paragraphOpen: {
      borderColor: 'rgba(34, 211, 255, 0.45)',
    },
    pressed: {
      opacity: 0.8,
    },
    english: {
      fontFamily: Fonts.medium,
      fontSize: 17,
      lineHeight: 28,
    },
    translation: {
      paddingTop: Spacing.three - Spacing.one,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    turkish: {
      color: colors.cyan,
      lineHeight: 21,
    },
    vocabulary: {
      padding: Spacing.three,
      gap: Spacing.three - Spacing.one,
    },
    vocabularyLabel: {
      color: colors.amber,
    },
    words: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    word: {
      flexGrow: 1,
      flexBasis: '45%',
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three - Spacing.one,
      borderRadius: Radius.sm,
      backgroundColor: colors.subtle,
    },
  });
