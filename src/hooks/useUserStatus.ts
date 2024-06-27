import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';

const useUserStatus = (userId: string | null) => {
  const [userStatus, setUserStatus] = useState<{
    onlineStatus: string;
    lastOnline: Timestamp;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserStatus({
          onlineStatus: userData.onlineStatus,
          lastOnline: userData.lastOnline,
        });
      } else {
        console.error('No such user document!');
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return userStatus;
};

export default useUserStatus;
