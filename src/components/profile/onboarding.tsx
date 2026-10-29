import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { GradientButton } from '@/components/ui/gradient-button';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { Fonts, Gradients, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import type { User } from '@/db/users';

type OnboardingProps = {
  profiles: User[];
  onCreate: (name: string) => Promise<void>;
  onSelect: (id: number) => Promise<void>;
};

/** İlk açılışta (veya aktif profil yoksa) gösterilen karşılama ve profil oluşturma ekranı. */
export function Onboarding({ profiles, onCreate, onSelect }: OnboardingProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const trimmed = name.trim();

  async function handleCreate() {
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      await onCreate(trimmed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Animated.View entering={enter()} style={styles.hero}>
            <LinearGradient
              colors={Gradients.words}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroIcon}>
              <ThemedText style={styles.heroEmoji}>👋</ThemedText>
            </LinearGradient>
            <ThemedText type="display" style={styles.center}>
              Hoş geldin!
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.center}>
              İlerlemeni kaydedebilmemiz için sana nasıl seslenelim?
            </ThemedText>
          </Animated.View>

          <Animated.View entering={enter(1)} style={styles.form}>
            <TextInput
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleCreate}
              placeholder="Adın"
              placeholderTextColor={colors.textFaint}
              selectionColor={colors.pink}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="done"
              maxLength={30}
              style={styles.input}
            />
            <GradientButton
              title="Başlayalım  🚀"
              gradient="words"
              size="lg"
              disabled={!trimmed || saving}
              style={!trimmed && styles.disabled}
              onPress={handleCreate}
            />
          </Animated.View>

          {profiles.length > 0 && (
            <Animated.View entering={enter(2)} style={styles.profiles}>
              <ThemedText type="label" themeColor="textSecondary">
                Ya da kayıtlı bir profille devam et
              </ThemedText>
              {profiles.map((profile) => (
                <ScalePressable key={profile.id} style={styles.profileRow} onPress={() => onSelect(profile.id)}>
                  <View style={styles.avatar}>
                    <ThemedText type="smallBold" style={styles.avatarText}>
                      {profile.name.charAt(0).toLocaleUpperCase('tr-TR')}
                    </ThemedText>
                  </View>
                  <ThemedText type="smallBold" style={styles.flex}>
                    {profile.name}
                  </ThemedText>
                  <ThemedText type="subtitle" themeColor="textFaint">
                    ›
                  </ThemedText>
                </ScalePressable>
              ))}
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      width: '100%',
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      padding: Spacing.four,
      gap: Spacing.five,
    },
    hero: {
      alignItems: 'center',
      gap: Spacing.three,
    },
    heroIcon: {
      width: 88,
      height: 88,
      borderRadius: Radius.lg,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 16px 40px rgba(255, 92, 170, 0.45)',
    },
    heroEmoji: {
      fontSize: 42,
      lineHeight: 50,
    },
    center: {
      textAlign: 'center',
    },
    form: {
      gap: Spacing.three,
    },
    input: {
      minHeight: 58,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElement,
      color: colors.text,
      fontFamily: Fonts.semibold,
      fontSize: 18,
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.5,
    },
    profiles: {
      gap: Spacing.two,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: Radius.md,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(139, 92, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: colors.accentText,
    },
  });
