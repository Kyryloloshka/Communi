import { db } from '@/lib/firebase/firebase';
import { User } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useFetchUser = (userId: string | undefined, chat?: any) => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const uData = doc.data();
        setUserData(uData as User);
      } else {
        console.error('No such user document!');
      }
    });

    return () => unsubscribe();
  }, [userId, chat]);

  return userData;
};

export default useFetchUser;
