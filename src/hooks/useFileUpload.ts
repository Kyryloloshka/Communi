import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/lib/firebase/firebase';
import { TypeAttached } from '@/types';

const useFileUpload = () => {
  const storage = getStorage(app);
  const [uploadProgress, setUploadProgress] = useState<any>(null);

  const uploadFile = (
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
      },
      (error) => {
        console.log(error);
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
