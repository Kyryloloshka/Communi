import { Button } from './ui/button'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/lib/firebase/firebase';
import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Input } from './ui/input';
import { FiPaperclip } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';


const InputText = ({ sendMessage, message, setMessage }: { sendMessage: Function, message: string, setMessage: Function }) => {
  const storage = getStorage(app);
  const [file, setFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState<any>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);
    setOpen(true);
  }

  const handleUpload = async () => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress);
    }, (error) => {
      console.log(error);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImage(downloadURL);
        setUploadProgress(null);
        setImagePreview(null);
        setOpen(false);
        sendMessage(downloadURL);
      })
    })
  }
  const handleCancelUpload = () => {
    setFile(null);
    setImagePreview(null);
    setOpen(false);
  }

  const handleEmojiCLick = (emoji: any, event: any) => {
    setMessage((prev: any) => prev + emoji.emoji);
  }

  return (
    <form onSubmit={
      (e) => {
        e.preventDefault();
        sendMessage();
      }
    
    } className='flex items-center pb-1 border-t border-dark-5 relative'>
      <div className='text-gray-500 mr-2 cursor-pointer py-3 pl-4'>
        <label htmlFor="file-upload" className="cursor-pointer">
          <FiPaperclip className='file-clip' />
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='h-screen w-screen flex justify-center items-center bg-transparent p-5' >
          <div className="max-w-xl flex flex-col gap-3 flex-auto">
            <DialogTitle>Send Image</DialogTitle>
            {imagePreview && <img src={imagePreview} alt="preview" className='w-full mt-2 object-contain max-h-[500px] max-w-[300px] self-center' />}
            {uploadProgress && <progress value={uploadProgress} max="100"></progress>}
            <div className="container-input">
              <input required={true} type="text" value={message} onChange={e => setMessage(e.target.value)} className='flex-1 py-2 px-3 outline-none border-none'/>
              <label>Description</label>
              <i></i>
            </div>
            <div className="flex gap-3 justify-between">
              <Button variant={"gray"} onClick={handleCancelUpload}>Cancel</Button>
              <Button variant={"primary"} onClick={handleUpload}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <BsEmojiSmile onClick={() => {setShowEmoji(prev => !prev)}} className='fill-white hover:-translate-y-0.5 hover:fill-primary-500  transition h-5 w-5 emoji-icon cursor-pointer '/>
      {showEmoji && <div className="absolute bottom-[70px] left-4">
        <EmojiPicker theme={Theme.DARK} previewConfig={{showPreview: false, defaultCaption:""}} lazyLoadEmojis={true} className='text-sm emoji-picker' onEmojiClick={handleEmojiCLick} />
      </div>}
      <Input type="text" placeholder='Type a message' value={message} onChange={e => setMessage(e.target.value)} className='flex-1 py-2 px-3 outline-none border-none'/>
      <button className='button-send p-3' type="submit">
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
  )
}

export default InputText