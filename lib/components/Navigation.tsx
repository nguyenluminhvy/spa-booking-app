import {Stack} from "expo-router";

export default function Navigation() {
  return(
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerShadowVisible: false,
        gestureEnabled: false,
        headerTitleAlign: 'center',
        animation: 'slide_from_right'
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
        name="term"
        options={{
          headerShown: true,
          title: '',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="policy"
        options={{
          headerShown: true,
          title: '',
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
        name="confirm-otp"
        options={{
          headerTitle: '',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="reset-password"
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
        name="notifications"
        options={{
          headerTitle: 'Notifications',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="chat/index"
        options={{
          headerTitle: 'Message',
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="chat/[conversationId]"
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
    </Stack>
  )
}
