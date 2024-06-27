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
import { User, TypeAttached, ChatType } from '@/types/index';

const useSendMessage = (
  myUser: User | null,
  otherUser: User | null,
  chatRoomId: string | null,
  chatType: ChatType,
  groupUsers: User[] = [],
) => {
  const [message, setMessage] = useState('');

  const sendMessage = async (URL?: string, typeMessage?: TypeAttached) => {
    if ((message.trim() === '' && !URL) || !myUser || !chatRoomId) return;

    const messageData = {
      chatRoomId,
      file: typeMessage === 'file' && URL ? URL : null,
      image: typeMessage === 'image' && URL ? URL : null,
      messageType: 'text',
      senderId: myUser.id,
      senderName: myUser.name,
      text: message,
      time: serverTimestamp(),
      video: typeMessage === 'video' && URL ? URL : null,
      read: groupUsers.reduce(
        (acc, user) => {
          acc[user.id] = user.id === myUser.id;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setMessage('');

      const chatRef = doc(
        db,
        chatType === ChatType.Chat ? 'chats' : 'groups',
        chatRoomId,
      );

      const unreadCounts = await Promise.all(
        (chatType === ChatType.Chat ? [otherUser] : groupUsers).map(
          async (user) => {
            const userUnreadCount = (
              await getDocs(
                query(
                  collection(db, 'messages'),
                  where('chatRoomId', '==', chatRoomId),
                  where(`read.${user?.id}`, '==', false),
                ),
              )
            ).size;
            return { userId: user?.id, count: userUnreadCount };
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
