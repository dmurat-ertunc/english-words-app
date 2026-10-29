import type { SQLiteDatabase } from 'expo-sqlite';

export type WordProgress = {
  word_id: number;
  seen_count: number;
  correct_count: number;
  wrong_count: number;
  /** 1: son cevap doğru, 0: yanlış, null: henüz sorulmadı. */
  last_result: number | null;
  last_seen_at: string | null;
  /** 1: öğrenildi (aynı oturumda 3 sorunun hepsi doğru), 0: öğrenilmedi. */
  learned: number;
  learned_at: string | null;
};

export type LearnedWord = {
  word_id: number;
  learned_at: string;
};

export type SessionWordResult = {
  wordId: number;
  /** Oturumdaki 3 sorunun hepsine doğru cevap verildi mi? */
  learned: boolean;
};

export type GrammarScore = {
  answered: number;
  correct: number;
};

export type UserStats = {
  learnedWords: number;
  streak: number;
  storiesRead: number;
  quizzes: number;
};

const now = () => new Date().toISOString();

/** Cihazın yerel saatine göre "YYYY-MM-DD"; seri hesabı gece yarısında doğru dönsün diye. */
function toLocalDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// ---------- Kelimeler ----------

export function getWordProgress(db: SQLiteDatabase, userId: number): Promise<WordProgress[]> {
  return db.getAllAsync<WordProgress>(
    `SELECT word_id, seen_count, correct_count, wrong_count, last_result, last_seen_at, learned, learned_at
     FROM word_progress WHERE user_id = ?`,
    userId,
  );
}

export async function recordWordsSeen(db: SQLiteDatabase, userId: number, wordIds: number[]) {
  const seenAt = now();
  await db.withTransactionAsync(async () => {
    for (const wordId of wordIds) {
      await db.runAsync(
        `INSERT INTO word_progress (user_id, word_id, seen_count, last_seen_at) VALUES (?, ?, 1, ?)
         ON CONFLICT(user_id, word_id) DO UPDATE SET
           seen_count = seen_count + 1,
           last_seen_at = excluded.last_seen_at`,
        userId,
        wordId,
        seenAt,
      );
    }
  });
}

export async function recordWordAnswer(db: SQLiteDatabase, userId: number, wordId: number, correct: boolean) {
  await db.runAsync(
    `INSERT INTO word_progress (user_id, word_id, correct_count, wrong_count, last_result, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, word_id) DO UPDATE SET
       correct_count = correct_count + excluded.correct_count,
       wrong_count = wrong_count + excluded.wrong_count,
       last_result = excluded.last_result,
       last_seen_at = excluded.last_seen_at`,
    userId,
    wordId,
    correct ? 1 : 0,
    correct ? 0 : 1,
    correct ? 1 : 0,
    now(),
  );
}

/**
 * Oturum sonunda her kelimeyi değerlendirir: 3 sorunun hepsi doğruysa öğrenildi olarak işaretlenir
 * (daha önce öğrenilmişse ilk öğrenilme tarihi korunur); tek bir yanlış bile varsa öğrenilmedi sayılır.
 */
export async function recordSessionResults(db: SQLiteDatabase, userId: number, results: SessionWordResult[]) {
  const learnedAt = now();
  await db.withTransactionAsync(async () => {
    for (const { wordId, learned } of results) {
      if (learned) {
        await db.runAsync(
          `INSERT INTO word_progress (user_id, word_id, learned, learned_at) VALUES (?, ?, 1, ?)
           ON CONFLICT(user_id, word_id) DO UPDATE SET
             learned = 1,
             learned_at = COALESCE(word_progress.learned_at, excluded.learned_at)`,
          userId,
          wordId,
          learnedAt,
        );
      } else {
        await db.runAsync(
          `INSERT INTO word_progress (user_id, word_id, learned, learned_at) VALUES (?, ?, 0, NULL)
           ON CONFLICT(user_id, word_id) DO UPDATE SET learned = 0, learned_at = NULL`,
          userId,
          wordId,
        );
      }
    }
  });
}

/** Öğrenilen kelimeler, en son öğrenilen en başta. */
export function getLearnedWords(db: SQLiteDatabase, userId: number): Promise<LearnedWord[]> {
  return db.getAllAsync<LearnedWord>(
    `SELECT word_id, learned_at FROM word_progress
     WHERE user_id = ? AND learned = 1
     ORDER BY learned_at DESC`,
    userId,
  );
}

