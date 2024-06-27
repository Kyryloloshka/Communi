import ButtonSubmit from './_components/ButtonSubmit';
import TextAreaInput from './_components/TextAreaInput';
import EmojiInput from './_components/EmojiInput';
import DialogFileUpload from './_components/DialogFileUpload';
import { TypeAttached } from '@/types/index';

const InputText = ({
  sendMessage,
  message,
  setMessage,
}: {
  sendMessage: (url?: string, type?: TypeAttached) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
      className="flex items-end pb-1 border-t border-primary-500/80 dark:border-dark-5 relative"
    >
      <DialogFileUpload
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
      <EmojiInput setMessage={setMessage} />
      <TextAreaInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
      <ButtonSubmit />
    </form>
  );
};

export default InputText;
