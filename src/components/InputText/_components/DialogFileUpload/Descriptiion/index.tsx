import React from 'react';

interface DescriptionProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleUpload: () => void;
}

const Description = ({
  message,
  setMessage,
  handleUpload,
}: DescriptionProps) => {
  return (
    <div className="container-input">
      <input
        required={true}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 py-2 px-3 outline-none border-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleUpload();
          }
        }}
      />
      <label>Description</label>
      <i></i>
    </div>
  );
};

export default Description;
