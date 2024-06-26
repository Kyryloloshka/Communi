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
import { authActions, useActionCreators, useStateSelector } from '@/state';
import { timestampToTimeType } from '@/lib/utils';
import useOnlineStatus from '@/hooks/useOnlineStatus';

function Home() {
  const auth = getAuth(app);
  const actions = useActionCreators(authActions);
  const router = useRouter();
  const myUser = useStateSelector((state) => state.auth.myUser);
  const searchParams = useSearchParams();
  const userTag = searchParams.get('userTag');

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
  useOnlineStatus(myUser);

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} className="min-w-[200px]">
          <LeftBar />
        </ResizablePanel>
        <ResizableHandle className="bg-primary-500/80 dark:bg-dark-5" />
        <ResizablePanel defaultSize={75} className="min-w-[300px]">
          {userTag ? <Profile userTag={userTag} /> : <Chat />}
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
