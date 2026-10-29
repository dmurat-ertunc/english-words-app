import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { NotificationSettingsCard } from '@/components/profile/notification-settings-card';
import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ScalePressable } from '@/components/ui/scale-pressable';
import { Screen } from '@/components/ui/screen';
import { enter } from '@/constants/motion';
import { Fonts, MaxContentWidth, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { getUserStats, type UserStats } from '@/db/progress';
import { useUserQuery } from '@/db/use-user-query';
import { useUser } from '@/db/user-context';

/** app.json içindeki sürüm; `npm run apk:new` her derlemede bunu artırır. */
const APP_VERSION = Constants.expoConfig?.version;

const EMPTY_STATS: UserStats = { learnedWords: 0, streak: 0, storiesRead: 0, quizzes: 0 };

function initial(name: string) {
  return name.charAt(0).toLocaleUpperCase('tr-TR');
}

export default function ProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const router = useRouter();
  const { user, users, createUser, switchUser, deleteUser } = useUser();
  const stats = useUserQuery(getUserStats, EMPTY_STATS);
  const [newName, setNewName] = useState('');
  const otherUsers = users.filter((item) => item.id !== user.id);

  async function handleSwitch(id: number) {
    await switchUser(id);
    router.back();
  }

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setNewName('');
    await createUser(name);
    router.back();
  }

  function handleDelete() {
    Alert.alert(
      'Profili sil',
      `${user.name} profili ve bütün ilerlemesi kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteUser(user.id) },
      ],
    );
  }

  const statItems = [
    { emoji: '📚', value: stats.learnedWords, label: 'Öğrenilen kelime' },
    { emoji: '🔥', value: stats.streak, label: 'Günlük seri' },
    { emoji: '📖', value: stats.storiesRead, label: 'Okunan hikaye' },
    { emoji: '🎯', value: stats.quizzes, label: 'Tamamlanan test' },
  ];

  return (
    <Screen
      showBack
      headerRight={
        APP_VERSION ? (
          <View style={styles.versionPill}>
            <ThemedText type="label" themeColor="textSecondary">
              v{APP_VERSION}
            </ThemedText>
          </View>
        ) : null
      }>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animated.View entering={enter()} style={styles.header}>
          <View style={styles.bigAvatar}>
            <ThemedText type="title" style={styles.avatarText}>
              {initial(user.name)}
            </ThemedText>
          </View>
          <ThemedText type="title">{user.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {new Date(user.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}{' '}
            tarihinden beri öğreniyor
          </ThemedText>
        </Animated.View>

        <Animated.View entering={enter(1)} style={styles.statsGrid}>
          {statItems.map((item) => (
            <GlassCard key={item.label} style={styles.statCard}>
              <ThemedText style={styles.statEmoji}>{item.emoji}</ThemedText>
              <ThemedText type="subtitle">{item.value}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.label}
              </ThemedText>
            </GlassCard>
          ))}
        </Animated.View>

        <Animated.View entering={enter(2)}>
          <GradientButton
            title="📚  Öğrendiğim kelimeler"
            gradient="words"
            onPress={() => router.push('/learned-words')}
          />
        </Animated.View>

        <Animated.View entering={enter(2)}>
          <NotificationSettingsCard />
        </Animated.View>

        {otherUsers.length > 0 && (
          <Animated.View entering={enter(2)} style={styles.section}>
            <ThemedText type="label" themeColor="textSecondary">
              Profil değiştir
            </ThemedText>
            {otherUsers.map((item) => (
              <ScalePressable key={item.id} style={styles.profileRow} onPress={() => handleSwitch(item.id)}>
                <View style={styles.smallAvatar}>
                  <ThemedText type="smallBold" style={styles.avatarText}>
                    {initial(item.name)}
                  </ThemedText>
                </View>
                <ThemedText type="smallBold" style={styles.flex}>
                  {item.name}
                </ThemedText>
                <ThemedText type="subtitle" themeColor="textFaint">
                  ›
                </ThemedText>
              </ScalePressable>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={enter(3)} style={styles.section}>
          <ThemedText type="label" themeColor="textSecondary">
            Yeni profil ekle
          </ThemedText>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleCreate}
            placeholder="Ad"
            placeholderTextColor={colors.textFaint}
            selectionColor={colors.pink}
            autoCapitalize="words"
            returnKeyType="done"
            maxLength={30}
            style={styles.input}
          />
          <GradientButton
            title="Profil oluştur"
            gradient="primary"
            disabled={!newName.trim()}
            style={!newName.trim() && styles.disabled}
            onPress={handleCreate}
          />
        </Animated.View>

        <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteButton}>
          <ThemedText type="smallBold" style={styles.deleteText}>
            Bu profili sil
          </ThemedText>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
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
      alignItems: 'center',
      gap: Spacing.one,
    },
    bigAvatar: {
      width: 84,
      height: 84,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(139, 92, 255, 0.25)',
      borderWidth: 1.5,
      borderColor: 'rgba(139, 92, 255, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.two,
      boxShadow: '0 12px 36px rgba(139, 92, 255, 0.35)',
    },
    avatarText: {
      color: colors.accentText,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    statCard: {
      flexGrow: 1,
      flexBasis: '45%',
      padding: Spacing.three,
      gap: Spacing.half,
      borderRadius: Radius.md,
    },
    statEmoji: {
      fontSize: 20,
      lineHeight: 26,
    },
    section: {
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
    smallAvatar: {
      width: 36,
      height: 36,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(139, 92, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      minHeight: 52,
      paddingHorizontal: Spacing.three,
      borderRadius: Radius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElement,
      color: colors.text,
      fontFamily: Fonts.semibold,
      fontSize: 16,
    },
    disabled: {
      opacity: 0.5,
    },
    versionPill: {
      paddingHorizontal: Spacing.two + 2,
      paddingVertical: Spacing.one,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundElement,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    deleteButton: {
      alignSelf: 'center',
      paddingVertical: Spacing.two,
    },
    deleteText: {
      color: colors.danger,
    },
  });
