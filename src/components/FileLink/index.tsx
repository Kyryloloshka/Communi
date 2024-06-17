"use client";
import { formatFileSize, formatFileTitle } from "@/lib/utils";
import { getMetadata, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const FileLink = ({ fileUrl }: { fileUrl: string }) => {
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState("");

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, fileUrl);
        const metadata = await getMetadata(fileRef);

        setFileName(formatFileTitle(metadata.name));
        setFileSize(formatFileSize(metadata.size));
      } catch (error) {
        console.error("Error fetching file metadata:", error);
      }
    };

    fetchMetadata();
  }, [fileUrl]);

  return (
    <a href={fileUrl} download className="flex w-full justify-center">
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
          <span className="text-sm">{fileName}</span>
          <span className={"text-sm font-light text-light-5/70"}>
            {fileSize}
          </span>
        </div>
      </div>
    </a>
  );
};

export default FileLink;
