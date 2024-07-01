import { Group } from '@/types';
import MemberGroupCard from './MemberGroupCard';
import useFetchGroupMembers from '@/hooks/useFetchGroupMembers';

const GroupMembersList = ({ groupData }: { groupData: Group }) => {
  const members = useFetchGroupMembers(groupData.id);
  return members.map((userId) => {
    if (!userId) return null;
    return <div className={`text-left`} key={userId}>
      <MemberGroupCard userId={userId} />
    </div>
});
};

export default GroupMembersList;
