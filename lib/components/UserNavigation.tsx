import {router, Stack} from 'expo-router';
import {Button, IconButton} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";

export default function UserNavigation() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerShadowVisible: false,
      gestureEnabled: false,
      headerTitleAlign: 'center',
      animation: 'slide_from_right'
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="select-time"
        options={{
          title: 'Select Time',
          headerLeft: () => <Button compact buttonColor={'white'} onPress={router.back}>
            <Ionicons name={'chevron-back'} size={20} color={'black'} />
          </Button>
        }}
      />
      <Stack.Screen name="confirm-booking" options={{ title: 'Confirm Booking' }}/>
      <Stack.Screen name="rating" options={{ title: 'Rating Service' }}/>
      <Stack.Screen
        name="booking-success-modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
      />
    </Stack>
  );
}
