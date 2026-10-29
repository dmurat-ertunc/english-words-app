import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { Onboarding } from '@/components/profile/onboarding';
import {
  createUser as insertUser,
  deleteUser as removeUser,
  getActiveUserId,
  listUsers,
  setActiveUserId,
  type User,
} from '@/db/users';

type UserContextValue = {
  user: User;
  users: User[];
  createUser: (name: string) => Promise<void>;
  switchUser: (id: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

type UserState = {
  loaded: boolean;
  users: User[];
  activeId: number | null;
};

async function loadUserState(db: SQLiteDatabase): Promise<UserState> {
  const [users, activeId] = await Promise.all([listUsers(db), getActiveUserId(db)]);
  return { loaded: true, users, activeId };
}

/** Aktif profili yükler; profil seçilmemişse uygulama yerine karşılama ekranını gösterir. */
export function UserProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [state, setState] = useState<UserState>({ loaded: false, users: [], activeId: null });

  const reload = useCallback(async () => {
    setState(await loadUserState(db));
  }, [db]);

  useEffect(() => {
    let active = true;
    loadUserState(db).then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [db]);

  const createUser = useCallback(
    async (name: string) => {
      const id = await insertUser(db, name);
      await setActiveUserId(db, id);
      await reload();
    },
    [db, reload],
  );

  const switchUser = useCallback(
    async (id: number) => {
      await setActiveUserId(db, id);
      await reload();
    },
    [db, reload],
  );

  const deleteUser = useCallback(
    async (id: number) => {
      await removeUser(db, id);
      if (state.activeId === id) await setActiveUserId(db, null);
      await reload();
    },
    [db, reload, state.activeId],
  );

  if (!state.loaded) return null;

  const user = state.users.find((item) => item.id === state.activeId);
  if (!user) {
    return <Onboarding profiles={state.users} onCreate={createUser} onSelect={switchUser} />;
  }

  return (
    <UserContext.Provider value={{ user, users: state.users, createUser, switchUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const value = useContext(UserContext);
  if (!value) throw new Error('useUser, UserProvider içinde kullanılmalı.');
  return value;
}
