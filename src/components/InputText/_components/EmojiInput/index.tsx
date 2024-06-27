import React, { useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import { Theme } from 'emoji-picker-react';

const EmojiInput = ({
  setMessage,
}: {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const handleEmojiCLick = (emoji: any) => {
    setMessage((prev: any) => prev + emoji.native);
  };
	
  return (
    <>
      <BsEmojiSmile
        onClick={() => {
          setShowEmoji((prev: boolean) => !prev);
        }}
        className="fill-primary-800 dark:fill-white hover:-translate-y-0.5 hover:fill-secondary-600 dark:hover:fill-primary-500  transition h-5 w-5 emoji-icon cursor-pointer mr-2 mb-[14px]"
      />
      {showEmoji && (
        <div className="absolute bottom-[70px] left-4 select-none">
          {/* <EmojiPicker theme={Theme.DARK} previewConfig={{showPreview: false, defaultCaption:""}} lazyLoadEmojis={true} className='text-sm emoji-picker' onEmojiClick={handleEmojiCLick} /> */}
          <Picker
            theme={Theme.DARK}
            data={emojiData}
            previewPosition="none"
            onEmojiSelect={handleEmojiCLick}
          />
        </div>
      )}
    </>
  );
};

export default EmojiInput;
