import React from 'react';
import { PropsUserCard, ChatType } from '@/types/index';
import { getValidTime } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Image from '@/components/Image';

const UserCard = ({
  name,
  avatarUrl,
  latestMessage,
  type,
  isSelected,
  unreadCount,
}: PropsUserCard) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      className={`flex relative select-none items-center gap-3 px-3 py-1.5 hover:bg-light-5 dark:hover:bg-dark-4/70 transition w-full cursor-pointer ${
        isSelected && 'bg-light-4 dark:bg-dark-3'
      }`}
    >
      <Image
        width={40}
        height={40}
        src={avatarUrl}
        alt={name}
        className="w-10 text-[10px] h-10 rounded-full aspect-square object-cover bg-light-3 dark:bg-dark-3"
      />
      <div className="flex flex-col w-full">
        <div className="flex gap-1">
          {type === ChatType.Group &&
            (isDark ? (
              <Image
                width={24}
                height={24}
                className="fill-dark-5 w-6 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2"
                src="/assets/icons/group-light.svg"
                alt="settings"
              />
            ) : (
              <Image
                width={24}
                height={24}
                className="fill-dark-5 w-6 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2"
                src="/assets/icons/group-dark.svg"
                alt="settings"
              />
            ))}
          {type === ChatType.Channel && (
            <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">
              icoC
            </span>
          )}
          <div
            className="grid items-center gap-1 flex-auto"
            style={{ gridTemplateColumns: '1fr auto' }}
          >
            <div className="whitespace-nowrap overflow-hidden truncate">
              <span title={name}>{name}</span>
            </div>
            {latestMessage && latestMessage.time && (
              <span className="text-muted-foreground text-xs pt-[3px]">
                {getValidTime(latestMessage.time)}
              </span>
            )}
          </div>
        </div>
        {latestMessage && (
          <div className="grid" style={{ gridTemplateColumns: '1fr 20px' }}>
            <div className="whitespace-nowrap overflow-hidden truncate text-sm text-dark-5/80 dark:text-primary-500/80">
              {latestMessage.image && <span>Image </span>}
              {latestMessage.video && <span>Video </span>}
              {latestMessage.file && <span>File </span>}
              {latestMessage.text && (
                <span title={latestMessage.text}>{latestMessage.text}</span>
              )}
            </div>
            {unreadCount !== undefined && unreadCount > 0 && (
              <span className="bg-primary-600 text-white text-[10px] rounded-full h-[20px] w-[20px] flex items-center justify-center text-center top-1 left-10 text-xs">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
