"use client"

import { DocumentData, collection, onSnapshot, query, where } from 'firebase/firestore'
import UserCard from './UserCard'
import {ChatType} from './UserCard'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { app, db } from '@/lib/firebase/firebase'


const Users = ({userData, setSelectedChat, selectedChat}: {userData: any, setSelectedChat: Function, selectedChat: any}) => {
  const [loading, setLoading] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>([]);
  const auth = getAuth(app);

  useEffect(() => {
    setLoading(true);
    if (userData) {
      const userChatQuery = query(collection(db, "chats"), where("users", "array-contains", userData.id));
      const unsub = onSnapshot(userChatQuery, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setUserChats(chats);
        setLoading(false);
      })

      return unsub;
    }
  }, [userData])
    

  const openChat = (chat: any) => {
    const data={
      id: chat.id,
      myData: userData,
      otherData: chat.usersData[chat.users.find((id: any) => id !== userData?.id)],
    }
    setSelectedChat(data)
  }

  return (
    <div className=''>
      {loading
        ? <div className='flex justify-center content-center'><span className="loader"></span></div> 
        : userChats.map((chat: DocumentData) => (
          <div 
            className=""
            key={chat.id}
            onClick={() => openChat(chat)}
          >
            {chat.id !== auth.currentUser?.uid && chat.users && chat.users.length > 0 &&
            <UserCard
              isSelected={selectedChat?.id === chat.id}
              name={chat.usersData[chat.users.find((id: any) => id !== userData?.id)]?.name}
              avatarUrl={chat.usersData[chat.users.find((id: any) => id !== userData?.id)]?.avatarUrl}
              latestMessage={chat.lastMessage}
              type={ChatType.Chat}
            />}
          </div>
      ))}
      
    </div>
  )
}

export default Users