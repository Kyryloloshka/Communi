import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import CloseDialogElem from '@/components/ui/close-dialog-elem';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { authActions, useActionCreators, useStateSelector } from '@/state';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import SelectedUsers from './SelectedUsers';
import ChatsList from './ChatsList';
import { convertChatToSelectedChat } from '@/lib/utils';

const InviteParticipantsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const actions = useActionCreators(authActions);
  const myUser = useStateSelector((state) => state.auth.myUser);

  const handleConfirm = useCallback(async () => {
    if (!selectedChat || selectedUsers.length === 0 || !myUser?.id) {
      setErrorMessage('Please select at least one user to add to the group.');
      return;
    }
    setErrorMessage('');
    const groupRef = doc(db, 'groups', selectedChat.id);

    try {
      await updateDoc(groupRef, {
        members: arrayUnion(...selectedUsers.map((user) => user.id)),
      });
      actions.setSelectedChat({
        ...selectedChat,
        ...(selectedChat.groupData?.members && {
          members: [
            ...selectedChat.groupData.members,
            ...selectedUsers.map((user) => user.id),
          ],
        }),
      });
      onClose();
    } catch (error) {
      console.error('Error adding participants to group: ', error);
    }
  }, [selectedChat, selectedUsers, onClose, myUser?.id, actions]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add Participants</DialogTitle>
        <DialogDescription className="flex flex-col gap-3">
          <p>
            Add people to this chat. They will be able to see the chat history.
          </p>
          <SelectedUsers selectedUsers={selectedUsers} />
          <div className="flex flex-col gap-2">
            <ChatsList
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              setErrorMessage={setErrorMessage}
            />
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
