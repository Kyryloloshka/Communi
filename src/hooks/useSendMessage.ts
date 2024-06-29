import { db } from '@/lib/firebase/firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useState } from 'react';
import { TypeAttached, ChatType, IMessage } from '@/types';

const useSendMessage = (
  myUserId: string | null,
  otherUserId: string | null,
  chatRoomId: string | null,
  chatType: ChatType,
  groupUsers: string[] = [],
) => {
  const [message, setMessage] = useState('');

  const sendMessage = async (URL?: string, typeMessage?: TypeAttached) => {
    if ((message.trim() === '' && !URL) || !myUserId || !chatRoomId) return;

    const messageData = {
      chatRoomId,
      file: typeMessage === 'file' && URL ? URL : null,
      image: typeMessage === 'image' && URL ? URL : null,
      messageType: 'text',
      senderId: myUserId,
      text: message,
      time: serverTimestamp(),
      video: typeMessage === 'video' && URL ? URL : null,
      read: groupUsers.reduce(
        (acc, id) => {
          acc[id] = id === myUserId;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    } as IMessage;

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setMessage('');

      const chatRef = doc(
        db,
        chatType === ChatType.Chat ? 'chats' : 'groups',
        chatRoomId,
      );

      const unreadCounts = await Promise.all(
        (chatType === ChatType.Chat ? [otherUserId] : groupUsers).map(
          async (id) => {
						if (!id) return { userId: null, count: 0 };
            const userUnreadCount = (
              await getDocs(
                query(
                  collection(db, 'messages'),
                  where('chatRoomId', '==', chatRoomId),
                  where(`read.${id}`, '==', false),
                ),
              )
            ).size;
            return { userId: id, count: userUnreadCount };
          },
        ),
      );

      const unreadCount = unreadCounts.reduce(
        (acc, { userId, count }) => {
          if (!userId) return acc;
          acc[userId] = count;
          return acc;
        },
        {} as Record<string, number>,
      );

      await updateDoc(chatRef, {
        lastMessage: messageData ? messageData : 'Image',
        unreadCount,
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return { message, setMessage, sendMessage };
};

export default useSendMessage;
