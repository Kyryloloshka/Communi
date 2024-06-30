import React from 'react';
import { SheetContent } from '../ui/sheet';
import { Button } from '../ui/button';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { useTheme } from 'next-themes';
import { authActions, useActionCreators, useStateSelector } from '@/state';
import Image from '@/components/Image';
import updateUserStatus from '@/lib/api/changeStatus';
import CreateGroup from './_components/SheetMenuButtons/CreateGroup';
import SwitchTheme from './_components/SheetMenuButtons/SwitchTheme';
import Settings from './_components/SheetMenuButtons/Settings';

const SheetProfile = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const user = useStateSelector((state) => state.auth.myUser);
  const actions = useActionCreators(authActions);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push('/login');
        if (!user) return;
        updateUserStatus(user.id, 'offline');
        actions.droppingData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <SheetContent
      side={'left'}
      className="w-[260px] p-4 outline-none flex flex-col gap-2 bg-light-2"
    >
      {user && (
        <>
          <div className="flex-auto flex flex-col gap-3">
            {user.avatarUrl && (
              <div className="">
                <Image
                  width={72}
                  height={72}
                  sizes={'72px'}
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-18 h-18 rounded-full object-cover"
                />
              </div>
            )}
            <div className="">
              {user.name && <div className="">{user.name}</div>}
              {user.tag && (
                <div className="text-xs text-gray-500">{user.tag}</div>
              )}
            </div>
            <div className="bg-primary-500/40 dark:bg-dark-4 rounded-sm flex flex-col overflow-hidden">
              <Settings />
              <CreateGroup />
              <SwitchTheme />
            </div>
          </div>
          <Button variant={'destructive'} onClick={() => handleLogout()}>
            Logout
          </Button>
        </>
      )}
    </SheetContent>
  );
};

export default SheetProfile;
