import { db } from '@/lib/firebase/firebase';
import { useStateSelector } from '@/state';
import { User } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useFetchUserOtherData = () => {
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const [userData, setUserData] = useState<User | null>(null);
  console.log(selectedChat);

  useEffect(() => {
    const otherId = selectedChat?.otherId;
    if (!otherId) return;

    const userRef = doc(db, 'users', otherId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const uData = doc.data();
        setUserData(uData as User);
      } else {
        console.error('No such user document!');
      }
    });
    console.log('update');

    return () => unsubscribe();
  }, [selectedChat]);
  return userData;
};

export default useFetchUserOtherData;
