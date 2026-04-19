import React, {useEffect} from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotifications } from "@/lib/context/NotificationContext";

const formatCount = (count: number) => (count > 99 ? '99+' : count.toString());

const Badge = ({ count, isMedium }: { count: number; isMedium: boolean }) => {
  if (count <= 0) return null;

  const display = formatCount(count);

  return (
    <View style={[
      isMedium ? styles.badge : styles.badgeSmall,
      display.length > 1 && styles.badgeLarge
    ]}>
      <Text style={styles.badgeText}>{display}</Text>
    </View>
  );
};

export function NotificationButton({ size = 'small', refreshing = false }: { size?: 'small' | 'medium', refreshing?: boolean }) {
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const isMedium = size === 'medium';

  useEffect(() => {
    if (refreshing) {
      setTimeout(() => {
        fetchUnreadCount()
        console.log('runn')
      }, 1000);
    }
  }, [refreshing]);

  return (
    <View style={!isMedium && { marginRight: 16 }}>
      <TouchableOpacity
        style={isMedium ? styles.notifyBtn : { padding: 4 }}
        onPress={() => router.push("/notifications")}
      >
        <Ionicons name="notifications-outline" size={22} />
      </TouchableOpacity>

      <Badge count={unreadCount} isMedium={isMedium} />
    </View>
  );
}

const styles = StyleSheet.create({
  notifyBtn: {
    borderWidth: 0.5,
    borderColor: "#9e9e9e",
    borderRadius: 50,
    padding: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    left: 32,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeSmall: {
    position: 'absolute',
    top: -4,
    left: 12,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeLarge: {
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});
