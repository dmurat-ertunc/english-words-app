import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { Gradients, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { getStoriesByLevel } from '@/data/stories';
import { STORY_LEVELS } from '@/data/story-levels';
import { getReadStoryKeys } from '@/db/progress';
import { useUserQuery } from '@/db/use-user-query';

export default function StoriesScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const readKeys = useUserQuery(getReadStoryKeys, new Set<string>());
  const countRead = (levelId: string) =>
    getStoriesByLevel(levelId).filter((story) => readKeys.has(`${levelId}/${story.id}`)).length;

  return (
    <Screen showBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter()} style={styles.header}>
          <View style={styles.headerBadge}>
            <ThemedText type="label" style={styles.headerBadgeText}>
              📖 {STORY_LEVELS.length} seviye
            </ThemedText>
          </View>
          <ThemedText type="display">Hikayeler</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Seviyeni seç, okudukça kelimeler ve kalıplar kendiliğinden yerine otursun.
          </ThemedText>
        </Animated.View>

        <View style={styles.grid}>
          {STORY_LEVELS.map((level, index) => (
            <Animated.View key={level.id} entering={enter(index + 1)} style={styles.cell}>
              <ScalePressable
                onPress={() => router.push({ pathname: '/stories/[level]', params: { level: level.id } })}>
                <LinearGradient
                  colors={Gradients[level.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tile}>
                  <View style={styles.ring} />
                  <ThemedText type="title" style={styles.white}>
                    {level.label}
                  </ThemedText>
                  <ThemedText type="smallBold" style={styles.white}>
                    {level.name}
                  </ThemedText>
                  <ThemedText type="small" style={styles.description} numberOfLines={2}>
                    {level.description}
                  </ThemedText>
                  {getStoriesByLevel(level.id).length > 0 && (
                    <View style={styles.countPill}>
                      <ThemedText type="label" style={styles.white}>
                        📖 {countRead(level.id)}/{getStoriesByLevel(level.id).length} okundu
                      </ThemedText>
                    </View>
                  )}
                </LinearGradient>
              </ScalePressable>
            </Animated.View>
          ))}
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
      paddingTop: Spacing.two,
      gap: Spacing.four,
    },
    header: {
      gap: Spacing.two,
    },
    headerBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(255, 181, 71, 0.12)',
    },
    headerBadgeText: {
      color: colors.amber,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
    },
    cell: {
      flexGrow: 1,
      flexBasis: '40%',
    },
    tile: {
      minHeight: 132,
      borderRadius: Radius.lg,
      borderCurve: 'continuous',
      padding: Spacing.three,
      gap: Spacing.half,
      justifyContent: 'flex-end',
      overflow: 'hidden',
    },
    ring: {
      position: 'absolute',
      width: 110,
      height: 110,
      top: -40,
      right: -30,
      borderRadius: Radius.pill,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    white: {
      color: '#ffffff',
    },
    countPill: {
      alignSelf: 'flex-start',
      marginTop: Spacing.one,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.half,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(0, 0, 0, 0.22)',
    },
    description: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: 12,
      lineHeight: 16,
    },
  });
