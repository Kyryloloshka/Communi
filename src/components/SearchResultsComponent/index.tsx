import { auth, db } from "@/lib/firebase/firebase";
import {
  DocumentData,
  FieldValue,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import UserCard from "../UserCard";
import { ChatData, ChatType, SelectedChatData, User } from "@/types";

const SearchResultsComponent = ({
  searchResults,
  setSearchKey,
  loading,
  userData,
  setSelectedChat,
}: {
  searchResults: any[];
  loading: boolean;
  setSearchKey: (tag: string) => void;
  userData: User;
  setSelectedChat: (chat: SelectedChatData) => void;
}) => {
  const [loading2, setLoading2] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>([]);

  const handleCreateChat = async (user: DocumentData) => {
    setLoading2(true);
    const chatQuery = query(
      collection(db, "chats"),
      where("users", "==", [user.id, userData.id])
    );
    try {
      const existingChatSnapshot = await getDocs(chatQuery);
      if (existingChatSnapshot.docs.length > 0) {
        console.log("Chat already exists");
        return;
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

      const chatRef = await addDoc(collection(db, "chats"), chatData);
      return { id: chatRef.id, ...chatData };
    } catch (error) {
      console.error("Error creating chat: ", error);
    }
  };
  useEffect(() => {
    try {
      setLoading2(true);
      if (!userData) {
        setLoading2(false);
        return;
      }
      const chatQuery = query(
        collection(db, "chats"),
        where("users", "array-contains", userData.id)
      );

      const unsub = onSnapshot(chatQuery, (snapshot) => {
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserChats(chats);
        setLoading2(false);
      });
      return unsub;
    } catch (error) {
      console.log(error);
    }
  }, [userData]);

  const openChat = async (chatData: Promise<ChatData | undefined>) => {
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
        setSelectedChat(data);
        setSearchKey("");
      } else {
        console.error("Chat not found");
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
        <div className="text-center text-light-6/50">No users found</div>
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
