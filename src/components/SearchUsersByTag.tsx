import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';

const SearchUsersByTag = ({setSearchResults, searchTag, setSearchTag}: any) => {
  useEffect(() => {
    const searchUsers = async () => {
      try {
        const trimmedSearchTag = searchTag.trim();
        if (trimmedSearchTag === '') {
          setSearchResults([]);
          return;
        }

        const users = [] as any[];
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        usersSnapshot.forEach((doc) => {
          const userData = {id: doc.id, ...doc.data()} as any;
          const tag = userData.tag;
          if (tag.includes(trimmedSearchTag) || tag !== userData.tag) {
            users.push(userData);
          }
        });
        setSearchResults(users);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    // Викликаємо функцію пошуку при зміні введеного тегу
    searchUsers();
  }, [searchTag]);
  return (
    <div>
      <Input
        type="text"
        placeholder="Search users by tag"
        value={searchTag}
        className='py-1.5 bg-dark-4 placeholder:text-light-6/40 outline-none border-none placeholder:font-light px-5 rounded-full overflow-hidden min-w-0 text-sm'
        onChange={(e) => setSearchTag(e.target.value)}
      />
    </div>
  )
}

export default SearchUsersByTag