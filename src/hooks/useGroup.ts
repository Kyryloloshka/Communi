import { db } from '@/lib/firebase/firebase';
import { Group } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useGroup = (groupId: string | undefined) => {
  const [groupData, setGroupData] = useState<Group>();

  useEffect(() => {
    if (!groupId) return;

    const groupRef = doc(db, 'groups', groupId);
    const unsubscribe = onSnapshot(groupRef, (doc) => {
      if (doc.exists()) {
        const gData = { ...doc.data(), id: doc.id };
        setGroupData(gData as Group);
      } else {
        console.error('No such group document!');
      }
    });
    return () => unsubscribe();
  }, [groupId]);
  return { groupData };
};

export default useGroup;
