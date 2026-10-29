import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Screen } from '@/components/ui/screen';
import { SpeakButton } from '@/components/ui/speak-button';
import { StudyModal } from '@/components/word-study/study-modal';
import { enter } from '@/constants/motion';
import { Fonts, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { getLearnedWords, type LearnedWord } from '@/db/progress';
import { useUserQuery } from '@/db/use-user-query';
import { getWordById, type Word } from '@/utils/word-quiz';

type LearnedItem = Word & { learnedAt: string };

const EMPTY: LearnedWord[] = [];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const normalize = (text: string) => text.toLocaleLowerCase('tr-TR');

function LearnedRow({ item, onShowSentences }: { item: LearnedItem; onShowSentences: () => void }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <ThemedText type="smallBold" style={styles.word}>
          {item.word}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {item.turkish}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textFaint" style={styles.date}>
        {formatDate(item.learnedAt)}
      </ThemedText>
      <Pressable
        onPress={onShowSentences}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${item.word} örnek cümleleri`}
        style={styles.sentencesButton}>
        <ThemedText style={styles.sentencesIcon}>💬</ThemedText>
      </Pressable>
      <SpeakButton text={item.word} size={34} />
    </View>
  );
}

/** Kelimenin 5 örnek cümlesi; her cümle ayrı ayrı dinlenebilir. */
function SentencesModal({ item, onClose }: { item: LearnedItem | null; onClose: () => void }) {
  const styles = useThemedStyles(createStyles);
  const sentences = item ? [item.s1, item.s2, item.s3, item.s4, item.s5] : [];
  return (
    <StudyModal visible={item !== null} title="Örnek cümleler" onClose={onClose}>
      {item && (
        <View style={styles.modalBody}>
          <View style={styles.modalHeader}>
            <View style={styles.texts}>
              <ThemedText type="subtitle">{item.word}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.turkish}
              </ThemedText>
            </View>
            <SpeakButton text={item.word} size={40} />
          </View>
          {sentences.map((sentence, index) => (
            <View key={index} style={styles.sentenceRow}>
              <ThemedText type="smallBold" themeColor="textFaint" style={styles.sentenceNumber}>
                {index + 1}
              </ThemedText>
              <ThemedText style={styles.sentenceText}>{sentence}</ThemedText>
              <SpeakButton text={sentence} size={32} accessibilityLabel={`${index + 1}. cümleyi dinle`} />
            </View>
          ))}
        </View>
      )}
    </StudyModal>
  );
}

export default function LearnedWordsScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const learned = useUserQuery(getLearnedWords, EMPTY);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LearnedItem | null>(null);

  const items: LearnedItem[] = learned.flatMap(({ word_id, learned_at }) => {
    const word = getWordById(word_id);
    return word ? [{ ...word, learnedAt: learned_at }] : [];
  });
  const search = normalize(query.trim());
  const visible = search
    ? items.filter((item) => normalize(item.word).includes(search) || normalize(item.turkish).includes(search))
    : items;

  return (
    <Screen showBack>
      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <LearnedRow item={item} onShowSentences={() => setSelected(item)} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View entering={enter()} style={styles.header}>
            <View style={styles.badge}>
              <ThemedText type="label" style={styles.badgeText}>
                📚 {items.length} kelime
              </ThemedText>
            </View>
            <ThemedText type="display">Öğrendiklerim</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Bir çalışma oturumunda 3 sorusunun hepsini doğru bildiğin kelimeler.
            </ThemedText>
            {items.length > 0 && (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Kelime ara (İngilizce ya da Türkçe)"
                placeholderTextColor={colors.textFaint}
                selectionColor={colors.pink}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.search}
              />
            )}
          </Animated.View>
        }
        ListEmptyComponent={
          <GlassCard style={styles.empty}>
            <ThemedText style={styles.emptyEmoji}>{items.length > 0 ? '🔍' : '🌱'}</ThemedText>
            <ThemedText type="smallBold" style={styles.center}>
              {items.length > 0 ? 'Aramana uyan kelime yok.' : 'Henüz öğrenilmiş kelimen yok.'}
            </ThemedText>
            {items.length === 0 && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                Kelime Çalış bölümünde bir oturum tamamla; 3 sorusunu da doğru bildiğin kelimeler burada
                listelenecek.
              </ThemedText>
            )}
          </GlassCard>
        }
      />
      <SentencesModal item={selected} onClose={() => setSelected(null)} />
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
      marginBottom: Spacing.two,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(139, 92, 255, 0.14)',
    },
    badgeText: {
      color: colors.accentText,
    },
    search: {
      marginTop: Spacing.two,
      minHeight: 48,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElement,
      color: colors.text,
      fontFamily: Fonts.medium,
      fontSize: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      paddingVertical: Spacing.three - Spacing.one,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    texts: {
      flex: 1,
    },
    word: {
      fontSize: 16,
    },
    date: {
      fontSize: 12,
    },
    sentencesButton: {
      width: 34,
      height: 34,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(139, 92, 255, 0.14)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sentencesIcon: {
      fontSize: 15,
      lineHeight: 20,
    },
    modalBody: {
      gap: Spacing.two,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      marginBottom: Spacing.two,
    },
    sentenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sentenceNumber: {
      width: 16,
      textAlign: 'center',
    },
    sentenceText: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
    },
    empty: {
      alignItems: 'center',
      gap: Spacing.two,
      paddingVertical: Spacing.five,
    },
    emptyEmoji: {
      fontSize: 36,
      lineHeight: 44,
    },
    center: {
      textAlign: 'center',
    },
  });
