import { DocumentData, Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import InputText from './InputText'
import Message, { getValidTime } from './Message'
import { db } from '@/lib/firebase/firebase';
import { formatTimestamp } from '@/lib/utils';

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  text: string;
  time: Timestamp;
  image?: string;
  video?: string;
  file?: string;
  messageType: MessageType;
  previousMessage?: IMessage | null;
  nextMessage?: IMessage | null;
}

export type MessageType = "text" | "voice" | "sticker" | "gif"

export type typeAttached = "image" | "video" | "file";

const Chat = ({selectedChat}: {selectedChat: any}) => {
  const myUser = selectedChat?.myData
  const otherUser = selectedChat?.otherData
  const chatRoomId = selectedChat?.id
  const chatContainerRef = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<{onlineStatus: string, lastOnline: Timestamp}>();

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
            message.previousMessage = null;
          } else {
            message.previousMessage = messagesData[index - 1];
          }
        })
        messagesData.map((message, index) => {
          if (index === messagesData.length - 1) {
            message.nextMessage = null;
          } else {
            message.nextMessage = messagesData[index + 1];
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

  useEffect(() => {
    if (!selectedChat) return;
  
    const userId = selectedChat.otherData.id;
    const userRef = doc(db, 'users', userId);
  
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data(); 
        setUserStatus({onlineStatus: userData.onlineStatus, lastOnline: userData.lastOnline});
      } else {
        console.log("No such user document!");
      }
    });
  
    return unsubscribe; 
  }, [selectedChat]);

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
      <div className="bg-dark-3 flex gap-3 py-2 px-6 items-center">
        <img src={otherUser.avatarUrl} alt="" className='h-10 rounded-full'/>
        <div className="flex flex-col gap-1">
          <div className="text-light-2 leading-[1em]">{otherUser?.name}</div>
          {
            userStatus &&
            <div className="text-primary-500/70 text-xs leading-[1em]">
              {userStatus.onlineStatus === "online" 
                ? "online" 
                : "last seen " + formatTimestamp(userStatus.lastOnline)}
              </div>}
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 flex flex-col gap-0.5 overflow-y-auto p-5 flex-end">
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