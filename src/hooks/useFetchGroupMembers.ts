import { db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useFetchGroupMembers = (groupId: string) => {
  const [members, setMembers] = useState<(string | null)[]>([]);
  useEffect(() => {
    const fetchGroupMembers = async () => {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = { ...groupDoc.data() };
      const users = groupData.members;
      setMembers(users);
    };
    

    fetchGroupMembers();
  }, [groupId]);
  return members;
};

export default useFetchGroupMembers;
