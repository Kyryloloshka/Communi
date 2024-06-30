import { formatTimestamp } from '@/lib/utils';
import { useStateSelector } from '@/state';
import { useRouter } from 'next/navigation';
import HeaderMenu from '../HeaderMenu';
import { TimeType } from '@/types';
import useFetchUser from '@/hooks/useFetchUser';

const Header = ({
  userStatus,
}: {
  userStatus: { onlineStatus: string; lastOnline: TimeType } | null;
}) => {
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const otherUser = useFetchUser(selectedChat?.otherId);
  const groupData = selectedChat?.groupData;

  const router = useRouter();
  const handleUserClick = (userId: string) => {
    router.push(`/?userId=${userId}`);
  };

  return otherUser && !groupData ? (
    <div className="bg-light-4 dark:bg-dark-3 flex gap-3 py-2 px-6 items-center select-none">
      <img
        onClick={() => handleUserClick(otherUser.id)}
        src={otherUser.avatarUrl}
        alt=""
        className="h-10 rounded-full cursor-pointer"
      />
      <div className="flex flex-col gap-1">
        <div
          onClick={() => handleUserClick(otherUser.id)}
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
  ) : (
    groupData && (
      <div className="bg-light-4 dark:bg-dark-3 flex gap-3 py-2 px-6 items-center select-none">
        <img
          src={groupData.avatarUrl}
          alt=""
          className="h-10 rounded-full aspect-square cursor-pointer bg-light-3 dark:bg-dark-3 object-cover"
        />
        <div className="flex flex-auto flex-col gap-1">
          <div className="text-dark-5 dark:text-light-2 leading-[1em] cursor-pointer">
            {groupData.name}
          </div>
        </div>
        <HeaderMenu />
      </div>
    )
  );
};

export default Header;
