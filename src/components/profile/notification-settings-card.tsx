import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, AppState, Linking, Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useUser } from '@/db/user-context';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import {
  ensureNotificationPermission,
  formatTime,
  loadNotificationSettings,
  rescheduleNotifications,
  REVIEW_DAYS,
  saveNotificationSettings,
  type NotificationSettings,
  type ScheduleSummary,
} from '@/notifications/scheduler';

function describeNext(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === today.toDateString()) return `bugün ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `yarın ${time}`;
  return `${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })} ${time}`;
}

/** Profildeki bildirim ayarları: günlük hatırlatma, aralıklı tekrar ve saat. */
export function NotificationSettingsCard() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const db = useSQLiteContext();
  const { user } = useUser();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [summary, setSummary] = useState<ScheduleSummary>({ count: 0, next: null, permissionGranted: true });
  const [showIosPicker, setShowIosPicker] = useState(false);

  useEffect(() => {
    let active = true;
    loadNotificationSettings(db).then((loaded) => {
      if (active) setSettings(loaded);
    });
    const refresh = () =>
      rescheduleNotifications(db, user.id)
        .then((next) => {
          if (active) setSummary(next);
        })
        .catch((error) => console.warn('Bildirimler planlanamadı', error));
    refresh();
    // Kullanıcı izni telefon ayarlarından verip geri döndüğünde durum güncellenir.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, [db, user.id]);

  if (!settings) return null;

  async function apply(next: NotificationSettings) {
    // Bir bildirim türü açılıyorsa önce izin istenir.
    const turningOn =
      (next.dailyEnabled && !settings?.dailyEnabled) || (next.reviewEnabled && !settings?.reviewEnabled);
    if (turningOn && !(await ensureNotificationPermission())) {
      Alert.alert('Bildirim izni gerekli', 'Hatırlatmaları alabilmek için uygulama ayarlarından izin vermelisin.', [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Ayarları aç', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    setSettings(next);
    await saveNotificationSettings(db, next);
    setSummary(await rescheduleNotifications(db, user.id));
  }

  function handleTimeChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'ios') setShowIosPicker(false);
    if (event.type !== 'set' || !date || !settings) return;
    apply({ ...settings, time: { hour: date.getHours(), minute: date.getMinutes() } });
  }

  function openTimePicker() {
    if (!settings) return;
    const value = new Date();
    value.setHours(settings.time.hour, settings.time.minute, 0, 0);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value, mode: 'time', is24Hour: true, onChange: handleTimeChange });
    } else {
      setShowIosPicker(true);
    }
  }

  const anyEnabled = settings.dailyEnabled || settings.reviewEnabled;
  const switchColors = { false: colors.backgroundSelected, true: colors.violet };
  const pickerValue = new Date();
  pickerValue.setHours(settings.time.hour, settings.time.minute, 0, 0);

  return (
    <GlassCard style={styles.card}>
      <ThemedText type="smallBold">🔔 Bildirimler</ThemedText>

      <View style={styles.row}>
        <View style={styles.texts}>
          <ThemedText type="smallBold">Günlük hatırlatma</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            O gün çalışmadıysan seçtiğin saatte hatırlatır.
          </ThemedText>
        </View>
        <Switch
          value={settings.dailyEnabled}
          onValueChange={(value) => apply({ ...settings, dailyEnabled: value })}
          trackColor={switchColors}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.row}>
        <View style={styles.texts}>
          <ThemedText type="smallBold">Aralıklı tekrar</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Öğrendiğin kelimeleri {REVIEW_DAYS.join(', ')} gün sonra hatırlatır.
          </ThemedText>
        </View>
        <Switch
          value={settings.reviewEnabled}
          onValueChange={(value) => apply({ ...settings, reviewEnabled: value })}
          trackColor={switchColors}
          thumbColor="#ffffff"
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hatırlatma saati ${formatTime(settings.time)}, değiştirmek için dokun`}
        disabled={!anyEnabled}
        onPress={openTimePicker}
        style={({ pressed }) => [styles.timeRow, !anyEnabled && styles.disabled, pressed && styles.pressed]}>
        <ThemedText type="smallBold">⏰ Hatırlatma saati</ThemedText>
        <View style={styles.timePill}>
          <ThemedText type="smallBold" style={styles.timeText}>
            {formatTime(settings.time)}
          </ThemedText>
        </View>
      </Pressable>

      {showIosPicker && (
        <DateTimePicker value={pickerValue} mode="time" display="spinner" onChange={handleTimeChange} />
      )}

      <ThemedText type="small" themeColor="textSecondary">
        {!anyEnabled
          ? 'Bildirimler kapalı.'
          : !summary.permissionGranted
            ? '⚠️ Bildirim izni verilmediği için hatırlatma gelmiyor.'
            : summary.next
            ? `Sıradaki bildirim: ${describeNext(summary.next)}`
            : 'Planlanmış bildirim yok.'}
      </ThemedText>

      {anyEnabled && !summary.permissionGranted && (
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openSettings()}
          style={({ pressed }) => [styles.permissionButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.permissionText}>
            Bildirim iznini ayarlardan aç ›
          </ThemedText>
        </Pressable>
      )}
    </GlassCard>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      padding: Spacing.three,
      gap: Spacing.three,
      borderRadius: Radius.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
    },
    texts: {
      flex: 1,
      gap: Spacing.half,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Spacing.three,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    timePill: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.one + 2,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundSelected,
    },
    timeText: {
      color: colors.violet,
      fontSize: 16,
    },
    permissionButton: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radius.pill,
      backgroundColor: 'rgba(255, 181, 71, 0.14)',
    },
    permissionText: {
      color: colors.amber,
    },
    disabled: {
      opacity: 0.45,
    },
    pressed: {
      opacity: 0.7,
    },
  });
