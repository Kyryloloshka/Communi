import React from 'react'
import { IMessage } from './Chat';
import { DocumentData } from 'firebase/firestore';

function Message({message, user}: {message: IMessage, user: DocumentData | null | undefined}) {
  const isCurrentUser = message.sender?.email === user?.email
  return (
    <div key={message.id} className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && 
      <div className={`w-10 h-10 mr-2 self-end`}>
        <img src={message.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
      <div className={`text-light-1 p-2 rounded-t-lg ${isCurrentUser ? "bg-secondary-500/40 self-end  rounded-l-lg" : "bg-dark-5 rounded-r-lg self-start"}`}>
        <p className=''>{message.text}</p>
        <div className="text-xs text-gray-400">{message.time}</div>
      </div>
      {isCurrentUser && 
      <div className={`w-10 h-10 ml-2 self-end`}>
        <img src={message.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
    </div>
  )
}

export default Message