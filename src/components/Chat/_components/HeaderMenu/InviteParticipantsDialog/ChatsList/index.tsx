import Image from '@/components/Image';
import useChatUsers from '@/hooks/useChatUsers';
import useGroup from '@/hooks/useGroup';
import { formatTimestamp } from '@/lib/utils';
import { useStateSelector } from '@/state';
import { User } from '@/types';
import React, { useCallback } from 'react';

interface ChatsListProps {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ChatsList = ({
  selectedUsers,
  setSelectedUsers,
  setErrorMessage,
}: ChatsListProps) => {
  const chatUsers = useChatUsers();
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const { groupData } = useGroup(selectedChat?.id);

  const handleUserSelect = useCallback(
    (user: User) => {
      setErrorMessage('');
      setSelectedUsers((prevSelected) =>
        prevSelected.some((u) => u.id === user.id)
          ? prevSelected.filter((u) => u.id !== user.id)
          : [...prevSelected, user],
      );
    },
    [setErrorMessage, setSelectedUsers],
  );

  return chatUsers.map((user) => {
    if (!user) return null;
    return (
      <button
        className={`text-left cursor-pointer ${groupData?.members.includes(user.id) ? 'opacity-50' : ''}`}
        key={user.id}
        onClick={() => handleUserSelect(user)}
      >
        <div
          className={`bg-light-4 dark:bg-dark-3 flex gap-3 p-2 rounded-lg items-center select-none ${
            selectedUsers.some((u) => u.id === user.id)
              ? 'dark:bg-dark-4 light:bg-neutral-300'
              : ''
          }`}
        >
          <Image
            width={40}
            height={40}
            src={user.avatarUrl}
            alt={user.name}
            className="h-10 rounded-full cursor-pointer"
          />
          <div className="flex flex-col gap-1">
            <div className="text-dark-5 dark:text-light-2 leading-[1em] cursor-pointer">
              {user.name}
            </div>
            {user.onlineStatus && (
              <div className="text-dark-5/80 dark:text-primary-500/70 text-xs leading-[1em]">
                {user.onlineStatus === 'online'
                  ? 'online'
                  : 'last seen ' + formatTimestamp(user.lastOnline)}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  });
};

export default ChatsList;
