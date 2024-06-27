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
import { User, TypeAttached } from '@/types/index';

const useSendMessage = (
  myUser: User | null,
  otherUser: User | null,
  chatRoomId: string | null,
) => {
  const [message, setMessage] = useState('');

  const sendMessage = async (URL?: string, typeMessage?: TypeAttached) => {
    if ((message.trim() === '' && !URL) || !myUser || !otherUser || !chatRoomId)
      return;

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
      read: {
        [myUser.id]: true,
        [otherUser.id]: false,
      },
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setMessage('');

      const chatRef = doc(db, 'chats', chatRoomId);
      const myUnreadCount = (
        await getDocs(
          query(
            collection(db, 'messages'),
            where('chatRoomId', '==', chatRoomId),
            where(`read.${myUser.id}`, '==', false),
          ),
        )
      ).size;
      const otherUnreadCount = (
        await getDocs(
          query(
            collection(db, 'messages'),
            where('chatRoomId', '==', chatRoomId),
            where(`read.${otherUser.id}`, '==', false),
          ),
        )
      ).size;

      await updateDoc(chatRef, {
        lastMessage: messageData ? messageData : 'Image',
        unreadCount: {
          [myUser.id]: myUnreadCount,
          [otherUser.id]: otherUnreadCount,
        },
      });
    } catch (error) {
      console.log('Error sending message: ', error);
    }
  };

  return { message, setMessage, sendMessage };
};

export default useSendMessage;
