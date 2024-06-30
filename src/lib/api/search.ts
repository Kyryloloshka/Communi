import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { User } from '@/types/index';
import { timestampToTimeType } from '../utils';

const searchUsers = async ({
  searchKey,
  setSearchResults,
  myUserData,
}: {
  searchKey: string;
  setSearchResults: (users: User[]) => void;
  myUserData: User;
}) => {
  try {
    const trimmedSearchKey = searchKey.trim();
    if (trimmedSearchKey === '') {
      setSearchResults([]);
      return;
    }

    const users = [] as any[];
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    usersSnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() } as any;
      if (userData && myUserData && userData.id === myUserData.id) return;
      const tag = userData.tag;
      const name = userData.name;
      if (tag.startsWith(trimmedSearchKey) || name.includes(trimmedSearchKey)) {
        users.push({
          ...userData,
          lastOnline: timestampToTimeType(userData.lastOnline),
        });
      }
    });
    console.log('users: ', users);
    setSearchResults(users);
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

export default searchUsers;
