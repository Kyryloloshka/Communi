import { Group } from '@/types';
import MemberGroupCard from './MemberGroupCard';

const GroupMembersList = ({ groupData }: { groupData: Group }) => {
  return groupData.members.map((userId) => (
    <div className={`text-left`} key={userId}>
      <MemberGroupCard userId={userId} />
    </div>
  ));
};

export default GroupMembersList;
