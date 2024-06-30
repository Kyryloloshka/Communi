import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/lib/firebase/firebase';
import { TypeAttached } from '@/types';

const useFileUpload = ({ onComplete }: { onComplete: () => void }) => {
  const storage = getStorage(app);
  const [uploadProgress, setUploadProgress] = useState<any>(null);

  const uploadFile = async (
    file: File,
    type: TypeAttached,
    sendMessage: (url?: string, type?: TypeAttached) => void,
  ) => {
    const storageRef = ref(storage, `${type}s/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        if (progress >= 100) {
          onComplete();
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress(null);
          sendMessage(downloadURL, type);
        });
      },
    );
  };

  return { uploadProgress, uploadFile };
};

export default useFileUpload;
