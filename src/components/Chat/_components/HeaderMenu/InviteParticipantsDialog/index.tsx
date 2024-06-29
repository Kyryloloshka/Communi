import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import CloseDialogElem from '@/components/ui/close-dialog-elem';
import useChatUsers from '@/hooks/useChatUsers';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { useStateSelector } from '@/state';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { formatTimestamp } from '@/lib/utils';
import useGroup from '@/hooks/useGroup';

const InviteParticipantsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const chatUsers = useChatUsers();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const { groupData } = useGroup(selectedChat?.id);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleUserSelect = useCallback((user: User) => {
    setErrorMessage('');
    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.id === user.id)
        ? prevSelected.filter((u) => u.id !== user.id)
        : [...prevSelected, user],
    );
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedChat || selectedUsers.length === 0) {
      setErrorMessage('Please select at least one user to add to the group.');
      return;
    }
    setErrorMessage('');
    const groupRef = doc(db, 'groups', selectedChat.id);

    try {
      await updateDoc(groupRef, {
        members: arrayUnion(...selectedUsers.map((user) => user.id)),
      });
      onClose();
    } catch (error) {
      console.error('Error adding participants to group: ', error);
    }
  }, [selectedChat, selectedUsers, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add Participants</DialogTitle>
        <DialogDescription className="flex flex-col gap-3">
          <p>
            Add people to this chat. They will be able to see the chat history.
          </p>
          {selectedUsers.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-light-4 dark:bg-dark-3 px-2 py-1 rounded-lg"
                >
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="whitespace-nowrap">{user.name}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {chatUsers.map((user) => (
              <button
                className={`text-left cursor-pointer ${groupData?.members.includes(user.id) ? 'opacity-50' : ''}`}
                key={user.id}
                onClick={() => handleUserSelect(user)}
              >
                <div
                  className={`bg-light-4 dark:bg-dark-3 flex gap-3 p-2 rounded-lg items-center select-none ${
                    selectedUsers.some((u) => u.id === user.id)
                      ? 'dark:bg-dark-4 light:bg-neutral-300'
                      : ''
                  }`}
                >
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="text-dark-5 dark:text-light-2 leading-[1em] cursor-pointer">
                      {user.name}
                    </div>
                    {user.onlineStatus && (
                      <div className="text-dark-5/80 dark:text-primary-500/70 text-xs leading-[1em]">
                        {user.onlineStatus === 'online'
                          ? 'online'
                          : 'last seen ' +
                            formatTimestamp({
                              seconds: user.lastOnline.seconds,
                              nanoseconds: user.lastOnline.nanoseconds,
                            })}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Button variant={'primary'} onClick={handleConfirm}>
            Confirm
          </Button>
          {errorMessage && (
            <div className="flex text-center text-sm items-center justify-center text-red-500">
              {errorMessage}
            </div>
          )}
          <DialogClose asChild>
            <CloseDialogElem />
          </DialogClose>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default InviteParticipantsDialog;
