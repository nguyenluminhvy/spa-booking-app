import {useCallback, useEffect, useState} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/config/firebaseConfig';
import {_claimConversation} from "@/lib/services/api/chat";
import {useAuth} from "@/lib/context/AuthContext";

type Conversation = {
  id: string;
  userId: number;
  assignedTo: number | null;
  status: 'OPEN' | 'IN_PROGRESS';
  lastMessage: string;
  lastSenderId: number;
  updatedAt: any;
};

export const useChatList = ({
                                  userId,
                                  role,
                                }: {
  userId: number;
  role: 'STAFF' | 'ADMIN';
}) => {
  const [waiting, setWaiting] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading} = useAuth()

  useEffect(() => {
    const waitingQuery =
      role === 'ADMIN'
        ? query(
          collection(db, 'conversations'),
          where('status', '==', 'OPEN'),
          orderBy('updatedAt', 'desc')
        )
        : query(
          collection(db, 'conversations'),
          where('status', '==', 'OPEN'),
          where('assignedTo', '==', null),
          orderBy('updatedAt', 'desc')
        );

    const activeQuery =
      role === 'ADMIN'
        ? query(
          collection(db, 'conversations'),
          where('status', '==', 'IN_PROGRESS'),
          orderBy('updatedAt', 'desc')
        )
        : query(
          collection(db, 'conversations'),
          where('assignedTo', '==', userId),
          where('status', '==', 'IN_PROGRESS'),
          orderBy('updatedAt', 'desc')
        );

    const unsubWaiting = onSnapshot(waitingQuery, (snap) => {
      setWaiting(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Conversation[]
      );
      setLoading(false);
    });

    const unsubActive = onSnapshot(activeQuery, (snap) => {
      setActive(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Conversation[]
      );
    });

    return () => {
      unsubWaiting();
      unsubActive();
    };
  }, [userId, role]);

  const claimConversation = useCallback(
    async (conversationId: any) => {

      setGlobalLoading(true);

      const payload = {
        conversationId,
        staffId: userId,
      };

      try {
        return await _claimConversation(payload)
      } catch (err) {
        console.error('Claim conversation error:', err);
      } finally {
        setGlobalLoading(false);
      }
    },
    [userId],
  );

  return {
    waiting,
    active,
    loading,
    claimConversation,
  };
};
