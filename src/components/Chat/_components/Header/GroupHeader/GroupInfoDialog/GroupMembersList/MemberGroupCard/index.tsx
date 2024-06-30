import Image from '@/components/Image';
import useFetchUser from '@/hooks/useFetchUser';
import { formatTimestamp, timestampToTimeType } from '@/lib/utils';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react';

const MemberGroupCard = ({ userId }: { userId: string }) => {
  const userData = useFetchUser(userId);
  const router = useRouter();
  const handleViewProfile = () => {
    if (!userData) return;
    router.push(`/?userTag=${userData.tag}`);
  };
  return (
    userData && (
      <button
        onClick={() => handleViewProfile()}
        className={`bg-light-4 dark:bg-dark-3 flex gap-3 p-2 rounded-lg items-center select-none w-full text-left dark:hover:bg-dark-5 hover:bg-light-6 transition`}
      >
        <Image
          width={40}
          height={40}
          src={userData.avatarUrl}
          alt={userData.name}
          className="h-10 rounded-full cursor-pointer"
        />
        <div className="flex flex-col gap-1">
          <div className="text-dark-5 dark:text-light-2 leading-[1em] cursor-pointer">
            {userData.name}
          </div>
          {userData.onlineStatus && (
            <div className="text-dark-5/80 dark:text-primary-500/70 text-xs leading-[1em]">
              {userData.onlineStatus === 'online'
                ? 'online'
                : 'last seen ' + formatTimestamp(userData.lastOnline)}
            </div>
          )}
        </div>
      </button>
    )
  );
};

export default MemberGroupCard;
