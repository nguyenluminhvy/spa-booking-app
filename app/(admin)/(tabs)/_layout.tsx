import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        sceneStyle: {
          backgroundColor: 'white'
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'dashboard') iconName = 'grid-outline';
          else if (route.name === 'appointments') iconName = 'calendar-outline';
          else if (route.name === 'services') iconName = 'cut-outline';
          else if (route.name === 'users') iconName = 'people-outline';
          else if (route.name === 'more') iconName = 'menu-outline';
          else if (route.name === 'profile') iconName = 'person';
          else if (route.name === 'coupons') iconName = 'ticket-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}

    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services'
        }}
      />
      <Tabs.Screen name="users" options={{ title: 'Users', headerTitle: 'Users Management' }} />
      <Tabs.Screen name="coupons" options={{ title: 'Coupons', headerTitle: 'Coupons Management' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
