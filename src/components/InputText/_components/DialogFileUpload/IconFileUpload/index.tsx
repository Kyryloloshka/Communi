import { FiPaperclip } from 'react-icons/fi';

interface IconFileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<any>>;
  setImagePreview: React.Dispatch<React.SetStateAction<any>>;
  setVideoPreview: React.Dispatch<React.SetStateAction<any>>;
  setFilePreview: React.Dispatch<React.SetStateAction<any>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const IconFileUpload = ({
  setFile,
  setImagePreview,
  setVideoPreview,
  setFilePreview,
  setOpen,
}: IconFileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (file.type.includes('image')) {
          setImagePreview(reader.result);
        } else if (file.type.includes('video')) {
          setVideoPreview(reader.result);
        } else {
          setFilePreview(file);
        }
      };
      reader.readAsDataURL(file);
      setOpen(true);
    }
  };

  return (
    <div className="text-gray-500 mr-2 cursor-pointer py-3 pl-4">
      <label htmlFor="file-upload" className="cursor-pointer">
        <FiPaperclip className="file-clip" />
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default IconFileUpload;
