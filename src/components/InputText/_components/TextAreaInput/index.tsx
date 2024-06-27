import { Textarea } from '@/components/ui/textarea';
import React, { useRef } from 'react';

interface TextAreaInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: Function;
}

const TextAreaInput = ({
  message,
  setMessage,
  sendMessage,
}: TextAreaInputProps) => {
  const ref = useRef<any>();
  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      ref.current.style.height = 'auto';
    }
  };
  return (
    <Textarea
      ref={ref}
      placeholder="Type a message"
      rows={1}
      style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
        if (!ref.current) return;
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }}
      className="flex-1 py-2 px-3 mt-1.5 mb-1.5 outline-none border-none resize-none scroll-none focus:outline-none focus-visible:ring-0  max-h-[200px] bg-light-2 dark:bg-dark-2 max-w-full"
      onKeyDown={handleKeyDown}
    />
  );
};

export default TextAreaInput;
