import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import useFileUpload from '@/hooks/useFileUpload';
import { TypeAttached } from '@/types';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import FilePreview from './FilePreview';
import Description from './Descriptiion';
import IconFileUpload from './IconFileUpload';
import { Progress } from '@/components/ui/progress';

interface DialogFileUploadProps {
  message: string;
  sendMessage: (url?: string, type?: TypeAttached) => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const DialogFileUpload = ({
  message,
  sendMessage,
  setMessage,
}: DialogFileUploadProps) => {
  const [file, setFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const { uploadProgress, uploadFile } = useFileUpload({
    onComplete: () => {
      setOpen(false);
      setImagePreview(null);
      setVideoPreview(null);
      setFilePreview(null);
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    if (imagePreview) {
      await uploadFile(file, 'image', sendMessage);
    } else if (videoPreview) {
      await uploadFile(file, 'video', sendMessage);
    } else {
      await uploadFile(file, 'file', sendMessage);
    }
  };

  const handleCancelUpload = () => {
    setFile(null);
    setImagePreview(null);
    setVideoPreview(null);
    setFilePreview(null);
    setOpen(false);
  };

  return (
    <>
      <IconFileUpload
        setImagePreview={setImagePreview}
        setOpen={setOpen}
        setVideoPreview={setVideoPreview}
        setFile={setFile}
        setFilePreview={setFilePreview}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-3 md:p-6 flex justify-center items-center bg-transparent">
          <div className="relative overflow-hidden max-w-[600px] flex flex-col gap-3 flex-auto">
            <DialogTitle>Send</DialogTitle>
            {imagePreview && <ImagePreview src={imagePreview} />}
            {videoPreview && <VideoPreview src={videoPreview} />}
            {filePreview && <FilePreview file={filePreview} />}
            {uploadProgress && (
              <Progress value={uploadProgress} className="w-full"></Progress>
            )}
            <Description
              message={message}
              setMessage={setMessage}
              handleUpload={handleUpload}
            />
            <div className="flex gap-3 justify-between">
              <Button variant={'gray'} onClick={handleCancelUpload}>
                Cancel
              </Button>
              <Button variant={'primary'} onClick={handleUpload}>
                Send
              </Button>
            </div>
          </div>
          <DialogClose
            onClick={handleCancelUpload}
            className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogFileUpload;
