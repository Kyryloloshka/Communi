import React from "react";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SheetProfile from "../SheetProfile";
import SearchUsersByTag from "../SearchUsersByTag";
import SearchResultsComponent from "../SearchResultsComponent";
import Users from "../Users";
import { SelectedChatData } from "@/types";

const LeftBar = ({
  searchTag,
  user,
  setSearchTag,
  setSearchResults,
  setSelectedChat,
  searchResults,
  selectedChat,
}: {
  searchTag: string;
  user: any;
  setSearchTag: (tag: string) => void;
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
        <SearchUsersByTag
          searchTag={searchTag}
          setSearchTag={setSearchTag}
          setSearchResults={setSearchResults}
        />
      </div>
      {searchTag.length > 0 ? (
        <SearchResultsComponent
          setSearchTag={setSearchTag}
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
