'use client';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const ProfilePage = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCopiedTag, setIsCopiedTag] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('__name__', '==', userId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUser({ id: userDoc.id, ...userDoc.data() });
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="px-[15px] max-w-[400px] mx-auto  my-4 flex items-center flex-col gap-3">
        <div className="h-48 w-48 rounded-full overflow-hidden bg-primary-500"></div>
        <div className="self-start flex flex-col">
          <p className={'bg-dark-4 text-dark-4 rounded-sm'}>bio bio bio bio</p>
          <span className={'text-sm text-primary-500'}>About me</span>
        </div>
        <div className="self-start flex flex-col">
          <p className={'bg-dark-4 text-dark-4 rounded-sm'}>name name name</p>
          <span className={'text-sm text-primary-500'}>Name</span>
        </div>
        <div className="self-start flex flex-col">
          <p className="cursor-pointer bg-primary-500 dark:bg-dark-4 text-primary-500 dark:text-dark-4 rounded-sm">
            tag tag tag
          </p>
          <span className={'text-sm text-primary-500'}>Tag</span>
        </div>
      </div>
    );
  }
  const handleCopyTag = async () => {
    try {
      await navigator.clipboard.writeText(user.tag);
      setIsCopiedTag(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div>
      {user ? (
        <div className="px-[15px] max-w-[400px] mx-auto  my-4 flex items-center flex-col gap-3">
          <div className="h-48 w-48 rounded-full overflow-hidden select-none">
            <img
              src={user.avatarUrl}
              className={'w-full h-full object-cover'}
              alt="avatar"
            />
          </div>
          {user.bio && (
            <div className="self-start flex flex-col">
              <p>{user.bio}</p>
              <span className={'text-sm dark:text-primary-500 select-none'}>
                About me
              </span>
            </div>
          )}
          <div className="self-start flex flex-col">
            <p>{user.name}</p>
            <span
              className={
                'text-sm text-secondary-700 dark:text-primary-500 select-none'
              }
            >
              Name
            </span>
          </div>
          <div className="self-start flex flex-col">
            <p className="cursor-pointer" onClick={handleCopyTag}>
              {user.tag}
            </p>
            <span
              className={
                'text-sm text-secondary-700 dark:text-primary-500 select-none'
              }
            >
              {isCopiedTag ? 'Tag copied to clipboard' : 'Tag'}
            </span>
          </div>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default ProfilePage;
