import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

import { getLearnedWords, getUserStats, isActiveToday } from '@/db/progress';
import { getSetting, setSetting } from '@/db/settings';
import { planNotifications, type NotificationTime } from '@/notifications/plan';
import { getWordById } from '@/utils/word-quiz';

export { REVIEW_DAYS, type NotificationTime } from '@/notifications/plan';

/**
 * Yerel bildirimleri kurar: ayarları okur, `planNotifications` ile planı çıkarır ve uygular.
 * İçerik (seri, öğrenilen kelimeler) değiştikçe güncel kalsın diye her seferinde baştan planlar.
 */

const CHANNEL_ID = 'word-reminders';

export type NotificationSettings = {
  dailyEnabled: boolean;
  reviewEnabled: boolean;
  time: NotificationTime;
};

export type ScheduleSummary = {
  count: number;
  next: Date | null;
  /** Bildirim izni verilmiş mi? Verilmemişse ayarlar açık olsa da bildirim gelmez. */
  permissionGranted: boolean;
};

const DEFAULT_TIME: NotificationTime = { hour: 20, minute: 0 };

const KEYS = {
  daily: 'notif_daily',
  review: 'notif_review',
  time: 'notif_time',
  permissionAsked: 'notif_permission_asked',
} as const;

/** Uygulama açıkken gelen bildirimlerin de banner olarak görünmesini sağlar. */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ---------- Ayarlar ----------

export const formatTime = ({ hour, minute }: NotificationTime) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

function parseTime(value: string | null): NotificationTime {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return DEFAULT_TIME;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

export async function loadNotificationSettings(db: SQLiteDatabase): Promise<NotificationSettings> {
  const [daily, review, time] = await Promise.all([
    getSetting(db, KEYS.daily),
    getSetting(db, KEYS.review),
    getSetting(db, KEYS.time),
  ]);
  // Varsayılan olarak ikisi de açıktır; yalnızca kullanıcı kapattıysa ("0") kapalıdır.
  return { dailyEnabled: daily !== '0', reviewEnabled: review !== '0', time: parseTime(time) };
}

export async function saveNotificationSettings(db: SQLiteDatabase, settings: NotificationSettings) {
  await Promise.all([
    setSetting(db, KEYS.daily, settings.dailyEnabled ? '1' : '0'),
    setSetting(db, KEYS.review, settings.reviewEnabled ? '1' : '0'),
    setSetting(db, KEYS.time, formatTime(settings.time)),
  ]);
}

// ---------- İzin ----------

/** Bildirim iznini kontrol eder, verilmemişse ister. İzin verildiyse true döner. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/**
 * Bildirimler varsayılan olarak açık olduğu için izin, uygulamanın ilk açılışında bir kez istenir.
 * Kullanıcı reddederse tekrar sorulmaz; profildeki kart ayarlara yönlendirir.
 */
export async function requestPermissionOnce(db: SQLiteDatabase): Promise<void> {
  if ((await Notifications.getPermissionsAsync()).granted) return;
  if ((await getSetting(db, KEYS.permissionAsked)) === '1') return;
  await setSetting(db, KEYS.permissionAsked, '1');
  const settings = await loadNotificationSettings(db);
  if (settings.dailyEnabled || settings.reviewEnabled) await ensureNotificationPermission();
}

// ---------- Planlama ----------

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Kelime hatırlatmaları',
    importance: AndroidImportance.HIGH,
  });
}

/** Bütün bildirimleri iptal edip ayarlara ve güncel ilerlemeye göre baştan planlar. */
export async function rescheduleNotifications(db: SQLiteDatabase, userId: number): Promise<ScheduleSummary> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const settings = await loadNotificationSettings(db);
  const permissionGranted = (await Notifications.getPermissionsAsync()).granted;
  if (!permissionGranted || (!settings.dailyEnabled && !settings.reviewEnabled)) {
    return { count: 0, next: null, permissionGranted };
  }
  await ensureChannel();

  const [stats, activeToday, learnedRows] = await Promise.all([
    getUserStats(db, userId),
    isActiveToday(db, userId),
    settings.reviewEnabled ? getLearnedWords(db, userId) : Promise.resolve([]),
  ]);

  const learned = learnedRows.flatMap((row) => {
    const word = getWordById(row.word_id);
    return word ? [{ word: word.word, turkish: word.turkish, learnedAt: new Date(row.learned_at) }] : [];
  });

  const plan = planNotifications({ now: new Date(), ...settings, streak: stats.streak, activeToday, learned });
  for (const item of plan) {
    await Notifications.scheduleNotificationAsync({
      content: { title: item.title, body: item.body, data: { url: item.url } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: item.date, channelId: CHANNEL_ID },
    });
  }

  return { count: plan.length, next: plan[0]?.date ?? null, permissionGranted };
}
