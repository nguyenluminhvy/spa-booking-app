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
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: any) => Promise<void>;
  markAllAsRead: () => Promise<void>;
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

  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          saveDeviceToken(token).then()
        }
      })
      .catch((error: any) => {});

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
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
