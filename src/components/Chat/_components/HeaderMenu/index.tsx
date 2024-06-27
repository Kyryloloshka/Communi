import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import './styles.css';

const HeaderMenu = () => {
  return (
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
          <DropdownMenuItem>
            <span>Invite participants</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Manage a group</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-between">
            <span className="text-[#ba141a] font-semibold">
              Leave the group
            </span>
            <svg
              viewBox="0 0 24 24"
              id="_24x24_On_Light_Session-Leave"
              data-name="24x24/On Light/Session-Leave"
              xmlns="http://www.w3.org/2000/svg"
              fill="#ba141a"
              className="h-5"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {' '}
                <rect
                  id="view-box"
                  width="24"
                  height="24"
                  fill="none"
                ></rect>{' '}
                <path
                  id="Shape"
                  d="M2.95,17.5A2.853,2.853,0,0,1,0,14.75v-12A2.854,2.854,0,0,1,2.95,0h8.8a.75.75,0,0,1,0,1.5H2.95A1.362,1.362,0,0,0,1.5,2.75v12A1.363,1.363,0,0,0,2.95,16h8.8a.75.75,0,0,1,0,1.5Zm9.269-4.219a.751.751,0,0,1,0-1.061L14.939,9.5H5.75a.75.75,0,0,1,0-1.5h9.19L12.219,5.28A.75.75,0,1,1,13.28,4.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.751.751,0,0,1-1.061,0Z"
                  transform="translate(3.25 3.25)"
                  fill="#ba141a"
                ></path>{' '}
              </g>
            </svg>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;
