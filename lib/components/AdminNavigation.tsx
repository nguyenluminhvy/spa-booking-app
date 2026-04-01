import { Stack } from 'expo-router';

export default function AdminNavigation() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerShadowVisible: false,
      gestureEnabled: false,
    }}>
      {/* Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="assign-staff" />
      <Stack.Screen name="create-edit-service" />
      <Stack.Screen name="create-edit-staff" />
    </Stack>
  );
}
