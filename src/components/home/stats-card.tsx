import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import type { UserStats } from '@/db/progress';

type Stat = {
  emoji: string;
  value: number;
  label: string;
  color: string;
  onPress?: () => void;
};

type StatsCardProps = {
  stats: UserStats;
  /** Öğrenilen kelimeler bölümüne dokunulunca çağrılır. */
  onPressLearned?: () => void;
};

/** Ana sayfadaki ilerleme özeti: öğrenilen kelimeler, çalışma serisi, okunan hikayeler. */
export function StatsCard({ stats, onPressLearned }: StatsCardProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const items: Stat[] = [
    {
      emoji: '📚',
      value: stats.learnedWords,
      label: 'kelime öğrendin ›',
      color: colors.violet,
      onPress: onPressLearned,
    },
    { emoji: '🔥', value: stats.streak, label: 'günlük seri', color: colors.amber },
    { emoji: '📖', value: stats.storiesRead, label: 'hikaye okudun', color: colors.cyan },
  ];

  return (
    <GlassCard style={styles.card}>
      {items.map((item, index) => (
        <Pressable
          key={item.label}
          disabled={!item.onPress}
          onPress={item.onPress}
          accessibilityRole={item.onPress ? 'button' : undefined}
          style={({ pressed }) => [styles.item, index > 0 && styles.divider, pressed && styles.pressed]}>
          <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
          <ThemedText type="subtitle" style={{ color: item.color }}>
            {item.value}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
            {item.label}
          </ThemedText>
        </Pressable>
      ))}
    </GlassCard>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      paddingVertical: Spacing.three,
      paddingHorizontal: Spacing.two,
      borderRadius: Radius.md,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      gap: Spacing.half,
    },
    divider: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: colors.border,
    },
    pressed: {
      opacity: 0.6,
    },
    emoji: {
      fontSize: 18,
      lineHeight: 24,
    },
    label: {
      fontSize: 12,
      lineHeight: 16,
      textAlign: 'center',
    },
  });
