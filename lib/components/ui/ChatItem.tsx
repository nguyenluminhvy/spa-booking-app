import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Avatar} from "react-native-paper";
import React from "react";
import {formatMessageTime} from "@/lib/components/ui/Message";

export default function ChatItem({
                                   convo,
                                   staffId,
                                   onPress,
                                   onClaim,
                                 }) {
  const isMine = convo.assignedTo === staffId;
  const isUnread = convo.lastSenderId !== staffId;

  const time = formatMessageTime(convo.updatedAt)

  const initials = convo?.userName
    ?.split(" ")
    ?.map((w: string) => w[0])
    ?.slice(0, 2)
    ?.join("")
    ?.toUpperCase();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.5}>
      <Avatar.Text
        size={44}
        label={initials}
        style={styles.avatar}
      />
      <View style={{
        flex: 1,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
      }}>
        <View style={styles.row}>
          <Text style={styles.user}>{convo?.userName}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <View>
          <Text
            style={[
              styles.message,
              isUnread && styles.unread
            ]}
            numberOfLines={1}
          >
            {convo.lastMessage || '...'}
          </Text>

          {!convo.assignedTo && (
            <TouchableOpacity onPress={() => {
              console.log('run 11')
              onClaim?.()
            }}>
              <Text style={styles.claim}>Nhận chat</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  user: { fontWeight: '600' },
  time: { color: '#999' },
  message: { marginTop: 4, color: '#666' },
  unread: { fontWeight: 'bold', color: '#000' },
  claim: { color: '#007AFF', marginTop: 6 },
  mine: { color: 'green', marginTop: 6 },
  avatar: {
    backgroundColor: "rgb(0,54,233)",
  },
});
