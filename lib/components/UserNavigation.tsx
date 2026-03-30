import { Stack } from 'expo-router';

export default function UserNavigation() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerShadowVisible: false,
      gestureEnabled: false,
    }}>
      {/* Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="select-time" options={{ title: 'Select Time' }}/>
      <Stack.Screen name="confirm-booking" options={{ title: 'Confirm Booking' }}/>
    </Stack>
  );
}
