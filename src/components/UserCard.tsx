import React from 'react'
import TruncateMarkup from 'react-truncate-markup';
import { getValidTime } from './Message';

export enum ChatType {
  Chat = "chat",
  Group = "group",
  Channel = "channel"
}

interface ChatData {
  name: string;
  avatarUrl: string;
  latestMessageText: string;
  time?: any;
  type: ChatType;
  isSelected?: boolean;
}

const UserCard = ({name, avatarUrl, latestMessageText, time, type, isSelected }: ChatData) => {
  return (
    <div className={`flex items-center gap-3 px-3 py-1.5 bg-dark-1 hover:bg-dark-4/70 transition w-full cursor-pointer ${isSelected && "bg-dark-3"}`}>
      <img src={avatarUrl} alt={name} className='w-10 h-10 rounded-full' />
      <div className="flex flex-col w-full">
        <div className="flex gap-1">
          {type === ChatType.Group && <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">icoG</span>}
          {type === ChatType.Channel && <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">icoC</span>}
          <div className="grid items-center gap-1 flex-auto" style={{ gridTemplateColumns: '1fr auto' }}>
              <div className="whitespace-nowrap overflow-hidden truncate" >
                  <span title={name}>{name}</span>
              </div>
              {time &&<span className='text-muted-foreground text-xs pt-[3px]'>{getValidTime(time)}</span>}
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="whitespace-nowrap overflow-hidden truncate text-sm text-light-5/50" >
            <span title={latestMessageText}>{latestMessageText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard