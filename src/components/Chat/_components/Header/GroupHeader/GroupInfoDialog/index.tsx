import CloseDialogElem from '@/components/ui/close-dialog-elem';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { formatTimestamp } from '@/lib/utils';
import { Group } from '@/types';
import Image from 'next/image';
import React from 'react';
import HeaderMenu from '../../../HeaderMenu';
import GroupMembersList from './GroupMembersList';

const GroupInfoDialog = ({
  open,
  groupData,
  setOpen,
}: {
  open: boolean;
  groupData: Group;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="gap-1">
        <DialogHeader className="text-left items-left">
          <div className="flex justify-between items-end -mt-[1.3rem]">
            <h4 className="text-sm  tracking-wider select-none">About group</h4>
            <div className="pr-2">
              <HeaderMenu />
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="flex gap-3 items-center">
            <Image
              src={groupData.avatarUrl}
              alt={groupData.name}
              width={72}
              height={72}
              className="h-18 rounded-full select-none aspect-square bg-light-3 dark:bg-dark-3 object-cover"
            />
            <div className="flex flex-col gap-0.5">
              <DialogTitle className=" tracking-wider">
                {groupData.name}
              </DialogTitle>
              <p className="text-[12px] font-light tracking-wider select-none">
                {groupData.members.length} members
              </p>
            </div>
          </div>
        </DialogHeader>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col ">
            <p className="text-sm text-dark-5 dark:text-light-2 font-light tracking-wider">
              {groupData.description}
            </p>
            <span className="text-[12px] text-primary-500 leading-[1em] select-none">
              Description
            </span>
          </div>
          <DropdownMenuSeparator />
          <div className="flex flex-col gap-1">
            <p className="text-[12px] tracking-wider font-light text-dark-5 dark:text-light-2 select-none">
              Created {formatTimestamp(groupData.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <GroupMembersList groupData={groupData} />
        <CloseDialogElem onClick={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default GroupInfoDialog;
