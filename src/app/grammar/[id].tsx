import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GrammarLesson } from '@/components/grammar/grammar-lesson';
import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { AccentGradients, Gradients, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { getGrammarContent } from '@/data/grammar-content';
import { GRAMMAR_TOPICS, getGrammarTopic } from '@/data/grammar-topics';

export default function GrammarTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getGrammarTopic(id);

  if (!topic) {
    return (
      <Screen showBack>
        <View style={styles.centered}>
          <ThemedText>Konu bulunamadı.</ThemedText>
        </View>
      </Screen>
    );
  }

  const gradient = Gradients[AccentGradients[GRAMMAR_TOPICS.indexOf(topic) % AccentGradients.length]];
  const content = getGrammarContent(topic.id);

  return (
    <Screen showBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter()}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={[styles.ring, styles.ringLarge]} />
            <View style={[styles.ring, styles.ringSmall]} />
            <ThemedText type="label" style={styles.heroLabel}>
              {topic.number !== null ? `Bölüm ${String(topic.number).padStart(2, '0')}` : 'Giriş'}
            </ThemedText>
            <ThemedText type="title" style={styles.white}>
              {topic.title}
            </ThemedText>
            {topic.turkish && <ThemedText style={styles.heroSubtitle}>{topic.turkish}</ThemedText>}
          </LinearGradient>
        </Animated.View>

        {content ? (
          <GrammarLesson topicId={topic.id} content={content} />
        ) : (
          <Animated.View entering={enter(2)}>
            <GlassCard style={styles.placeholder}>
              <ThemedText style={styles.placeholderEmoji}>🛠️</ThemedText>
              <ThemedText type="subtitle" style={styles.center}>
                Konu anlatımı hazırlanıyor
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                Bu bölümün anlatımı ve örnekleri çok yakında burada olacak.
              </ThemedText>
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: Spacing.five,
    gap: Spacing.two,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  ringLarge: {
    width: 220,
    height: 220,
    top: -100,
    right: -70,
  },
  ringSmall: {
    width: 110,
    height: 110,
    top: -30,
    right: -10,
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
