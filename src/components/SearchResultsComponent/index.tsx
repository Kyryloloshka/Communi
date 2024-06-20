import { auth, db } from '@/lib/firebase/firebase';
import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import React, { useState } from 'react';
import UserCard from '../UserCard';
import { ChatData, ChatType } from '@/types';
import { authActions, useActionCreators, useStateSelector } from '@/state';
import { searchActions } from '@/state/slices/search';

const SearchResultsComponent = ({ loading }: { loading: boolean }) => {
  const [loading2, setLoading2] = useState(false);
  const userData = useStateSelector((state) => state.auth.myUser);
  const authAction = useActionCreators(authActions);
  const searchAction = useActionCreators(searchActions);
  const searchResults = useStateSelector((state) => state.search.searchResults);
  const handleCreateChat = async (user: DocumentData) => {
    if (!userData) return;
    setLoading2(true);
    const chatQuery = query(
      collection(db, 'chats'),
      where('users', '==', [user.id, userData.id]),
    );
    try {
      const existingChatSnapshot = await getDocs(chatQuery);
      const existingChatDoc = existingChatSnapshot.docs.find((doc) => {
        const users = doc.data().users;
        return users.includes(user.id) && users.includes(userData.id);
      });
      if (existingChatDoc) {
        return {
          id: existingChatDoc.id,
          ...existingChatDoc.data(),
        } as ChatData;
      }
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };
      const chatData = {
        users: [user.id, userData.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
        unreadCount: {
          [userData.id]: 0,
          [user.id]: 0,
        },
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      return { id: chatRef.id, ...chatData } as ChatData;
    } catch (error) {
      console.error('Error creating chat: ', error);
    }
  };

  const openChat = async (chatData: Promise<ChatData | undefined>) => {
    if (!chatData) return;
    await chatData.then((chat) => {
      if (chat && chat.users) {
        const data = {
          id: chat.id,
          myData: userData,
          otherData:
            chat.usersData[
              chat.users.find((id: string) => id !== userData?.id)
            ],
        };
        authAction.setSelectedChat(data);
        searchAction.setSearchKey('');
      } else {
        console.error('Chat not found');
      }
    });
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center content-center">
          <span className="loader"></span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center dark:text-primary-500">No users found</div>
      ) : (
        searchResults.map((user: DocumentData) => {
          return (
            <div
              className=""
              key={user.id}
              onClick={() => {
                const chatData = handleCreateChat(user);
                if (chatData) {
                  openChat(chatData);
                }
              }}
            >
              {user.id !== auth.currentUser?.uid && (
                <UserCard
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  latestMessage={user.latestMessage}
                  type={ChatType.Chat}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SearchResultsComponent;
