import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import searchUsers from "@/lib/api/search";

const SearchUsersInput = ({
  setSearchResults,
  searchKey,
  setSearchKey,
  myUserData
}: any) => {
  useEffect(() => {
    searchUsers({ setSearchResults, searchKey, myUserData });
  }, [searchKey]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search users by tag"
        value={searchKey}
        className="py-1.5 bg-dark-4 placeholder:text-light-6/40 outline-none border-none placeholder:font-light px-5 rounded-full overflow-hidden min-w-0 text-sm"
        onChange={(e) => setSearchKey(e.target.value)}
      />
    </div>
  );
};

export default SearchUsersInput;
