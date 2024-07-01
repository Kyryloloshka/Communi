import Image from "@/components/Image";
import { User } from "@/types";
import React from "react";

const SelectedUsers = ({selectedUsers}: {selectedUsers: User[]}) => {
  return selectedUsers.length > 0 && (
    <div className="flex gap-2 flex-wrap">
      {selectedUsers.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-2 bg-light-4 dark:bg-dark-3 px-2 py-1 rounded-lg"
        >
          <Image
            width={24}
            height={24}
            src={user.avatarUrl}
            alt={user.name}
            className="h-6 w-6 rounded-full"
          />
          <div className="whitespace-nowrap">{user.name}</div>
        </div>
      ))}
    </div>
  )
};

export default SelectedUsers;