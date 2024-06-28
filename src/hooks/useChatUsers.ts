import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  getDoc,
  DocumentData,
} from 'firebase/firestore';
import { useStateSelector } from '@/state';
import { User } from '@/types';

const useChatUsers = () => {
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const user = useStateSelector((state) => state.auth.myUser);

  useEffect(() => {
    if (!user) return;

    const fetchChatUsers = async () => {
      const chatQuery = query(
        collection(db, 'chats'),
        where('users', 'array-contains', user.id),
      );

      const chatSnapshot = await getDocs(chatQuery);
      const users = new Set<string>();

      chatSnapshot.forEach((doc) => {
        const chatData = doc.data();
        chatData.users.forEach((userId: string) => {
          if (userId !== user.id) {
            users.add(userId);
          }
        });
      });

      const userDocs = await Promise.all(
        Array.from(users).map((userId: string) =>
          getDoc(doc(db, 'users', userId)),
        ),
      );

      const userList = userDocs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as User,
      );
      setChatUsers(userList);
    };

    fetchChatUsers();
  }, [user]);

  return chatUsers;
};

export default useChatUsers;
