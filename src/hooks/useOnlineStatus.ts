import updateUserStatus from '@/lib/api/changeStatus';
import { User } from '@/types';
import React, { useEffect } from 'react';

const useOnlineStatus = (myUser: User | null) => {
  useEffect(() => {
    if (!myUser) return;
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
};

export default useOnlineStatus;
