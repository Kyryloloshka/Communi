import { Button } from "./ui/button";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/lib/firebase/firebase";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Theme } from "emoji-picker-react";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { FiPaperclip } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";

const InputText = ({
  sendMessage,
  message,
  setMessage,
}: {
  sendMessage: Function;
  message: string;
  setMessage: Function;
}) => {
  const storage = getStorage(app);
  const [file, setFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachment, setAttachment] = useState<any>(null);
  const textareaRef = useRef<any>(null);

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (file.type.includes("image")) {
        setImagePreview(reader.result);
      } else if (file.type.includes("video")) {
        setVideoPreview(reader.result);
      } else {
        setAttachment(file);
      }
    };
    reader.readAsDataURL(file);
    setOpen(true);
  };

  const handleUpload = async () => {
    if (!file) return;

    if (imagePreview) {
      const imageStorageRef = ref(storage, `images/${file.name}`);
      const imageUploadTask = uploadBytesResumable(imageStorageRef, file);

      imageUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(imageUploadTask.snapshot.ref).then((downloadURL) => {
            setAttachment(downloadURL);
            setUploadProgress(null);
            setImagePreview(null);
            setVideoPreview(null);
            setOpen(false);
            sendMessage(downloadURL, "image");
          });
        }
      );
    } else if (videoPreview) {
      const videoStorageRef = ref(storage, `videos/${file.name}`);
      const videoUploadTask = uploadBytesResumable(videoStorageRef, file);

      videoUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(videoUploadTask.snapshot.ref).then((downloadURL) => {
            setAttachment(downloadURL);
            setUploadProgress(null);
            setImagePreview(null);
            setVideoPreview(null);
            setOpen(false);
            sendMessage(downloadURL, "video");
          });
        }
      );
    } else {
      sendMessage(attachment, "file");
      setOpen(false);
      setAttachment(null);
      return;
    }
  };
  const handleCancelUpload = () => {
    setFile(null);
    setImagePreview(null);
    setVideoPreview(null);
    setOpen(false);
  };

  const handleEmojiCLick = (emoji: any) => {
    setMessage((prev: any) => prev + emoji.native);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
      className="flex items-end pb-1 border-t border-dark-5 relative"
    >
      <div className="text-gray-500 mr-2 cursor-pointer py-3 pl-4">
        <label htmlFor="file-upload" className="cursor-pointer">
          <FiPaperclip className="file-clip" />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-screen w-screen flex justify-center items-center bg-transparent p-2 sm:p-5">
          <div className="max-w-xl flex flex-col gap-3 flex-auto">
            <DialogTitle>Send</DialogTitle>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full mt-2 object-contain max-h-[600px] max-w-[500px] self-center"
              />
            )}
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-full mt-2 max-h-[600px] max-w-[500px] self-center"
              />
            )}
            {uploadProgress && (
              <progress value={uploadProgress} max="100"></progress>
            )}
            <div className="container-input">
              <input
                required={true}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 py-2 px-3 outline-none border-none"
              />
              <label>Description</label>
              <i></i>
            </div>
            <div className="flex gap-3 justify-between">
              <Button variant={"gray"} onClick={handleCancelUpload}>
                Cancel
              </Button>
              <Button variant={"primary"} onClick={handleUpload}>
                Send
              </Button>
            </div>
          </div>
          <DialogClose
            onClick={handleCancelUpload}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <BsEmojiSmile
        onClick={() => {
          setShowEmoji((prev) => !prev);
        }}
        className="fill-white hover:-translate-y-0.5 hover:fill-primary-500  transition h-5 w-5 emoji-icon cursor-pointer mr-2 mb-[14px]"
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
      <Textarea
        ref={textareaRef}
        placeholder="Type a message"
        rows={1}
        style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${textareaRef?.current.scrollHeight}px`;
        }}
        className="flex-1 py-2 px-3 mt-1.5 mb-1.5 outline-none border-none resize-none scroll-none max-h-[200px] bg-dark-2 max-w-full"
        onKeyDown={handleKeyDown}
      />
      <button className="button-send pr-3 pb-[10px]" type="submit">
        <div className="button-send-svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
      </button>
    </form>
  );
};

export default InputText;
