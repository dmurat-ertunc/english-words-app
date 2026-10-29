import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { useUser } from '@/db/user-context';

/**
 * Aktif kullanıcıya ait veriyi ekran her odaklandığında yeniden okur; böylece başka bir
 * ekranda yapılan ilerleme geri dönüldüğünde hemen görünür. `query` sabit bir fonksiyon olmalı.
 */
export function useUserQuery<T>(query: (db: SQLiteDatabase, userId: number) => Promise<T>, initial: T): T {
  const db = useSQLiteContext();
  const { user } = useUser();
  const [data, setData] = useState<T>(initial);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      query(db, user.id)
        .then((result) => {
          if (active) setData(result);
        })
        .catch((error) => console.warn('Veri okunamadı', error));
      return () => {
        active = false;
      };
    }, [db, user.id, query]),
  );

  return data;
}

/** Arka planda yapılan kayıt işlemleri için: hata uygulamayı durdurmaz, sadece loglanır. */
export function saveInBackground(promise: Promise<unknown>) {
  promise.catch((error) => console.warn('Kayıt yapılamadı', error));
}
