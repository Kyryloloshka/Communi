import React from "react";
import { getValidTime } from "@/components/Message";
import { ChatData, ChatType } from "@/types";


const UserCard = ({
  name,
  avatarUrl,
  latestMessage,
  type,
  isSelected,
}: ChatData) => {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-1.5 bg-dark-1 hover:bg-dark-4/70 transition w-full cursor-pointer ${
        isSelected && "bg-dark-3"
      }`}
    >
      <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
      <div className="flex flex-col w-full">
        <div className="flex gap-1">
          {type === ChatType.Group && (
            <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">
              icoG
            </span>
          )}
          {type === ChatType.Channel && (
            <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">
              icoC
            </span>
          )}
          <div
            className="grid items-center gap-1 flex-auto"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <div className="whitespace-nowrap overflow-hidden truncate">
              <span title={name}>{name}</span>
            </div>
            {latestMessage && latestMessage.time && (
              <span className="text-muted-foreground text-xs pt-[3px]">
                {getValidTime(latestMessage.time)}
              </span>
            )}
          </div>
        </div>
        {latestMessage && (
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="whitespace-nowrap overflow-hidden truncate text-sm text-light-5/50">
              {latestMessage.text && (
                <span title={latestMessage.text}>{latestMessage.text}</span>
              )}
              {latestMessage.image && <span>Image</span>}
              {latestMessage.video && <span>Video</span>}
              {latestMessage.file && <span>File</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;