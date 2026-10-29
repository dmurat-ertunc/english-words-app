import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'english-words.db';

/** Şema her değiştiğinde artırılır ve aşağıya yeni bir migration adımı eklenir. */
const DATABASE_VERSION = 2;

/** `SQLiteProvider` açılırken çalışır; tabloları oluşturur ve gerekirse şemayı günceller. */
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // foreign_keys bağlantı başına ayarlanır, bu yüzden her açılışta çalıştırılır.
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = row?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) return;

  if (currentVersion === 0) {
    await db.execAsync(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );

      CREATE TABLE word_progress (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_id INTEGER NOT NULL,
        seen_count INTEGER NOT NULL DEFAULT 0,
        correct_count INTEGER NOT NULL DEFAULT 0,
        wrong_count INTEGER NOT NULL DEFAULT 0,
        last_result INTEGER,
        last_seen_at TEXT,
        PRIMARY KEY (user_id, word_id)
      );

      CREATE TABLE quiz_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        word_count INTEGER NOT NULL,
        en_tr_correct INTEGER NOT NULL,
        writing_correct INTEGER NOT NULL,
        tr_en_correct INTEGER NOT NULL
      );

      CREATE TABLE grammar_answers (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic_id TEXT NOT NULL,
        exercise_index INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        answered_at TEXT NOT NULL,
        PRIMARY KEY (user_id, topic_id, exercise_index)
      );

      CREATE TABLE story_reads (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        level TEXT NOT NULL,
        story_id TEXT NOT NULL,
        read_at TEXT NOT NULL,
        PRIMARY KEY (user_id, level, story_id)
      );

      CREATE TABLE activity_days (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        day TEXT NOT NULL,
        PRIMARY KEY (user_id, day)
      );
    `);
    currentVersion = 1;
  }

  if (currentVersion === 1) {
    // Bir kelime, aynı oturumdaki 3 sorunun (EN→TR, yazma, TR→EN) hepsi doğruysa öğrenilmiş sayılır.
    await db.execAsync(`
      ALTER TABLE word_progress ADD COLUMN learned INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE word_progress ADD COLUMN learned_at TEXT;
      CREATE INDEX idx_word_progress_learned ON word_progress (user_id, learned);
    `);
    currentVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
