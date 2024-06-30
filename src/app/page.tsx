'use client';
import { getAuth } from 'firebase/auth';
import { app, db } from '@/lib/firebase/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import Chat from '@/components/Chat';
import Profile from '@/components/Profile';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { User } from '@/types/index';
import LeftBar from '@/components/LeftBar';
import updateUserStatus from '@/lib/api/changeStatus';
import { authActions, useActionCreators, useStateSelector } from '@/state';
import { timestampToTimeType } from '@/lib/utils';

function Home() {
  const auth = getAuth(app);
  const actions = useActionCreators(authActions);
  const router = useRouter();
  const myUser = useStateSelector((state) => state.auth.myUser);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = { ...userDoc.data() };
        actions.setMyUser({
          ...userData,
          id: userDoc.id,
          lastOnline: timestampToTimeType(userData.lastOnline),
        } as User);
      } else {
        actions.setMyUser(null);
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router, actions]);
  // Update user status when window focus changes
  useEffect(() => {
    if (myUser && myUser.id) {
      updateUserStatus(myUser.id, 'online');
    }
    let focusListener: () => void;
    let blurListener: () => void;
    let beforeUnloadListener: (event: BeforeUnloadEvent) => void;

    const setUserFocusListeners = () => {
      focusListener = () => {
        if (myUser && myUser.id) {
          updateUserStatus(myUser.id, 'online');
        }
      };

      blurListener = () => {
        if (myUser && myUser.id) {
          updateUserStatus(myUser.id, 'offline');
        }
      };

      beforeUnloadListener = (event: BeforeUnloadEvent) => {
        if (myUser && myUser.id) {
          updateUserStatus(myUser.id, 'offline');
        }
        event.returnValue = 'Are you sure you want to leave?';
      };

      window.addEventListener('focus', focusListener);
      window.addEventListener('blur', blurListener);
      window.addEventListener('beforeunload', beforeUnloadListener);
    };

    const removeUserFocusListeners = () => {
      window.removeEventListener('focus', focusListener);
      window.removeEventListener('blur', blurListener);
      window.removeEventListener('beforeunload', beforeUnloadListener);
    };

    if (myUser) {
      setUserFocusListeners();
    }

    return () => {
      removeUserFocusListeners();
    };
  }, [myUser]);

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} className="min-w-[200px]">
          <LeftBar />
        </ResizablePanel>
        <ResizableHandle className="bg-primary-500/80 dark:bg-dark-5" />
        <ResizablePanel defaultSize={75} className="min-w-[300px]">
          {userId ? <Profile userId={userId} /> : <Chat />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default function HomeWithSuspense() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
