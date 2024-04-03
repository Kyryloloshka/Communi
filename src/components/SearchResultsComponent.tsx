import { auth, db } from '@/lib/firebase/firebase';
import { DocumentData, addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import UserCard, { ChatType } from './UserCard';

const SearchResultsComponent = ({searchResults, loading, userData}: {searchResults: any[], loading: boolean, userData: any}) => {
  const [loading2, setLoading2] = useState(false);
  const [userChats, setUserChats] = useState<DocumentData>([]);
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
  
  return (
    <div className=''>
      {loading 
        ? <div className='flex justify-center content-center'><span className="loader"></span></div> 
        : searchResults.map((user: DocumentData) => {
          return <div 
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
})}
    </div>
  )
}

export default SearchResultsComponent