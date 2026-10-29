import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Fonts, Gradients, Radius, Spacing, type GradientName } from '@/constants/theme';

type FeatureCardProps = {
  href: Href;
  emoji: string;
  title: string;
  stat: string;
  gradient: GradientName;
  glowColor: string;
};

/** Ana sayfadaki kompakt, tek satırlık bölüm kartı. */
export function FeatureCard({ href, emoji, title, stat, gradient, glowColor }: FeatureCardProps) {
  const router = useRouter();

  return (
    <ScalePressable
      style={[styles.wrapper, { boxShadow: `0 10px 28px ${glowColor}` }]}
      onPress={() => router.push(href)}>
      <LinearGradient
        colors={Gradients[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        {/* Kartın sağındaki dekoratif halka */}
        <View style={styles.ring} />

        <View style={styles.emojiBubble}>
          <ThemedText style={styles.emoji}>{emoji}</ThemedText>
        </View>
        <View style={styles.texts}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText type="small" style={styles.stat}>
            {stat}
          </ThemedText>
        </View>
        <View style={styles.arrow}>
          <ThemedText type="smallBold" style={styles.arrowText}>
            →
          </ThemedText>
        </View>
      </LinearGradient>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three - Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: -50,
    right: -30,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  emojiBubble: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  texts: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontFamily: Fonts.bold,
    fontSize: 17,
    lineHeight: 22,
  },
  stat: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#07071A',
  },
});
