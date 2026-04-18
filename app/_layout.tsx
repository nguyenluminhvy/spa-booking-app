import {StatusBar} from "expo-status-bar";
import {PaperProvider} from "react-native-paper";
import {KeyboardProvider} from "react-native-keyboard-controller";
import Navigation from "@/lib/components/Navigation";
import {LoadingIndicator} from "@/lib/components/ui/LoadingIndicator";
import {useRouter} from "expo-router";
import {useEffect} from "react";
import {getStringData} from "@/lib/utils/AsyncStorage";
import {SpaProvider} from "@/lib/context/SpaContext";
import {AuthProvider} from "@/lib/context/AuthContext";
import {AdminProvider} from "@/lib/context/AdminContext";
import {NotificationsProvider} from "@/lib/context/NotificationContext";
// import { setBackgroundMessageHandler, getMessaging } from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (type === EventType.PRESS) {
//     console.log('User nhấn thông báo khi app đang đóng/nền');
//   }
// });
//
// // Đăng ký Background Message cho Firebase (Hiển thị thông báo khi nhận tin)
// setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
//   console.log('setBackgroundMessageHandler remoteMessage', remoteMessage)
//   if (remoteMessage?.title) {
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });
//
//     await notifee.displayNotification({
//       title: remoteMessage.data?.title || remoteMessage.notification?.title,
//       body: remoteMessage.data?.body || remoteMessage.notification?.body,
//       data: remoteMessage.data,
//       android: {
//         channelId,
//         importance: AndroidImportance.HIGH,
//         pressAction: { id: 'default' },
//       },
//     });
//   }
// });


export default function RootLayout() {
  const { push } = useRouter()

  useEffect(() => {
    ;(async () => {
      const accessToken = await getStringData('accessToken');
      const userRole = await getStringData('user-role');

      if (accessToken) {
        if (userRole === 'ADMIN') {
          push('/(admin)/(tabs)/dashboard');
        }
        if (userRole === 'USER') {
          push('/(user)/(tabs)/home')
        }
        if (userRole === 'STAFF') {
          push('/(staff)/(tabs)/appointments')
        }
      }
    })()
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <AdminProvider>
          <SpaProvider>
            <StatusBar style="dark"/>
            <NotificationsProvider>
              <KeyboardProvider>
                <Navigation />
                <LoadingIndicator />
              </KeyboardProvider>
            </NotificationsProvider>
          </SpaProvider>
        </AdminProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
