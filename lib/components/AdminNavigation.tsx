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

      {/* Screens ngoài tab */}
      <Stack.Screen name="appointment-detail" />
      <Stack.Screen name="assign-staff" />
      <Stack.Screen name="create-service" />
    </Stack>
  );
}
