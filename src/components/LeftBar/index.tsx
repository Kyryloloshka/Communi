import React from 'react';
import { Sheet, SheetTrigger } from '../ui/sheet';
import SheetProfile from '../SheetProfile';
import SearchUsersInput from '../SearchUsersInput';
import SearchResultsComponent from '../SearchResultsComponent';
import Users from '../ChatsMenu';
import { useStateSelector } from '@/state';

const LeftBar = () => {
  const searchKey = useStateSelector((state) => state.search.searchKey);
  return (
    <>
      <div className="h-12 w-full flex items-center gap-2 p-3">
        <Sheet>
          <SheetTrigger>
            <div className="burger"></div>
          </SheetTrigger>
          <SheetProfile />
        </Sheet>
        <SearchUsersInput />
      </div>
      {searchKey.length > 0 ? (
        <SearchResultsComponent loading={false} />
      ) : (
        <Users />
      )}
    </>
  );
};

export default LeftBar;
