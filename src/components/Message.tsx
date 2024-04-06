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
  const isFirstInGroup = !message.isPreviousMessageSameSender;
  const isLastInGroup = !message.isNextMessageSameSender;
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  return (
    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser &&
      <div className={`w-10 h-10 mr-2 self-end aspect-square cursor-pointer`}>
        {isLastInGroup && 
        <img src={otherUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />}
      </div>
      }
      <div className={`text-light-1 max-w-[500px] overflow-hidden flex flex-col flex-wrap ${isCurrentUser ? "bg-dark-5 self-end  rounded-l-xl" : "bg-dark-5 rounded-r-xl self-start"} rounded-sm ${isFirstInGroup && "rounded-t-xl"}`}>
        {!isCurrentUser && <Link href={"/profile/" + otherUser.id} className="text-primary-500 px-2 pt-1.5 leading-[1em] pb-1">{message.senderName}</Link> }
        {
          message.image && 
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <img src={message.image} alt="message" className={`max-w-[400px] max-h-[400px] object-cover cursor-pointer`} />
            </DialogTrigger>
            <DialogContent className="h-screen flex justify-center items-center w-screen outline-none ring-none border-none">
              <div onClick={() => setOpen(false)} className="fixed bg-transparent left-0 top-0 h-screen w-screen -z-10"></div>
              <img src={message.image} alt="message" className={`max-h-screen px-10 object-contain flex-grow max-w-screen transition-none`} />
            </DialogContent>
          </Dialog>
        }
        <p style={{wordBreak: "break-word"}} className='break-words text-sm leading-[1em] px-2 pb-0.5 pt-1.5'>{message.text}</p>
        <div className={`text-xs  text-gray-400 ${isCurrentUser && "self-end"} px-2 pb-1`}>{getValidTime(message.time)}</div>
      </div>
    </div>
  )
}

export default Message