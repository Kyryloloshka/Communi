import { Button } from './ui/button'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/lib/firebase/firebase';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react';
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
    
    } className='flex items-center px-4 pt-2 pb-3 border-t border-dark-5'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant={"primary"} className='text-gray-500 mr-2 cursor-pointer'>file</Button>
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
      <Button onClick={() => {setShowEmoji(prev => !prev)}} variant={"primary"} className='text-gray-500 mr-2 cursor-pointer'>emoji</Button>
      {showEmoji && <div className="absolute bottom-[70px] right-4">
      <EmojiPicker onEmojiClick={handleEmojiCLick} />
      </div>}
      <input type="text" placeholder='Type a message' value={message} onChange={e => setMessage(e.target.value)} className='flex-1 py-2 px-3 outline-none border-none rounded-sm'/>
      <Button variant={"primary"} type="submit" className='text-gray-500 ml-2 cursor-pointer'>send</Button>
    </form>
  )
}

export default InputText