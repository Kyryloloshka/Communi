import { DocumentData, addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import InputText from './InputText'
import Message from './Message'
import { db } from '@/lib/firebase/firebase';

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  image?: string;
  video?: string;
  file?: string;
  messageType: MessageType;
  isPreviousMessageSameSender?: boolean;
  isNextMessageSameSender?: boolean;
}

export type MessageType = "text" | "voice" | "sticker" | "gif"

export type typeAttached = "image" | "video" | "file";

const Chat = ({user, selectedChat}: {user: DocumentData | null | undefined, selectedChat: any}) => {
  const myUser = selectedChat?.myData
  const otherUser = selectedChat?.otherData
  const chatRoomId = selectedChat?.id
  const chatContainerRef = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [lastSenderId, setLastSenderId] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!chatRoomId) return;
      const unsub = onSnapshot(query(collection(db, 'messages'), where("chatRoomId", "==", chatRoomId), orderBy("time", "asc")), (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as IMessage[];
        messagesData.map((message, index) => {
          if (index === 0) {
            message.isPreviousMessageSameSender = false;
          } else {
            message.isPreviousMessageSameSender = messagesData[index - 1].senderId === message.senderId;
          }
        })
        messagesData.map((message, index) => {
          if (index === messagesData.length - 1) {
            message.isNextMessageSameSender = false;
          } else {
            message.isNextMessageSameSender = messagesData[index + 1].senderId === message.senderId;
          }
        })
        setMessages(messagesData);
      })
      return unsub;
    } catch (error) {
      console.log(error);
    }
    
  }, [chatRoomId])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (URL?: string, typeMessage?: typeAttached) => {
    const messageCollection = collection(db, 'messages');
    if (message.trim() === "" && !URL) return
    
    try {
      const messageData = {
        senderId: myUser.id,
        senderName: myUser.name,
        text: message,
        chatRoomId: chatRoomId,
        time: serverTimestamp(),
        image: typeMessage === "image" && URL ? URL : null,
        video: typeMessage === "video" && URL ? URL : null,
        file: typeMessage === "file" && URL ? URL : null,
        messageType: "text",
      }
      await addDoc(messageCollection, messageData);
      setMessage("");
      const chatRef = doc(db, 'chats', chatRoomId);
      await updateDoc(chatRef, {
        lastMessage: messageData ? messageData : "Image",
      })
    } catch (error) {
      console.log('Error sending message: ', error);
    }
  }
  return (
    <>
    {!selectedChat ? <div className='flex-1 h-full flex items-center justify-center text-lg font-light text-light-6/50'>Select a chat to start messaging</div> :
    <div className='flex flex-col h-full'>
      <div ref={chatContainerRef} className="flex-1 flex flex-col gap-1 overflow-y-auto p-5 flex-end">
        {
          messages.map(message => (
            <Message key={message.id} message={message} myUser={myUser} otherUser={otherUser}/>
          ))
        }
      </div>
      <InputText sendMessage={sendMessage} message={message} setMessage={setMessage}/>
    </div>}
    </>
  )
}

export default Chat