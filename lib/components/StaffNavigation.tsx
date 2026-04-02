import { Stack } from 'expo-router';

export default function StaffNavigation() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerShadowVisible: false,
      gestureEnabled: false,
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
