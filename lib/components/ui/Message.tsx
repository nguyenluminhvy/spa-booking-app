import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import {useAuth} from "@/lib/context/AuthContext";

type MessageProps = {
  content: string;
  role: string;
  createdAt: any;
  senderId: any;
  currentUserId: any;
};

export const formatMessageTime = (createdAt: any) => {
  if (!createdAt?.seconds) return '';

  const time = moment(createdAt.seconds * 1000);

  const now = moment();

  if (time.isSame(now, 'day')) {
    return time.format('HH:mm');
  }

  if (time.isSame(now.clone().subtract(1, 'day'), 'day')) {
    return `Yesterday ${time.format('HH:mm')}`;
  }

  return time.format('DD-MM HH:mm');
};

export default function Message({ content, role, createdAt, senderId, currentUserId }: MessageProps) {
  const { isAdminRole, isStaffRole } = useAuth()

  const isSystemMessage = (isAdminRole || isStaffRole ) && (senderId === 0 || senderId === 3);
  const isOwnMessage = senderId === currentUserId;
  const isMine = isOwnMessage || isSystemMessage;

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.right : styles.left,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.userBubble : styles.staffBubble,
        ]}
      >
        <Text style={{
          color: isMine ? '#fff' : '#000'
        }}>
          {content}
        </Text>

        <Text style={{
          marginTop: 4,
          fontSize: 10,
          textAlign:'left',
          color: isMine ? '#fff' : '#000'
        }}>
          {formatMessageTime(createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  staffBubble: {
    backgroundColor: '#E5E5EA',
  }
});
