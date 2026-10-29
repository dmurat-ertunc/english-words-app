import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GrammarBlockView } from '@/components/grammar/grammar-block';
import { ThemedText } from '@/components/themed-text';
import { enter } from '@/constants/motion';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import type { GrammarSection } from '@/data/grammar-content/types';

type GrammarSectionCardProps = {
  section: GrammarSection;
  expanded: boolean;
  onToggle: () => void;
};

/** Başlığına dokunulunca açılıp kapanan konu bölümü. */
export function GrammarSectionCard({ section, expanded, onToggle }: GrammarSectionCardProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => {
          Haptics.selectionAsync();
          onToggle();
        }}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}>
        <View style={styles.code}>
          <ThemedText type="label" style={styles.codeText}>
            {section.code}
          </ThemedText>
        </View>
        <View style={styles.titles}>
          <ThemedText type="smallBold" style={styles.title}>
            {section.title}
          </ThemedText>
          {section.turkish && (
            <ThemedText type="small" themeColor="textSecondary">
              {section.turkish}
            </ThemedText>
          )}
        </View>
        <ThemedText
          type="subtitle"
          themeColor="textSecondary"
          style={[styles.chevron, expanded && styles.chevronOpen]}>
          ›
        </ThemedText>
      </Pressable>

      {expanded && (
        <Animated.View entering={enter()} style={styles.body}>
          {section.blocks.map((block, index) => (
            <GrammarBlockView key={index} block={block} />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      borderRadius: Radius.lg,
      borderCurve: 'continuous',
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardExpanded: {
      borderColor: 'rgba(139, 92, 255, 0.45)',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
    },
    pressed: {
      opacity: 0.7,
    },
    code: {
      minWidth: 48,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one + 2,
      borderRadius: Radius.sm,
      backgroundColor: 'rgba(139, 92, 255, 0.18)',
      alignItems: 'center',
    },
    codeText: {
      color: colors.accentText,
      letterSpacing: 0.4,
    },
    titles: {
      flex: 1,
    },
    title: {
      fontSize: 15,
    },
    chevron: {
      transform: [{ rotate: '90deg' }],
    },
    chevronOpen: {
      transform: [{ rotate: '-90deg' }],
    },
    body: {
      gap: Spacing.three,
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.four,
    },
  });
