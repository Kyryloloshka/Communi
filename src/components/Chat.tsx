import { DocumentData, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import InputText from './InputText'
import Message from './Message'
import { db } from '@/lib/firebase/firebase';

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  text: string;
  time: string;
  image?: string;
}

const Chat = ({user, selectedChat}: {user: DocumentData | null | undefined, selectedChat: any}) => {
  const myUser = selectedChat?.myData
  const otherUser = selectedChat?.otherData
  const chatRoomId = selectedChat?.id

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (!chatRoomId) return;
    const unsub = onSnapshot(query(collection(db, 'messages'), where("chatRoomId", "==", chatRoomId), orderBy("time", "asc")), (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log(messagesData);
      
      setMessages(messagesData);
    })
    return unsub;
  }, [chatRoomId])

  

  const sendMessage = async (e: InputEvent) => {
    const messageCollection = collection(db, 'messages');
    if (message.trim() === "") return
    console.log(selectedChat);
    
    try {
      const messageData = {
        senderId: myUser.id,
        text: message,
        chatRoomId: chatRoomId,
        time:serverTimestamp(),
        image: "",
        messageType: "text",
      }
      await addDoc(messageCollection, messageData);
      setMessage("");
      const chatRef = doc(db, 'chats', chatRoomId);
      await updateDoc(chatRef,{
        lastMessage: message,
      })
    } catch (error) {
      console.log('Error sending message: ', error);
    }
  }
  return (
    <div className='flex flex-col h-screen'>
      <div className="flex-1 overflow-y-auto p-5">
        {
          messages.map(message => (
            <Message key={message.id} message={message} myUser={myUser} otherUser={otherUser}/>
          ))
        }
      </div>
      <InputText sendMessage={sendMessage} message={message} setMessage={setMessage}/>
    </div>
  )
}

export default Chat