"use client"

import { DocumentData, addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore'
import UserCard from './UserCard'
import {ChatType} from './UserCard'
import { use, useEffect, useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { app, db } from '@/lib/firebase/firebase'
import { useRouter } from 'next/navigation'


const Users = ({userData, setSelectedChat}: {userData: any, setSelectedChat: Function}) => {
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
  }, [userData])
  const handleCreateChat = async (user: any) => {
    setLoading2(true);
    const chatQuery = query(collection(db, 'chats'), where("users", "==", [user.id, userData.id]));

    try {
      const existingChatSnapshot = await getDocs(chatQuery);
      if (existingChatSnapshot.docs.length > 0) {
        console.log('Chat already exists');
        return;
      }
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      }
      const chatData = {
        users: [user.id, userData.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      }

      const chatRef = await addDoc(collection(db, "chats"), chatData);
      console.log("chat created with id: ", chatRef.id);
    } catch (error) {
      console.log('Error creating chat: ', error);
    }
  }

  const openChat = (chat: any) => {
    const data={
      id: chat.id,
      myData: userData,
      otherData: chat.usersData[chat.users.find((id: any) => id !== userData?.id)],
    }
    setSelectedChat(data)
  }

  return (
    <div className='py-3'>
      {loading 
        ? <div className='flex justify-center content-center'><span className="loader"></span></div> 
        : userChats.map((user: DocumentData) => (
          <div 
            className=""
            key={user.id}
            onClick={() => handleCreateChat(user)}
          >
            {user.id !== auth.currentUser?.uid &&
            <UserCard 
              name={user.name} 
              avatarUrl={user.avatarUrl}
              latestMessageText={user.latestMessageText}
              time={user.time}
              type={ChatType.Chat}
            />}
          </div>
      ))}
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