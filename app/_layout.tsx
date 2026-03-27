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

export default function RootLayout() {
  const { push } = useRouter()

  useEffect(() => {
    ;(async () => {
      const accessToken = await getStringData('accessToken');

      if (accessToken) {
        push('/(admin)/(tabs)/services')
      }
    })()
  }, []);

  return (
    <PaperProvider>
        <StatusBar style="dark"></StatusBar>
          <KeyboardProvider>
            <Navigation />
            <LoadingIndicator />
          </KeyboardProvider>
    </PaperProvider>
  );
}
