import Image from '@/components/Image';
import React, { useState } from 'react';
import HeaderMenu from '../../HeaderMenu';
import { Group } from '@/types';
import GroupInfoDialog from './GroupInfoDialog';

const GroupHeader = ({ groupData }: { groupData: Group }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleGroupClick = () => {
    setOpenDialog(true);
  };
  return (
    <div className="bg-light-4 dark:bg-dark-3 flex gap-3 py-2 px-6 items-center select-none">
      <Image
        onClick={() => handleGroupClick()}
        width={40}
        height={40}
        src={groupData.avatarUrl}
        alt={groupData.name}
        className="h-10 rounded-full aspect-square cursor-pointer bg-light-3 dark:bg-dark-3 object-cover"
      />
      <div className="flex flex-auto flex-col gap-1">
        <div
          onClick={() => handleGroupClick()}
          className="text-dark-5 dark:text-light-2 leading-[1em] cursor-pointer"
        >
          {groupData.name}
        </div>
      </div>
      <HeaderMenu />
      <GroupInfoDialog
        setOpen={setOpenDialog}
        open={openDialog}
        groupData={groupData}
      />
    </div>
  );
};

export default GroupHeader;
