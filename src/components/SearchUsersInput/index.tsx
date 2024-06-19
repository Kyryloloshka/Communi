import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import searchUsers from "@/lib/api/search";
import { useActionCreators, useStateSelector } from "@/state";
import { searchActions } from "@/state/slices/search";

const SearchUsersInput = () => {
  const searchKey = useStateSelector((state) => state.search.searchKey);
  const myUserData = useStateSelector((state) => state.auth.myUser);
  const actions = useActionCreators(searchActions);
  
  useEffect(() => {
    if (!searchKey || !myUserData) return;
    const setSearchResults = actions.setSearchResults;
    searchUsers({ setSearchResults, searchKey, myUserData });
  }, [searchKey]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search users by tag"
        value={searchKey}
        className="py-1.5 bg-light-4 dark:bg-dark-4 dark:placeholder:text-light-6/40 outline-none border-none placeholder:font-light px-5 rounded-full overflow-hidden min-w-0 text-sm"
        onChange={(e) => actions.setSearchKey(e.target.value)}
      />
    </div>
  );
};

export default SearchUsersInput;
