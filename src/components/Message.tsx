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
    <div key={message.id} className={`flex relative ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser &&
      <div className={`w-8 h-8 mr-2 self-end aspect-square cursor-pointer`}>
        {isLastInGroup && 
        <img src={otherUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />}
      </div>
      }
      <div className={`text-light-1 max-w-[500px] overflow-hidden relative flex flex-col flex-wrap ${isCurrentUser ? "bg-dark-5 self-end  rounded-l-xl" : "bg-dark-5 rounded-r-xl self-start"} rounded-sm ${isFirstInGroup && "rounded-t-xl"} ${isLastInGroup && (isCurrentUser ? "rounded-br-none" : "rounded-bl-none")}`}>
        {!isCurrentUser && isFirstInGroup && <Link href={"/profile/" + otherUser.id} className="text-primary-500 px-2 leading-[1em] pt-1.5">{message.senderName}</Link> }
        {
          message.image && 
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <img src={message.image} alt="image" className={`max-w-[400px] max-h-[400px] object-cover cursor-pointer`} />
            </DialogTrigger>
            <DialogContent onClick={() => setOpen(false)} className="h-screen flex justify-center items-center w-screen outline-none ring-none border-none">
              <img src={message.image} alt="image" className={`max-h-screen px-10 object-contain flex-grow max-w-screen transition-none`} />
            </DialogContent>
          </Dialog>
        }
        {
          message.video && 
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <video src={message.video} className={`max-w-[400px] max-h-[400px] object-cover cursor-pointer`} />
            </DialogTrigger>
            <DialogContent className="h-screen flex justify-center items-center w-screen outline-none ring-none border-none">
              <div onClick={() => setOpen(false)} className="fixed bg-transparent left-0 top-0 h-screen w-screen -z-10"></div>
              <video src={message.video} autoPlay={true} controls className={`max-h-screen px-10 object-contain flex-grow max-w-screen transition-none`} />
            </DialogContent>
          </Dialog>
        }
        {
          message.file &&
          <a href={message.file} download className="text-primary-500 px-2 leading-[1em]">{message.file}</a>
        } 
        {message.text.trim() && <p style={{wordBreak: "break-word"}} className={`px-2 pb-2 pt-1.5 ${!isCurrentUser && isFirstInGroup && "pt-0"} leading-[1em]`}><span className='break-words text-sm'>{message.text.trim()}</span>
          <span className="inline-block w-[37px]">{""}</span>
        </p>}
        <div className={`text-xs absolute bottom-1 text-gray-400 right-0 ${isCurrentUser && "self-end"} px-2`}>{getValidTime(message.time)}</div>
      </div>
      {isLastInGroup &&
        <img className={`w-3 absolute bottom-0 fill-white object-fill ${isCurrentUser ? "-right-3 rotate-90" : "left-[28px]"}`} src="assets/items/pseudo-elem-for-message.svg" alt="" />
      }
    </div>
  )
}

export default Message