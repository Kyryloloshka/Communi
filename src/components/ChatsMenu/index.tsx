'use client';
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import CardChatsMenu from './CardChatsMenu';
import { useStateSelector } from '@/state';

const ChatsMenu = () => {
  const [loading, setLoading] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData[]>([]);
  const [groups, setGroups] = useState<DocumentData[]>([]);
  const userData = useStateSelector((state) => state.auth.myUser);

  useEffect(() => {
    setLoading(true);
    if (userData) {
      const userChatQuery = query(
        collection(db, 'chats'),
        where('users', 'array-contains', userData.id),
        orderBy('lastMessage.time', 'desc'),
      );

      const unsubChats = onSnapshot(userChatQuery, (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: 'chat',
        }));
        setUserChats(chats);
        setLoading(false);
      });

      const groupQuery = query(
        collection(db, 'groups'),
        where('members', 'array-contains', userData.id),
        orderBy('lastMessage.time', 'desc'),
      );
      const unsubGroups = onSnapshot(groupQuery, (snapshot) => {
        const groups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: 'group',
        }));
        setGroups(groups);
        setLoading(false);
      });

      return () => {
        unsubChats();
        unsubGroups();
      };
    }
  }, [userData]);

  const combinedChats = [...userChats, ...groups].sort(
    (a, b) => b.lastMessage.time - a.lastMessage.time,
  );

  if (!userData) return null;
  return (
    <div className="">
      {loading || !userData ? (
        <div className="flex justify-center content-center">
          <span className="loader"></span>
        </div>
      ) : (
        combinedChats.map((chat: DocumentData) => {
          return (
            <CardChatsMenu key={chat.id} chat={chat}/>
          );
        })
      )}
    </div>
  );
};

export default ChatsMenu;
