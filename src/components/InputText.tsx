import { Button } from './ui/button'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/lib/firebase/firebase';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react';
import { Input } from './ui/input';
import { FiPaperclip } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';


const InputText = ({ sendMessage, message, setMessage, image, setImage }: { sendMessage: Function, message: string, setMessage: Function, image: string, setImage: Function }) => {
  const storage = getStorage(app);
  const [file, setFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);
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
      })
    })
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
    
    } className='flex items-center pb-1 border-t border-dark-5'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className='text-gray-500 mr-2 cursor-pointer py-3 pl-4'>
            <FiPaperclip className='file-clip'/>
          </div>
        </DialogTrigger>
        
        <DialogContent>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            <input type="file" onChange={handleFileChange} />
            <Button variant={"primary"} onClick={handleUpload}>Upload</Button>
            {imagePreview && <img src={imagePreview} alt="preview" className='w-full mt-2' />}
            {uploadProgress && <progress value={uploadProgress} max="100"></progress>}
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <BsEmojiSmile onClick={() => {setShowEmoji(prev => !prev)}} className='fill-white hover:-translate-y-0.5 hover:fill-primary-500 my-3 ml-1.5 transition h-5 w-5 emoji-icon cursor-pointer '/>
      {showEmoji && <div className="absolute bottom-[70px] right-4">
      <EmojiPicker onEmojiClick={handleEmojiCLick} />
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