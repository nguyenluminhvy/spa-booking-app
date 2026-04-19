import {Alert, TouchableOpacity, View} from "react-native";
import React from "react";
import {useNotifications} from "@/lib/context/NotificationContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export function BrushNotificationButton() {
  const { markAllAsRead }= useNotifications()

  const onPress = () => {
    Alert.alert(`Notice`, "Mark all unread messages as read?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: async () => {
          await markAllAsRead()
        } },
    ]);
  };

  return (
    <View >
      <TouchableOpacity style={{}} onPress={onPress}>
        <MaterialCommunityIcons
          name={"brush-variant"}
          size={22}
        />
      </TouchableOpacity>
    </View>
  );
}
