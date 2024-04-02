import React from 'react'
import { IMessage } from './Chat';
import { DocumentData } from 'firebase/firestore';
import moment from 'moment';

function Message({message, myUser, otherUser}: {message: IMessage, myUser: any, otherUser: any}) {
  const isCurrentUser = message.senderId === myUser.id;
  

  const timeAgo = (time: any) => {
    const date = time?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  }

  return (
    <div key={message.id} className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && 
      <div className={`w-10 h-10 mr-2 self-end`}>
        <img src={otherUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
      <div className={`text-light-1 p-2 rounded-t-lg ${isCurrentUser ? "bg-secondary-500/40 self-end  rounded-l-lg" : "bg-dark-5 rounded-r-lg self-start"}`}>
        <p className=''>{message.text}</p>
        <div className="text-xs text-gray-400">{timeAgo(message.time)}</div>
      </div>
      {isCurrentUser && 
      <div className={`w-10 h-10 ml-2 self-end`}>
        <img src={myUser.avatarUrl} alt="avatar" className='w-full h-full rounded-full object-cover' />
      </div>
      }
    </div>
  )
}

export default Message