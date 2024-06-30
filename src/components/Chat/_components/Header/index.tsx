import { useStateSelector } from '@/state';
import { TimeType } from '@/types';
import useFetchUser from '@/hooks/useFetchUser';
import UserHeader from './UserHeader';
import GroupHeader from './GroupHeader';

const Header = ({
  userStatus,
}: {
  userStatus: { onlineStatus: string; lastOnline: TimeType } | null;
}) => {
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const otherUser = useFetchUser(selectedChat?.otherId);
  const groupData = selectedChat?.groupData;

  return otherUser && !groupData ? (
    <UserHeader otherUser={otherUser} userStatus={userStatus} />
  ) : (
    groupData && <GroupHeader groupData={groupData} />
  );
};

export default Header;
