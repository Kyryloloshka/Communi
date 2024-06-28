import React, { useState } from 'react';
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

  const handleUserSelect = (user: User) => {
    console.log(selectedUsers);

    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.id === user.id)
        ? prevSelected.filter((u) => u.id !== user.id)
        : [...prevSelected, user],
    );
  };

  const handleConfirm = async () => {
    if (!selectedChat || selectedUsers.length === 0) return;

    const groupRef = doc(db, 'groups', selectedChat.id);

    try {
      await updateDoc(groupRef, {
        members: arrayUnion(...selectedUsers.map((user) => user.id)),
      });
      onClose();
      console.log('Participants added to group');
    } catch (error) {
      console.error('Error adding participants to group: ', error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add Participants</DialogTitle>
        <DialogDescription className="flex flex-col gap-3">
          <p>
            Invite participants to your group by entering their email addresses
            below.
          </p>
          <div>
            {chatUsers.map((user) => (
              <div
                key={user.id}
                className={`cursor-pointer px-2 py-0.5 rounded-sm ${
                  selectedUsers.some((u) => u.id === user.id) ? 'bg-dark-5' : ''
                }`}
                onClick={() => handleUserSelect(user)}
              >
                {user.name}
              </div>
            ))}
          </div>
          <Button variant={'primary'} onClick={handleConfirm}>
            Confirm
          </Button>
          <DialogClose asChild>
            <CloseDialogElem />
          </DialogClose>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default InviteParticipantsDialog;
