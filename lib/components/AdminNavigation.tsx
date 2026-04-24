import { Stack } from 'expo-router';

export default function AdminNavigation() {
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

      <Stack.Screen name="assign-staff" />
      <Stack.Screen name="create-edit-service" />
      <Stack.Screen name="create-edit-staff" />
    </Stack>
  );
}
