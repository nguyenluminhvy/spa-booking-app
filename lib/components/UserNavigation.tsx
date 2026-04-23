import { Stack } from 'expo-router';

export default function UserNavigation() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerShadowVisible: false,
      gestureEnabled: false,
      headerTitleAlign: 'center',
      animation: 'slide_from_right'
    }}>
      {/* Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="select-time" options={{ title: 'Select Time' }}/>
      <Stack.Screen name="confirm-booking" options={{ title: 'Confirm Booking' }}/>
      <Stack.Screen name="rating" options={{ title: 'Rating Service' }}/>
    </Stack>
  );
}
