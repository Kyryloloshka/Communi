import { useEffect, useRef } from 'react';
import InputText from '../InputText';
import Message from '../Message';
import Header from './_components/Header';
import { useStateSelector } from '@/state';
import useUserStatus from '@/hooks/useUserStatus';
import useChatMessages from '@/hooks/useChatMessages';
import useSendMessage from '@/hooks/useSendMessage';

const Chat = () => {
  const selectedChat = useStateSelector((state) => state.auth.selectedChat);
  const myUser = selectedChat ? selectedChat.myData : null;
  const otherUser = selectedChat ? selectedChat.otherData : null;
  const chatRoomId = selectedChat ? selectedChat.id : null;
  const chatContainerRef = useRef<any>(null);
  const { message, setMessage, sendMessage } = useSendMessage(
    myUser,
    otherUser,
    chatRoomId,
  );

  const messages = useChatMessages(chatRoomId);
  const userStatus = useUserStatus(otherUser ? otherUser.id : null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <>
      {selectedChat === undefined || selectedChat === null ? (
        <div className="flex-1 h-full flex items-center justify-center text-lg font-light text-light-6/50 select-none">
          Select a chat to start messaging
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <Header userStatus={userStatus} />
          {messages.length === 0 ? (
            <div className="flex-1 h-full flex items-center justify-center text-lg font-light text-light-6/50 select-none">
              Say hello to {otherUser?.name}
            </div>
          ) : (
            <div
              ref={chatContainerRef}
              className="flex-1 flex flex-col gap-0.5 overflow-y-auto p-5 flex-end"
            >
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  myUser={myUser}
                  otherUser={otherUser}
                />
              ))}
            </div>
          )}
          <InputText
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage}
          />
        </div>
      )}
    </>
  );
};

export default Chat;
