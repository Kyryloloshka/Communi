import { DocumentData } from 'firebase/firestore'
import React from 'react'
import InputText from './InputText'
import Message from './Message'

export interface IMessage {
  id: number;
  sender: DocumentData | null | undefined;
  text: string;
  avatarUrl: string;
  time: string;
}

const Chat = ({user, setSelectedChat}: {user: DocumentData | null | undefined, setSelectedChat: Function}) => {
  
  const messages = [
    {
      id: 1,
      sender: {name: 'ZIk', email: 'haliamov@gmail.com'},
      text: 'Hello world!',
      avatarUrl: 'https://i.pravatar.cc/300',
      time: '10:00'
    },
    {
      id: 2,
      sender: {name: 'Kyrylo', email: 'haliamov.kyrylo@lll.kpi.ua'},
      text: 'Hello! How are you?',
      avatarUrl: 'https://i.pravatar.cc/300',
      time: '10:00'
    },
    {
      id: 3,
      sender: {name: "Bipa", email: 'haliamov@gmail.com'},
      text: 'I am fine! Thank you! And you?',
      avatarUrl: 'https://i.pravatar.cc/300',
      time: '10:00'
    }
  ]
  return (
    <div className='flex flex-col h-screen'>
      <div className="flex-1 overflow-y-auto p-5">
        {
          messages.map(message => (
            <Message key={message.id} message={message} user={user}/>
          ))
        }
      </div>
      <InputText />
    </div>
  )
}

export default Chat