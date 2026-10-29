import type { SQLiteDatabase } from 'expo-sqlite';

export type User = {
  id: number;
  name: string;
  created_at: string;
};

const ACTIVE_USER_KEY = 'active_user_id';

export function listUsers(db: SQLiteDatabase): Promise<User[]> {
  return db.getAllAsync<User>('SELECT id, name, created_at FROM users ORDER BY created_at');
}

export async function createUser(db: SQLiteDatabase, name: string): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO users (name, created_at) VALUES (?, ?)',
    name.trim(),
    new Date().toISOString(),
  );
  return result.lastInsertRowId;
}

/** Kullanıcıyı ve (ON DELETE CASCADE ile) bütün ilerleme kayıtlarını siler. */
export async function deleteUser(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM users WHERE id = ?', id);
}

export async function getActiveUserId(db: SQLiteDatabase): Promise<number | null> {
  const row = await db.getFirstAsync<{ value: string | null }>(
    'SELECT value FROM settings WHERE key = ?',
    ACTIVE_USER_KEY,
  );
  return row?.value ? Number(row.value) : null;
}

export async function setActiveUserId(db: SQLiteDatabase, id: number | null): Promise<void> {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    ACTIVE_USER_KEY,
    id === null ? null : String(id),
  );
}
