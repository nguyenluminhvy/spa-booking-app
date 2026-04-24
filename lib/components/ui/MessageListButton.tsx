import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotifications } from "@/lib/context/NotificationContext";
import {useAuth} from "@/lib/context/AuthContext";
import {_getOrCreateChatConversation} from "@/lib/services/api/chat";

export function MessageListButton({ size = 'small',  }: { size?: 'small' | 'medium' }) {
  const {user} = useAuth()
  const isUserRole = user?.role === 'USER'

  const isMedium = size === 'medium';

  const { hasUnreadMessage } = useNotifications();

  const onOpenChat = async () => {
    const response = await _getOrCreateChatConversation()
    const convoId = response?.id

    if (convoId) {
      router.push({
        pathname: "/chat/[conversationId]",
        params: {
          conversationId: convoId,
        },
      });
    }
  }

  return (
    <View style={!isMedium && { marginRight: 16 }}>
      <TouchableOpacity
        style={isMedium ? styles.notifyBtn : { padding: 4 }}
        onPress={() => {
          if (isUserRole) {
            onOpenChat()
          } else {
            router.push("/chat")
          }
        }}
      >
        <Ionicons name="chatbubbles-outline" size={22} />
      </TouchableOpacity>

      {
        hasUnreadMessage && <View style={styles.chatBubbleBadge}/>
      }
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
  chatBubbleBadge: {
    backgroundColor: '#FF3B30',
    width: 16,
    height: 16,
    borderRadius: 50,
    position: 'absolute',
    top: -4,
    right: 0,
    borderWidth: 2,
    borderColor: 'white'
  },
});
