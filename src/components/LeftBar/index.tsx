import React from "react";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SheetProfile from "../SheetProfile";
import SearchUsersInput from "../SearchUsersInput";
import SearchResultsComponent from "../SearchResultsComponent";
import Users from "../Users";

const LeftBar = ({
  searchKey,
  setSearchKey,
  setSearchResults,
  searchResults,
}: {
  searchKey: string;
  setSearchKey: (tag: string) => void;
  setSearchResults: (results: any) => void;
  searchResults: any;
}) => {
  return (
    <>
      <div className="h-12 w-full flex items-center gap-2 p-3">
        <Sheet>
          <SheetTrigger>
            <div className="burger"></div>
          </SheetTrigger>
          <SheetProfile/>
        </Sheet>
        <SearchUsersInput
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          setSearchResults={setSearchResults}
        />
      </div>
      {searchKey.length > 0 ? (
        <SearchResultsComponent
          setSearchKey={setSearchKey}
          loading={false}
          searchResults={searchResults}
        />
      ) : (
        <Users/>
      )}
    </>
  );
};

export default LeftBar;
