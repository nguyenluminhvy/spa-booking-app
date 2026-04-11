import {Stack} from "expo-router";

export default function Navigation() {
  return(
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerShadowVisible: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: '',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerTitle: '',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: '',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          headerTitle: '',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="(admin)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(user)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(staff)"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="task/[taskId]" />
    </Stack>
  )
}
