import { formatFileSize, formatFileTitle } from '@/lib/utils';

const FilePreview = ({ file }: {file: {name: string, size: number}}) => (
  <div className="flex w-full justify-center">
    <div className="bg-dark-5 px-3 flex-auto py-2 max-w-[300px] rounded-lg flex gap-3 items-center">
      <div className="flex items-center justify-center bg-light-3 dark:bg-dark-3 rounded-full h-[45px] w-[45px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="26"
          height="26"
          className="rotate-180 left-[1px] relative"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path
            fill="#555"
            d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8l-6-6V4a2 2 0 0 1 2-2z"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm">{formatFileTitle(file.name)}</span>
        <span className={'text-sm font-light text-light-5/70'}>
          {formatFileSize(file.size)}
        </span>
      </div>
    </div>
  </div>
);

export default FilePreview;
