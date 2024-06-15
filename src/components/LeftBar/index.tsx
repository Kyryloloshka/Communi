import React from "react";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SheetProfile from "../SheetProfile";
import SearchUsersInput from "../SearchUsersInput";
import SearchResultsComponent from "../SearchResultsComponent";
import Users from "../Users";
import { SelectedChatData } from "@/types";

const LeftBar = ({
  searchKey,
  user,
  setSearchKey,
  setSearchResults,
  setSelectedChat,
  searchResults,
  selectedChat,
}: {
  searchKey: string;
  user: any;
  setSearchKey: (tag: string) => void;
  setSearchResults: (results: any) => void;
  setSelectedChat: (chat: SelectedChatData) => void;
  searchResults: any;
  selectedChat: SelectedChatData | null;
}) => {
  return (
    <>
      <div className="h-12 w-full flex items-center gap-2 p-3">
        <Sheet>
          <SheetTrigger>
            <div className="burger"></div>
          </SheetTrigger>
          <SheetProfile user={user} />
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
          setSelectedChat={setSelectedChat}
          userData={user}
          loading={false}
          searchResults={searchResults}
        />
      ) : (
        <Users
          userData={user}
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      )}
    </>
  );
};

export default LeftBar;
