import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { IMessage } from '@/types/index';

const useChatMessages = (chatRoomId: string | null) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!chatRoomId) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatRoomId', '==', chatRoomId),
      orderBy('time', 'asc'),
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IMessage[];

      messagesData.forEach((message, index) => {
        message.previousMessage = index === 0 ? null : messagesData[index - 1];
        message.nextMessage =
          index === messagesData.length - 1 ? null : messagesData[index + 1];
      });

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  return messages;
};

export default useChatMessages;
