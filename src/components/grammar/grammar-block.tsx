import { StyleSheet, View } from 'react-native';

import { RichText } from '@/components/grammar/rich-text';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import type { Example, GrammarBlock } from '@/data/grammar-content/types';

const noteStyles = (colors: ThemeColors) => ({
  tip: { emoji: '💡', color: colors.amber, background: 'rgba(255, 181, 71, 0.12)' },
  warning: { emoji: '⚠️', color: colors.danger, background: 'rgba(255, 92, 122, 0.12)' },
  info: { emoji: 'ℹ️', color: colors.cyan, background: 'rgba(34, 211, 255, 0.10)' },
});

function ExampleRow({ example }: { example: Example }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <View style={styles.example}>
      <RichText text={example.en} type="smallBold" highlightColor={colors.pink} />
      {example.tr && (
        <ThemedText type="small" themeColor="textSecondary">
          {example.tr}
        </ThemedText>
      )}
    </View>
  );
}

export function GrammarBlockView({ block }: { block: GrammarBlock }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  switch (block.type) {
    case 'paragraph':
      return <RichText text={block.text} type="small" style={styles.paragraph} />;

    case 'subheading':
      return (
        <View style={styles.subheading}>
          <View style={styles.subheadingBar} />
          <ThemedText type="smallBold" style={styles.subheadingText}>
            {block.text}
          </ThemedText>
        </View>
      );

    case 'examples':
      return (
        <View style={styles.examples}>
          {block.items.map((example) => (
            <ExampleRow key={example.en} example={example} />
          ))}
        </View>
      );

    case 'note': {
      const note = noteStyles(colors)[block.tone];
      return (
        <View style={[styles.note, { backgroundColor: note.background, borderLeftColor: note.color }]}>
          <ThemedText type="small">{note.emoji}</ThemedText>
          <RichText text={block.text} type="small" style={styles.noteText} highlightColor={note.color} />
        </View>
      );
    }

    case 'table':
      return (
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {block.headers.map((header, index) => (
              <ThemedText key={index} type="label" themeColor="textSecondary" style={styles.tableCell}>
                {header}
              </ThemedText>
            ))}
          </View>
          {block.rows.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 1 && styles.tableRowAlt]}>
              {row.map((cell, cellIndex) => (
                <RichText
                  key={cellIndex}
                  text={cell}
                  type="small"
                  style={[styles.tableCell, cellIndex === 0 && styles.tableFirstCell]}
                />
              ))}
            </View>
          ))}
        </View>
      );

    case 'chips':
      return (
        <View style={styles.chipsBlock}>
          {block.title && (
            <ThemedText type="label" themeColor="textSecondary">
              {block.title}
            </ThemedText>
          )}
          <View style={styles.chips}>
            {block.items.map((item) => (
              <View key={item} style={styles.chip}>
                <ThemedText type="small" style={styles.chipText}>
                  {item}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      );

    case 'formula':
      return (
        <View style={styles.formulaBlock}>
          <View style={styles.formula}>
            {block.steps.map((step, index) => (
              <View key={step} style={styles.formulaItem}>
                <View style={[styles.formulaStep, index === block.steps.length - 1 && styles.formulaLast]}>
                  <ThemedText type="small" style={styles.formulaText}>
                    {step}
                  </ThemedText>
                </View>
                {index < block.steps.length - 1 && (
                  <ThemedText type="small" themeColor="textFaint">
                    →
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
          {block.example && <ExampleRow example={block.example} />}
        </View>
      );

    case 'patterns':
      return (
        <View style={styles.patterns}>
          {block.items.map((item) => (
            <View key={item.pattern} style={styles.pattern}>
              <ThemedText type="smallBold" style={styles.patternTitle}>
                {item.pattern}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.meaning}
              </ThemedText>
              <ExampleRow example={item.example} />
            </View>
          ))}
        </View>
      );

    case 'correctWrong':
      return (
        <View style={styles.examples}>
          {block.items.map((item) => (
            <View key={item.text} style={[styles.verdict, item.correct ? styles.verdictCorrect : styles.verdictWrong]}>
              <ThemedText type="smallBold" style={{ color: item.correct ? colors.success : colors.danger }}>
                {item.correct ? '✓' : '✗'}
              </ThemedText>
              <View style={styles.verdictTexts}>
                <RichText
                  text={item.text}
                  type="small"
                  style={!item.correct && styles.strike}
                  highlightColor={item.correct ? colors.success : colors.danger}
                />
                {item.note && <RichText text={item.note} type="small" themeColor="textSecondary" />}
              </View>
            </View>
          ))}
        </View>
      );
  }
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    paragraph: {
      lineHeight: 22,
    },
    subheading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    subheadingBar: {
      width: 4,
      height: 18,
      borderRadius: Radius.pill,
      backgroundColor: colors.pink,
    },
    subheadingText: {
      flex: 1,
      fontSize: 15,
    },
    examples: {
      gap: Spacing.two,
    },
    example: {
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.sm,
      backgroundColor: colors.subtle,
      gap: Spacing.half,
    },
    note: {
      flexDirection: 'row',
      gap: Spacing.two,
      padding: Spacing.three,
      borderRadius: Radius.sm,
      borderLeftWidth: 3,
    },
    noteText: {
      flex: 1,
      lineHeight: 21,
    },
    table: {
      borderRadius: Radius.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      gap: Spacing.two,
    },
    tableHeader: {
      backgroundColor: colors.backgroundSelected,
    },
    tableRowAlt: {
      backgroundColor: colors.subtle,
    },
    tableCell: {
      flex: 1,
    },
    tableFirstCell: {
      fontFamily: Fonts.semibold,
    },
    chipsBlock: {
      gap: Spacing.two,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    chip: {
      paddingHorizontal: Spacing.three - Spacing.one,
      paddingVertical: Spacing.one + 2,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(139, 92, 255, 0.14)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(139, 92, 255, 0.4)',
    },
    chipText: {
      color: colors.accentText,
    },
    formulaBlock: {
      gap: Spacing.three,
    },
    formula: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: Spacing.one,
    },
    formulaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },
    formulaStep: {
      paddingHorizontal: Spacing.two + 2,
      paddingVertical: Spacing.one,
      borderRadius: Radius.sm,
      backgroundColor: 'rgba(34, 211, 255, 0.12)',
    },
    formulaLast: {
      backgroundColor: 'rgba(255, 92, 170, 0.18)',
    },
    formulaText: {
      fontFamily: Fonts.semibold,
    },
    patterns: {
      gap: Spacing.three,
    },
    pattern: {
      gap: Spacing.one,
      padding: Spacing.three,
      borderRadius: Radius.md,
      backgroundColor: colors.subtle,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    patternTitle: {
      color: colors.amber,
    },
    verdict: {
      flexDirection: 'row',
      gap: Spacing.two,
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.sm,
    },
    verdictCorrect: {
      backgroundColor: 'rgba(46, 230, 166, 0.08)',
    },
    verdictWrong: {
      backgroundColor: 'rgba(255, 92, 122, 0.08)',
    },
    verdictTexts: {
      flex: 1,
      gap: Spacing.half,
    },
    strike: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
  });
