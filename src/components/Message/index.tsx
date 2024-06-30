'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { IMessage } from '@/types';
import FileLink from '../FileLink';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getValidTime } from '@/lib/utils';
import useFetchUser from '@/hooks/useFetchUser';
import { useStateSelector } from '@/state';
import Image from '@/components/Image';

interface MessageProps {
  message: IMessage;
}

function Message({ message }: MessageProps) {
  const router = useRouter();
  const delayForGroup = 120;
  const myUser = useStateSelector((state) => state.auth.myUser);
  const isCurrentUser = myUser ? message.senderId === myUser.id : false;
  const sender = useFetchUser(message.senderId);

  const isFirstInGroup =
    message.previousMessage?.senderId !== message.senderId ||
    Math.abs(message.previousMessage?.time?.seconds - message.time?.seconds) >
      delayForGroup;

  const isLastInGroup =
    message.nextMessage?.senderId !== message.senderId ||
    Math.abs(message.nextMessage?.time?.seconds - message.time?.seconds) >
      delayForGroup;

  const [open, setOpen] = useState<boolean | undefined>(undefined);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleUserClick = (userId: string | undefined) => {
    if (!userId) return;
    router.push(`/?userId=${userId}`);
  };

  useEffect(() => {
    if (!myUser) return;
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const firestore = getFirestore();
          const messageDocRef = doc(firestore, 'messages', message.id);
          await updateDoc(messageDocRef, { [`read.${myUser.id}`]: true });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [message.id, myUser?.id, myUser]);

  return (
    <div
      key={message.id}
      className={`flex relative ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      } ${isLastInGroup && 'mb-1.5'}`}
      ref={messageRef}
    >
      {!isCurrentUser && (
        <div
          onClick={() => handleUserClick(message.senderId)}
          className={`w-8 h-8 mr-2 self-end aspect-square cursor-pointer`}
        >
          {isLastInGroup && sender && (
            <Image
              width={32}
              height={32}
              src={sender.avatarUrl}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
      )}
      <div
        className={`text-light-1 max-w-[400px] overflow-hidden relative flex flex-col flex-wrap bg-light-4 dark:bg-dark-5 ${
          isCurrentUser ? 'self-end  rounded-l-xl' : 'rounded-r-xl self-start'
        } rounded-sm ${isFirstInGroup && 'rounded-t-xl'} ${
          isLastInGroup &&
          (isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none')
        }`}
      >
        {!isCurrentUser && isFirstInGroup && (
          <button
            type="button"
            onClick={() => handleUserClick(message.senderId)}
            className={`text-left text-secondary-500 dark:text-primary-500 px-2 leading-[1em] pt-1.5`}
          >
            {sender?.name}
          </button>
        )}
        {message.image && (
          <Dialog open={open}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <div
                className={`relative overflow-hidden max-w-[400px] object-cover max-h-[400px] cursor-pointer  ${
                  isFirstInGroup && !isCurrentUser && 'mt-1.5'
                }`}
              >
                <Image
                  width={400}
                  height={400}
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
              <Image
                src={message.image}
                alt="image"
                width={400}
                height={400}
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
                  isFirstInGroup && !isCurrentUser && 'mt-1.5'
                }`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <video
                  src={message.video}
                  className={`object-cover w-full h-full`}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
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
            style={{ wordBreak: 'break-word' }}
            className={`px-2 pb-2 text-dark-3 dark:text-white ${
              (!isCurrentUser && isFirstInGroup) || message.file
                ? 'pt-0'
                : 'pt-1.5'
            } leading-[1em]`}
          >
            <span className="break-words text-sm">{message.text.trim()}</span>
            <span className="inline-block w-[37px]">{''}</span>
          </p>
        )}
        <div
          className={`text-xs absolute bottom-1 text-gray-400 right-0 ${
            isCurrentUser && 'self-end'
          } px-2`}
        >
          {getValidTime(message.time)}
        </div>
      </div>
    </div>
  );
}

export default Message;