export async function saveQuizSession(
  db: SQLiteDatabase,
  userId: number,
  session: { wordCount: number; enTrCorrect: number; writingCorrect: number; trEnCorrect: number },
) {
  await db.runAsync(
    `INSERT INTO quiz_sessions (user_id, created_at, word_count, en_tr_correct, writing_correct, tr_en_correct)
     VALUES (?, ?, ?, ?, ?, ?)`,
    userId,
    now(),
    session.wordCount,
    session.enTrCorrect,
    session.writingCorrect,
    session.trEnCorrect,
  );
}

// ---------- Gramer ----------

export async function saveGrammarAnswer(
  db: SQLiteDatabase,
  userId: number,
  topicId: string,
  exerciseIndex: number,
  correct: boolean,
) {
  await db.runAsync(
    `INSERT INTO grammar_answers (user_id, topic_id, exercise_index, correct, answered_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, topic_id, exercise_index) DO UPDATE SET
       correct = excluded.correct,
       answered_at = excluded.answered_at`,
    userId,
    topicId,
    exerciseIndex,
    correct ? 1 : 0,
    now(),
  );
}

/** Konu id'sine göre en son cevaplardan oluşan skorlar. */
export async function getGrammarScores(db: SQLiteDatabase, userId: number): Promise<Record<string, GrammarScore>> {
  const rows = await db.getAllAsync<{ topic_id: string; answered: number; correct: number }>(
    `SELECT topic_id, COUNT(*) AS answered, SUM(correct) AS correct
     FROM grammar_answers WHERE user_id = ? GROUP BY topic_id`,
    userId,
  );
  return Object.fromEntries(rows.map((row) => [row.topic_id, { answered: row.answered, correct: row.correct }]));
}

// ---------- Hikayeler ----------

export async function markStoryRead(db: SQLiteDatabase, userId: number, level: string, storyId: string) {
  await db.runAsync(
    'INSERT OR IGNORE INTO story_reads (user_id, level, story_id, read_at) VALUES (?, ?, ?, ?)',
    userId,
    level,
    storyId,
    now(),
  );
}

/** "seviye/hikaye-id" biçiminde okunan hikaye anahtarları. */
export async function getReadStoryKeys(db: SQLiteDatabase, userId: number): Promise<Set<string>> {
  const rows = await db.getAllAsync<{ level: string; story_id: string }>(
    'SELECT level, story_id FROM story_reads WHERE user_id = ?',
    userId,
  );
  return new Set(rows.map((row) => `${row.level}/${row.story_id}`));
}

// ---------- Aktivite ve istatistik ----------

export async function markActiveToday(db: SQLiteDatabase, userId: number) {
  await db.runAsync(
    'INSERT OR IGNORE INTO activity_days (user_id, day) VALUES (?, ?)',
    userId,
    toLocalDay(new Date()),
  );
}

export async function isActiveToday(db: SQLiteDatabase, userId: number): Promise<boolean> {
  const row = await db.getFirstAsync<{ found: number }>(
    'SELECT 1 AS found FROM activity_days WHERE user_id = ? AND day = ?',
    userId,
    toLocalDay(new Date()),
  );
  return row !== null;
}

/** Bugünden (bugün çalışılmadıysa dünden) geriye doğru kesintisiz çalışılan gün sayısı. */
function computeStreak(days: Set<string>): number {
  const cursor = new Date();
  if (!days.has(toLocalDay(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(toLocalDay(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function getUserStats(db: SQLiteDatabase, userId: number): Promise<UserStats> {
  const [learned, stories, quizzes, days] = await Promise.all([
    db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM word_progress WHERE user_id = ? AND learned = 1',
      userId,
    ),
    db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM story_reads WHERE user_id = ?', userId),
    db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM quiz_sessions WHERE user_id = ?', userId),
    db.getAllAsync<{ day: string }>('SELECT day FROM activity_days WHERE user_id = ?', userId),
  ]);

  return {
    learnedWords: learned?.count ?? 0,
    storiesRead: stories?.count ?? 0,
    quizzes: quizzes?.count ?? 0,
    streak: computeStreak(new Set(days.map((row) => row.day))),
  };
}
