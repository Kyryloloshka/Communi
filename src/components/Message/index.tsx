"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { IMessage } from "@/types";
import FileLink from "../FileLink";
import { useRouter } from "next/navigation";

export const getValidTime = (time: any) => {
  const date = new Date(time * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

function Message({
  message,
  myUser,
  otherUser,
}: {
  message: IMessage;
  myUser: any;
  otherUser: any;
}) {
	const router = useRouter();
  const dalayForGroup = 120;
  const isCurrentUser = message.senderId === myUser.id;

  const isFirstInGroup =
    message.previousMessage?.senderId !== message.senderId ||
    Math.abs(message.previousMessage?.time?.seconds - message.time?.seconds) >
      dalayForGroup;

  const isLastInGroup =
    message.nextMessage?.senderId !== message.senderId ||
    Math.abs(message.nextMessage?.time?.seconds - message.time?.seconds) >
      dalayForGroup;

  const [open, setOpen] = useState<boolean | undefined>(undefined);
	const handleUserClick = (userId: string) => {
    router.push(`/?userId=${userId}`);
  };
  return (
    <div
      key={message.id}
      className={`flex relative ${
        isCurrentUser ? "justify-end" : "justify-start"
      } ${isLastInGroup && "mb-1.5"}`}
    >
      {!isCurrentUser && (
        <div className={`w-8 h-8 mr-2 self-end aspect-square cursor-pointer`}>
          {isLastInGroup && (
            <img
              src={otherUser.avatarUrl}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
      )}
      <div
        className={`text-light-1 max-w-[400px] overflow-hidden relative flex flex-col flex-wrap ${
          isCurrentUser
            ? "bg-dark-5 self-end  rounded-l-xl"
            : "bg-dark-5 rounded-r-xl self-start"
        } rounded-sm ${isFirstInGroup && "rounded-t-xl"} ${
          isLastInGroup &&
          (isCurrentUser ? "rounded-br-none" : "rounded-bl-none")
        }`}
      >
        {!isCurrentUser && isFirstInGroup && (
          <button
						type="button"
						onClick={() => handleUserClick(otherUser.id)}
            className={`text-left text-primary-500 px-2 leading-[1em] pt-1.5`}
          >
            {message.senderName}
          </button>
        )}
        {message.image && (
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <div
                className={`relative overflow-hidden max-w-[400px] object-cover max-h-[400px] cursor-pointer  ${
                  isFirstInGroup && !isCurrentUser && "mt-1.5"
                }`}
              >
                <img
                  src={message.image}
                  alt="image"
                  className={`object-cover`}
                />
              </div>
            </DialogTrigger>
            <DialogContent
              onClick={() => setOpen(false)}
              className={`h-screen flex justify-center items-center w-screen outline-none ring-none border-none`}
            >
              <img
                src={message.image}
                alt="image"
                className={`max-h-screen px-10 object-contain flex-grow max-w-screen transition-none`}
              />
            </DialogContent>
          </Dialog>
        )}
        {message.video && (
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <div
                className={`w-full relative object-center overflow-hidden max-h-[500px] cursor-pointer ${
                  isFirstInGroup && !isCurrentUser && "mt-1.5"
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <video
                  src={message.video}
                  className={`object-cover w-full h-full`}
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="h-screen flex justify-center items-center  outline-none ring-none border-none">
              <div
                onClick={() => setOpen(false)}
                className="fixed bg-transparent left-0 top-0 h-screen w-screen z-0"
              ></div>
              <video
                src={message.video}
                autoPlay={true}
                controls
                className={`max-h-screen object-contain flex-grow max-w-[calc(100vw-100px)] transition-none outline-none`}
              />
            </DialogContent>
          </Dialog>
        )}
        {message.file && <FileLink fileUrl={message.file} />}
        {message.text.trim() && (
          <p
            style={{ wordBreak: "break-word" }}
            className={`px-2 pb-2  ${
              (!isCurrentUser && isFirstInGroup) || message.file
                ? "pt-0"
                : "pt-1.5"
            } leading-[1em]`}
          >
            <span className="break-words text-sm">{message.text.trim()}</span>
            <span className="inline-block w-[37px]">{""}</span>
          </p>
        )}
        <div
          className={`text-xs absolute bottom-1 text-gray-400 right-0 ${
            isCurrentUser && "self-end"
          } px-2`}
        >
          {getValidTime(message.time)}
        </div>
      </div>
    </div>
  );
}

export default Message;
