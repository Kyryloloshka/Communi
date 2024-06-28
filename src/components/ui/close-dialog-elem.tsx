import React from 'react';

const CloseDialogElem = (props: any) => {
  return (
    <div
      {...props}
      className="absolute cursor-pointer top-2 right-2 w-5 h-5 group"
    >
      <div className="h-[2px] transition absolute top-1/2 w-5 rotate-45 bg-neutral-400 group-hover:bg-light-6"></div>
      <div className="h-[2px] transition absolute top-1/2 w-5 -rotate-45 bg-neutral-400 group-hover:bg-light-6"></div>
    </div>
  );
};

export default CloseDialogElem;
