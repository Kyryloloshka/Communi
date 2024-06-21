import React from 'react';
import { SheetContent } from '../ui/sheet';
import { Button } from '../ui/button';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import SwitchTheme from './_components/SwitchTheme';
import { useTheme } from 'next-themes';
import { authActions, useActionCreators, useStateSelector } from '@/state';
import Image from 'next/image';
import updateUserStatus from '@/lib/api/changeStatus';

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
        console.log(error);
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
              <div className="flex gap-2 p-2 items-center cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
                <div className="w-6">
                  {isDark ? (
                    <img
                      className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2 "
                      src="/assets/icons/settings-light.svg"
                      alt="settings"
                    />
                  ) : (
                    <img
                      className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2 "
                      src="/assets/icons/settings-dark.svg"
                      alt="settings"
                    />
                  )}
                </div>
                <div>Settings</div>
              </div>
              <div className="flex gap-1 py-1 items-center pl-1 cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
                <div className="w-8 flex justify-center items-center">
                  {isDark ? (
                    <img
                      className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2"
                      src="/assets/icons/group-light.svg"
                      alt="settings"
                    />
                  ) : (
                    <img
                      className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2"
                      src="/assets/icons/group-dark.svg"
                      alt="settings"
                    />
                  )}
                </div>
                <div>Create Group</div>
              </div>
              <div className="flex gap-2 items-center px-2 py-1 cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
                <div className="w-6 flex justify-center items-center"></div>
                <div className="flex-auto">Night Theme</div>
                <SwitchTheme />
              </div>
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
