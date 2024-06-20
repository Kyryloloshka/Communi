import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import InputText from '../InputText';
import Message from '../Message';
import { db } from '@/lib/firebase/firebase';
import { IMessage, typeAttached } from '@/types/index';
import Header from './_components/Header';
import { useStateSelector } from '@/state';

const Chat = () => {
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const myUser = selectedChat ? selectedChat.myData : null;
  const otherUser = selectedChat ? selectedChat.otherData : null;
  const chatRoomId = selectedChat ? selectedChat.id : null;
  const chatContainerRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const [userStatus, setUserStatus] = useState<{
    onlineStatus: string;
    lastOnline: Timestamp;
  } | null>(null);

  useEffect(() => {
    try {
      if (!chatRoomId) {
        return;
      }
      const unsub = onSnapshot(
        query(
          collection(db, 'messages'),
          where('chatRoomId', '==', chatRoomId),
          orderBy('time', 'asc'),
        ),
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as IMessage[];
          messagesData.map((message, index) => {
            if (index === 0) {
              message.previousMessage = null;
            } else {
              message.previousMessage = messagesData[index - 1];
            }
          });
          messagesData.map((message, index) => {
            if (index === messagesData.length - 1) {
              message.nextMessage = null;
            } else {
              message.nextMessage = messagesData[index + 1];
            }
          });
          setMessages(messagesData);
        },
      );
      return unsub;
    } catch (error) {
      console.log(error);
    }
  }, [chatRoomId]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChat) return;

    const userId = selectedChat.otherData.id;
    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserStatus({
          onlineStatus: userData.onlineStatus,
          lastOnline: userData.lastOnline,
        });
      } else {
        console.log('No such user document!');
      }
    });

    return unsubscribe;
  }, [selectedChat]);

  const sendMessage = async (URL?: string, typeMessage?: typeAttached) => {
    const messageCollection = collection(db, 'messages');
    if ((message.trim() === '' && !URL) || !myUser || !otherUser) return;

    try {
      const messageData = {
        chatRoomId: chatRoomId,
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

      await addDoc(messageCollection, messageData);
      setMessage('');
      if (!chatRoomId) return;
      const chatRef = doc(db, 'chats', chatRoomId);
      const myUnreadedMessagesQuery = query(
        messageCollection,
        where('chatRoomId', '==', chatRoomId),
        where(`read.${myUser.id}`, '==', false),
      );
      const myUnreadMessagesSnapshot = await getDocs(myUnreadedMessagesQuery);
      const myUnreadCount = myUnreadMessagesSnapshot.size;

      const otherUnreadedMessagesQuery = query(
        messageCollection,
        where('chatRoomId', '==', chatRoomId),
        where(`read.${otherUser.id}`, '==', false),
      );
      const otherUnreadMessagesSnapshot = await getDocs(
        otherUnreadedMessagesQuery,
      );
      const otherUnreadCount = otherUnreadMessagesSnapshot.size;

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

  return (
    <>
      {selectedChat === undefined || selectedChat === null ? (
        <div className="flex-1 h-full flex items-center justify-center text-lg font-light text-light-6/50 select-none">
          Select a chat to start messaging
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <Header userStatus={userStatus} />
          {messages.length === 0 ? (
            <div className="flex-1 h-full flex items-center justify-center text-lg font-light text-light-6/50 select-none">
              Say hello to {otherUser?.name}
            </div>
          ) : (
            <div
              ref={chatContainerRef}
              className="flex-1 flex flex-col gap-0.5 overflow-y-auto p-5 flex-end"
            >
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  myUser={myUser}
                  otherUser={otherUser}
                />
              ))}
            </div>
          )}
          <InputText
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage}
          />
        </div>
      )}
    </>
  );
};

export default Chat;
