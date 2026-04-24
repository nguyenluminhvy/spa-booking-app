import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef, useState,
} from "react";
import {Alert, Linking, Platform} from "react-native";

import {useRouter} from "expo-router";
import {_saveDeviceToken} from "@/lib/services/api/auth";

import * as Notifications from 'expo-notifications';
import {useAuth} from "@/lib/context/AuthContext";
import {
  _getNotifications,
  _getUnreadCount,
  _markAllNotificationAsRead,
  _markNotificationAsRead
} from "@/lib/services/api/notifications";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }

    const fcmToken = (await Notifications.getDevicePushTokenAsync()).data;

    console.log(`FcmToken: ${fcmToken}`);

    return fcmToken

    // const projectId =
    //   Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    // if (!projectId) {
    //   handleRegistrationError('Project ID not found');
    // }
    // try {
    //   const pushTokenString = (
    //     await Notifications.getExpoPushTokenAsync({
    //       projectId,
    //     })
    //   ).data;
    //   console.log(pushTokenString);
    //   return pushTokenString;
    // } catch (e: unknown) {
    //   handleRegistrationError(`${e}`);
    // }
  // } else {
  //   handleRegistrationError('Must use physical device for push notifications');
  // }
}


interface NotificationContextType {
  notifications: [] | null;
  unreadCount: number;
  hasUnreadMessage: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: any) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearUnread: () => Promise<void>;
  saveDeviceToken: (token: any) => Promise<void>;
}

const NotificationsContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const {user, setLoading} = useAuth()

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const lastSeenRef = useRef(0);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          saveDeviceToken(token).then()
        }
      })
      .catch((error: any) => {});

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('from foreground, background', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const conversationId = response?.notification?.request?.content?.data?.conversationId

      if (conversationId) {
        router.push({
          pathname: "/chat/[conversationId]",
          params: {
            conversationId: conversationId,
          },
        });
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
    }
  }, [user]);

  useEffect(() => {
    AsyncStorage.getItem('LAST_CHAT_SEEN').then((lastSeen) => {
      lastSeenRef.current = lastSeen ? Number(lastSeen) : 0;
    });

    const unsub = onSnapshot(
      collection(db, 'conversations'),
      (snapshot) => {
        let hasNew = false;
        snapshot.docs.forEach((doc) => {
          const data: any = doc.data();
          const updated = data.updatedAt?.seconds * 1000 || 0;
          if (
            updated > lastSeenRef.current &&
            data.lastSenderId !== user?.id
          ) {
            hasNew = true;
          }
        });

        setHasUnreadMessage(hasNew);
      },
    );
    return () => unsub();
  }, [user?.id]);

  const clearUnread = async () => {
    const now = Date.now();
    await AsyncStorage.setItem('LAST_CHAT_SEEN', String(now));
    lastSeenRef.current = now;

    setHasUnreadMessage(false);
  };

  const fetchNotifications = async (query?: any) => {
    setLoading(true)
    const response = await _getNotifications(query)

    if (response) {
      setNotifications(response);
    }
    setLoading(false)
  }

  const fetchUnreadCount = async (query?: any) => {
    const response = await _getUnreadCount(query)

    if (response?.count) {
      setUnreadCount(response?.count);
    }
  }

  const markAllAsRead = async () => {
    await _markAllNotificationAsRead()
    await fetchNotifications()
    setUnreadCount(0)
  }

  const markAsRead = async (id: any) => {
    await _markNotificationAsRead(id)
    setUnreadCount(prevState => (prevState -= 1))
  }

  const saveDeviceToken = async (token: string) => {
    await _saveDeviceToken({token})
  };

  const value = {
    notifications,
    unreadCount,
    saveDeviceToken,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    markAsRead,
    hasUnreadMessage,
    clearUnread,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be called from within a NotificationProvider!"
    );
  }

  return context;
};

export { useNotifications, NotificationsProvider };
