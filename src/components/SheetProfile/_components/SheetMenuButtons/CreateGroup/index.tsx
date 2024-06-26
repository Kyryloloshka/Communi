'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { app, db } from '@/lib/firebase/firebase';
import { useStateSelector } from '@/state';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';

const CreateGroup = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const storage = getStorage(app);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
	const myUser = useStateSelector((state) => state.auth.myUser);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGroupAvatar(e.target.files[0]);
    }
  };

  const handleCreateGroup = async () => {
		if (!myUser) return;
    const groupId = `group_${Date.now()}`;
    const createdBy = myUser.id;
    const members = [createdBy];
    let avatarUrl = '';

    if (groupAvatar) {
      setUploading(true);
      const avatarRef = ref(storage, `groupAvatars/${groupId}`);
      await uploadBytes(avatarRef, groupAvatar);
      avatarUrl = await getDownloadURL(avatarRef);
      setUploading(false);
    }

    const groupData = {
      id: groupId,
      name: groupName,
      avatarUrl,
      description: groupDescription,
      createdAt: new Date(),
      createdBy,
      members,
      admins: [createdBy],
      lastMessage: '',
      timestamp: new Date(),
      unreadCounts: members.reduce((acc: any, member) => {
        acc[member] = 0;
        return acc;
      }, {}),
    };

    await setDoc(doc(db, 'groups', groupId), groupData);
    setGroupName('');
    setGroupDescription('');
    setGroupAvatar(null);
    setIsOpenDialog(false);
  };
  return (
    <Dialog open={isOpenDialog}>
      <DialogTrigger onClick={() => setIsOpenDialog(true)} asChild>
        <button className="flex gap-1 py-1 items-center pl-1 cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
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
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Add all the peaple in group</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-name" className="text-right">
              Group Name
            </Label>
            <Input
              type="group-name"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="p-2 border rounded col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-description" className="text-right">
              Description
            </Label>
            <Input
              type="text"
              id="group-description"
              placeholder="Group Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="p-2 border rounded col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-avatar" className="text-right">
              Avatar Url
            </Label>
            <Input
              id={'group-avatar'}
              type="file"
              onChange={handleFileChange}
              className="p-2 border rounded col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
