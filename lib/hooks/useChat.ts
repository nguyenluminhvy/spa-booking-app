import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from "@/lib/config/firebaseConfig";
import {_updateLastMessage} from "@/lib/services/api/chat";

type Message = {
  id?: string;
  content: string;
  senderId: number;
  role: 'USER' | 'STAFF';
  createdAt: any;
};

export const useChat = (
  conversationId: string,
  userId: number,
  role: 'USER' | 'STAFF',
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc'),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(data);
      setLoading(false);
    });

    return () => unsub();
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setSending(true);

      const message: Message = {
        content,
        senderId: userId,
        role,
        createdAt: serverTimestamp(),
      };

      try {
        await Promise.all([
          addDoc(
            collection(
              db,
              'conversations',
              conversationId,
              'messages',
            ),
            message,
          ),
          await _updateLastMessage({
            conversationId,
            content,
            senderId: userId,
          })
        ]);
      } catch (err) {
        console.error('Send message error:', err);
      } finally {
        setSending(false);
      }
    },
    [conversationId, userId, role],
  );

  return {
    messages,
    loading,
    sending,
    sendMessage,
  };
};
