import Image from '@/components/Image';
import { formatTimestamp } from '@/lib/utils';
import { TimeType, User } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react';

const UserHeader = ({
  otherUser,
  userStatus,
}: {
  otherUser: User;
  userStatus: { onlineStatus: string; lastOnline: TimeType } | null;
}) => {
  const router = useRouter();
  const handleUserClick = () => {
    router.push(`/?userTag=${otherUser.id}`);
  };

  return (
    <div className="bg-light-4 dark:bg-dark-3 flex gap-3 py-2 px-6 items-center select-none">
      <Image
        src={otherUser.avatarUrl}
        alt={otherUser.name}
        width={40}
        height={40}
        onClick={() => handleUserClick()}
        className="h-10 rounded-full cursor-pointer"
      />
      <div className="flex flex-col gap-1">
        <div
          onClick={() => handleUserClick()}
          className="text-dark-5 dark:text-light-2 leading-[1em] cursor-pointer"
        >
          {otherUser.name}
        </div>
        {userStatus && (
          <div className="text-dark-5/80 dark:text-primary-500/70 text-xs leading-[1em]">
            {userStatus.onlineStatus === 'online'
              ? 'online'
              : 'last seen ' + formatTimestamp(userStatus.lastOnline)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeader;
