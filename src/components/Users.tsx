"use client"

import { DocumentData, addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore'
import UserCard from './UserCard'
import {ChatType} from './UserCard'
import { use, useEffect, useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { app, db } from '@/lib/firebase/firebase'
import { useRouter } from 'next/navigation'


const Users = ({userData, setSelectedChat, selectedChat}: {userData: any, setSelectedChat: Function, selectedChat: any}) => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>([]);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const tastQuery = query(collection(db, 'users'))

    const unsub = onSnapshot(tastQuery, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUserChats(users);
      setLoading(false);
    })
    return unsub;
  },[])

  useEffect(() => {
    try {
      setLoading2(true);
      if (!userData) {
        setLoading2(false);
        return;
      }
      const chatQuery = query(collection(db, "chats"), where("users", "array-contains", userData.id));

      const unsub = onSnapshot(chatQuery, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log(chats);
        setUserChats(chats);
        setLoading2(false);
      })
      return unsub
    } catch (error) {
      console.log(error);
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
      {loading2
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
              latestMessageText={chat.lastMessage}
              time={chat.time}
              type={ChatType.Chat}
            />}
          </div>
      ))}
      
    </div>
  )
}

export default Users