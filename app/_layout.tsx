// import {AuthProvider} from "@/lib/context/AuthContext";
// import {NotificationsProvider} from "@/lib/hooks/useNotification";
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
            <StatusBar style="dark"></StatusBar>
            <KeyboardProvider>
              <Navigation />
              <LoadingIndicator />
            </KeyboardProvider>
          </SpaProvider>
        </AdminProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
