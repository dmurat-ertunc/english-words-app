/**
 * Bildirim planlama kararları (hangi gün, hangi saatte, hangi içerik). Yan etkisi yoktur;
 * bildirimleri asıl kuran `scheduler.ts` bu planı uygular.
 *
 * - Günlük hatırlatma: seçilen saatte; o gün zaten çalışıldıysa gönderilmez.
 * - Aralıklı tekrar: öğrenilen kelimeler öğrenildikten REVIEW_DAYS gün sonra hatırlatılır.
 * - Günde en fazla bir bildirim: tekrar edilecek kelime varsa tekrar, yoksa günlük hatırlatma.
 */

export const REVIEW_DAYS = [1, 3, 7];
/** Günlük hatırlatmaların ve tekrarların kaç gün ileriye planlanacağı. */
const DAILY_HORIZON_DAYS = 7;
const REVIEW_HORIZON_DAYS = 14;
const MAX_WORDS_IN_BODY = 3;

export type NotificationTime = { hour: number; minute: number };

export type PlanInput = {
  now: Date;
  time: NotificationTime;
  dailyEnabled: boolean;
  reviewEnabled: boolean;
  streak: number;
  activeToday: boolean;
  learned: { word: string; turkish: string; learnedAt: Date }[];
};

export type PlannedNotification = {
  date: Date;
  kind: 'daily' | 'review';
  title: string;
  body: string;
  url: '/words' | '/learned-words';
};

/** `now`dan `offset` gün sonraki, seçilen saate denk gelen an. */
function atTime(now: Date, offset: number, time: NotificationTime): Date {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
}

/** İki tarih arasındaki takvim günü farkı (saatten bağımsız). */
function dayDiff(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

const DAILY_MESSAGES = [
  'Bugün 5 kelime çalışmaya ne dersin? 📚',
  'Küçük adımlar büyük fark yaratır. 5 dakikan var mı? ⏱️',
  'Yeni kelimeler seni bekliyor! 🚀',
  'Bir hikaye okumaya ne dersin? 📖',
  'Bugünkü İngilizce dozunu aldın mı? 💪',
];

function dailyBody(offset: number, streak: number, activeToday: boolean): string {
  // Seri yalnızca kesin bilindiği günlerde gösterilir: bugün (henüz çalışılmadıysa, seri dünü kapsar)
  // ve yarın (bugün çalışıldıysa). Diğer günler için genel bir mesaj kullanılır; planlama her
  // uygulamadan çıkışta yenilendiği için bu mesajlar zamanla güncellenir.
  const knownStreak = offset === 0 || (offset === 1 && activeToday) ? streak : 0;
  return knownStreak > 0
    ? `🔥 ${knownStreak} günlük serin var, bugün de devam et!`
    : DAILY_MESSAGES[offset % DAILY_MESSAGES.length];
}

function reviewBody(words: { word: string; turkish: string }[]): string {
  const shown = words.slice(0, MAX_WORDS_IN_BODY).map((item) => `${item.word} = ${item.turkish}`);
  const rest = words.length - shown.length;
  return shown.join('\n') + (rest > 0 ? `\n+${rest} kelime daha` : '');
}

export function planNotifications(input: PlanInput): PlannedNotification[] {
  const { now, time, dailyEnabled, reviewEnabled, streak, activeToday } = input;
  if (!dailyEnabled && !reviewEnabled) return [];

  // Gün farkına göre o gün tekrar edilecek kelimeler.
  const reviewsByOffset = new Map<number, { word: string; turkish: string }[]>();
  if (reviewEnabled) {
    for (const item of input.learned) {
      const learnedOffset = dayDiff(now, item.learnedAt);
      for (const days of REVIEW_DAYS) {
        const offset = learnedOffset + days;
        if (offset < 0 || offset > REVIEW_HORIZON_DAYS) continue;
        reviewsByOffset.set(offset, [...(reviewsByOffset.get(offset) ?? []), item]);
      }
    }
  }

  const plan: PlannedNotification[] = [];
  for (let offset = 0; offset <= REVIEW_HORIZON_DAYS; offset++) {
    const date = atTime(now, offset, time);
    if (date.getTime() <= now.getTime()) continue;

    const reviews = reviewsByOffset.get(offset);
    if (reviews?.length) {
      plan.push({
        date,
        kind: 'review',
        title: `🔁 Tekrar zamanı · ${reviews.length} kelime`,
        body: reviewBody(reviews),
        url: '/learned-words',
      });
    } else if (dailyEnabled && offset < DAILY_HORIZON_DAYS && !(offset === 0 && activeToday)) {
      plan.push({
        date,
        kind: 'daily',
        title: '📚 Çalışma zamanı',
        body: dailyBody(offset, streak, activeToday),
        url: '/words',
      });
    }
  }
  return plan;
}
