"use client";

import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  runTransaction,
  getFirestore,
  doc,
} from "firebase/firestore";
import UserCard from "@/components/UserCard";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app, db } from "@/lib/firebase/firebase";
import { ChatType } from "@/types";

const Users = ({
  userData,
  setSelectedChat,
  selectedChat,
}: {
  userData: any;
  setSelectedChat: Function;
  selectedChat: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>([]);
  const auth = getAuth(app);

  useEffect(() => {
    setLoading(true);
    if (userData) {
      const userChatQuery = query(
        collection(db, "chats"),
        where("users", "array-contains", userData.id),
        orderBy("lastMessage.time", "desc")
      );
      const unsub = onSnapshot(userChatQuery, (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserChats(chats);
        setLoading(false);
      });

      return unsub;
    }
  }, [userData]);

  const openChat = (chat: any) => {
    const data = {
      id: chat.id,
      myData: userData,
      otherData:
        chat.usersData[chat.users.find((id: any) => id !== userData?.id)],
    };
    setSelectedChat(data);
    const chatRef = doc(db, "chats", chat.id);

    const messagesRef = collection(db, "messages");

    runTransaction(getFirestore(), async (transaction) => {
      const chatDoc = await transaction.get(chatRef);
      if (!chatDoc.exists()) {
        throw new Error("Chat does not exist!");
      }
      
      transaction.update(chatRef, { [`unreadCount.${userData.id}`]: 0 });
      const myUnreadedMessagesQuery = query(
        messagesRef,
        where("chatRoomId", "==", chat.id),
        where(`read.${userData.id}`, "==", false)
      );
      const myUnreadMessagesSnapshot = await getDocs(myUnreadedMessagesQuery);
      myUnreadMessagesSnapshot.forEach((doc) => {
        const messageRef = doc.ref;
        transaction.update(messageRef, { [`read.${userData.id}`]: true });
      });
    }).catch((error) => {
      console.log("Transaction failed: ", error);
    });
  };

  return (
    <div className="">
      {loading || !userData ? (
        <div className="flex justify-center content-center">
          <span className="loader"></span>
        </div>
      ) : (
        userChats.map((chat: DocumentData) => (
          <div className="" key={chat.id} onClick={() => openChat(chat)}>
            {chat.id !== auth.currentUser?.uid &&
              chat.users &&
              chat.users.length > 0 && (
                <UserCard
                  isSelected={selectedChat?.id === chat.id}
                  name={
                    chat.usersData[
                      chat.users.find((id: any) => id !== userData?.id)
                    ]?.name
                  }
                  avatarUrl={
                    chat.usersData[
                      chat.users.find((id: any) => id !== userData?.id)
                    ]?.avatarUrl
                  }
                  unreadCount={chat.unreadCount[userData.id]}
                  latestMessage={chat.lastMessage}
                  type={ChatType.Chat}
                />
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default Users;
