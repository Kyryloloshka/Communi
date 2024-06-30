import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import './styles.css';
import InviteParticipantsDialog from './InviteParticipantsDialog';
import Image from '@/components/Image';

const HeaderMenu = () => {
  const [isInviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleInviteDialogOpen = () => {
    setInviteDialogOpen(true);
  };

  const handleInviteDialogClose = () => {
    setInviteDialogOpen(false);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="zero" className="relative -right-4">
            <div className="menu-header-icon"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mx-4">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Information about group</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleInviteDialogOpen}>
              <span>Invite Participants</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Manage a group</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-between">
              <span className="text-[#ba141a] font-semibold">
                Leave the group
              </span>
              <Image
                width={20}
                height={20}
                className="h-5"
                src="/assets/icons/leave.svg"
                alt="leave"
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {isInviteDialogOpen && (
        <InviteParticipantsDialog
          isOpen={isInviteDialogOpen}
          onClose={handleInviteDialogClose}
        />
      )}
    </>
  );
};

export default HeaderMenu;
