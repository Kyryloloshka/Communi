import React, { useState } from 'react'
import { IMessage } from './Chat';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export const getValidTime = (time: any) => {
  const date = new Date(time * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

function Message({message, myUser, otherUser}: {message: IMessage, myUser: any, otherUser: any}) {
  const isCurrentUser = message.senderId === myUser.id;
  const [imageClasses, setImageClasses] = useState("");
  
  const fullScreen = () => {
    if (message.image) {
      setImageClasses("fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-50 flex items-center justify-center")
    }
  }

  return (
    <div key={message.id} className={`flex mb-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && 
      <div className={`w-10 h-10 mr-2 self-end aspect-square cursor-pointer`}>
        <img src={otherUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
      <div className={`text-light-1 max-w-[500px] overflow-hidden flex flex-col flex-wrap rounded-t-lg ${isCurrentUser ? "bg-dark-5 self-end  rounded-l-lg" : "bg-dark-5 rounded-r-lg self-start"}`}>
        {!isCurrentUser && <Link href={"/profile/" + otherUser.id} className="text-primary-500 px-2 pt-1.5 leading-[1em] pb-1">{message.senderName}</Link> }
        {
          message.image && 
          <Dialog>
            <DialogTrigger asChild>
              <img src={message.image} alt="message" className={`max-w-[400px] max-h-[400px] object-cover cursor-pointer`} />
            </DialogTrigger>
            <DialogContent className="h-screen flex justify-center items-center w-screen outline-none ring-none border-none">
              <img src={message.image} alt="message" className={`max-h-screen px-10 object-contain flex-grow max-w-screen transition-none`} />
            </DialogContent>
          </Dialog>
        }
        <p style={{wordBreak: "break-word"}} className='break-words text-sm leading-[1em] px-2 pb-0.5 pt-1.5'>{message.text}</p>
        <div className={`text-xs  text-gray-400 ${isCurrentUser && "self-end"} px-2 pb-1`}>{getValidTime(message.time)}</div>
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