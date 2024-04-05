import React from 'react'
import { IMessage } from './Chat';

export const getValidTime = (time: any) => {
  const date = new Date(time * 1000); // Множимо на 1000, бо JavaScript працює з мілісекундами, але TimestampServer повертає час у секундах
  const hours = date.getHours().toString().padStart(2, '0'); // Отримуємо години, додаємо '0' вперед, якщо число менше 10
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Отримуємо хвилини, додаємо '0' вперед, якщо число менше 10
  return `${hours}:${minutes}`;
};

function Message({message, myUser, otherUser}: {message: IMessage, myUser: any, otherUser: any}) {
  const isCurrentUser = message.senderId === myUser.id;

  return (
    <div key={message.id} className={`flex mb-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && 
      <div className={`w-10 h-10 mr-2 self-end aspect-square cursor-pointer`}>
        <img src={otherUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
      <div className={`text-light-1 max-w-[500px] overflow-hidden p-2 flex flex-col flex-wrap rounded-t-lg ${isCurrentUser ? "bg-dark-5 self-end  rounded-l-lg" : "bg-dark-5 rounded-r-lg self-start"}`}>
        <div className="">{message.senderId}</div>
        {
          message.image && 
          <img src={message.image} alt="message" className='w-40 h-40 rounded-lg object-cover mb-2' />
        }
        <p style={{wordBreak: "break-word"}} className=' break-words text-sm'>{message.text}</p>
        <div className={`text-xs  text-gray-400 ${isCurrentUser && "self-end"}`}>{getValidTime(message.time)}</div>
      </div>
      {isCurrentUser && 
      <div className={`w-10 h-10 ml-2 self-end aspect-square`}>
        <img src={myUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
    </div>
  )
}

export default Message