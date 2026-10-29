import * as Notifications from 'expo-notifications';
import { useRouter, type Href } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { saveInBackground } from '@/db/use-user-query';
import { useUser } from '@/db/user-context';
import { requestPermissionOnce, rescheduleNotifications } from '@/notifications/scheduler';

/**
 * Görünmez yönetici: bildirimleri uygulama açılışında, profil değişiminde ve uygulama arka plana
 * geçtiğinde güncel verilerle yeniden planlar; bildirime dokunulunca ilgili ekranı açar.
 */
export function NotificationManager() {
  const db = useSQLiteContext();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // İlk açılışta izin istenir (bildirimler varsayılan olarak açık), ardından planlanır.
    saveInBackground(requestPermissionOnce(db).then(() => rescheduleNotifications(db, user.id)));
    // Oturumda yapılan çalışma (seri, öğrenilen kelimeler) bildirim içeriğini değiştirir.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') saveInBackground(rescheduleNotifications(db, user.id));
    });
    return () => subscription.remove();
  }, [db, user.id]);

  useEffect(() => {
    function open(response: Notifications.NotificationResponse) {
      const url = response.notification.request.content.data?.url;
      if (typeof url === 'string') router.push(url as Href);
    }

    // Uygulama kapalıyken bir bildirime dokunularak açıldıysa.
    const last = Notifications.getLastNotificationResponse();
    if (last) {
      open(last);
      Notifications.clearLastNotificationResponse();
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(open);
    return () => subscription.remove();
  }, [router]);

  return null;
}
