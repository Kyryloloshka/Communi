import UserCard from '@/components/UserCard';
import useFetchUser from '@/hooks/useFetchUser';
import { db } from '@/lib/firebase/firebase';
import { convertChatToSelectedChat } from '@/lib/utils';
import { authActions, useActionCreators, useStateSelector } from '@/state';
import { ChatType, SelectedChatData } from '@/types';
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React from 'react';

const CardChatsMenu = ({ chat }: { chat: DocumentData }) => {
  const otherData = useFetchUser(
    chat.users?.find((user: string) => user !== chat.myUserId),
  );
  const userData = useStateSelector((state) => state.auth.myUser);
  const actions = useActionCreators(authActions);
  const router = useRouter();
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);

  const openChat = (chat: any) => {
    if (!userData) return;
    router.push('/');
    const data = convertChatToSelectedChat(chat, userData.id);
    actions.setSelectedChat(data);
    const chatRef = doc(db, chat.type === 'chat' ? 'chats' : 'groups', chat.id);

    const messagesRef = collection(db, 'messages');

    runTransaction(getFirestore(), async (transaction) => {
      const chatDoc = await transaction.get(chatRef);
      if (!chatDoc.exists()) {
        throw new Error('Chat does not exist!');
      }
      transaction.update(chatRef, { [`unreadCount.${userData.id}`]: 0 });
      const myUnreadMessagesQuery = query(
        messagesRef,
        where('chatRoomId', '==', chat.id),
        where(`read.${userData.id}`, '==', false),
      );
      const myUnreadMessagesSnapshot = await getDocs(myUnreadMessagesQuery);
      myUnreadMessagesSnapshot.forEach((doc) => {
        const messageRef = doc.ref;
        transaction.update(messageRef, { [`read.${userData.id}`]: true });
      });
    }).catch((error) => {
      console.error('Transaction failed: ', error);
    });
  };

  return (
    userData && (
      <div className="" onClick={() => openChat(chat)}>
        {chat.type === ChatType.Chat && otherData ? (
          <UserCard
            isSelected={selectedChat?.id === chat.id}
            name={otherData.name}
            avatarUrl={otherData.avatarUrl}
            unreadCount={chat.unreadCount[userData.id]}
            latestMessage={chat.lastMessage}
            type={ChatType.Chat}
          />
        ) : (
          chat.type === ChatType.Group && (
            <UserCard
              isSelected={selectedChat?.id === chat.id}
              name={chat.name}
              avatarUrl={chat.avatarUrl}
              unreadCount={chat.unreadCount && chat.unreadCount[userData.id]}
              latestMessage={chat.lastMessage}
              type={ChatType.Group}
            />
          )
        )}
      </div>
    )
  );
};

export default CardChatsMenu;
