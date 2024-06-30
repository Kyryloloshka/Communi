import Image from '@/components/Image';

const ImagePreview = ({ src }: { src: string }) => (
  <Image
    height={500}
    width={500}
    src={src}
    alt="preview"
    className="mt-2 w-full max-h-[500px] overflow-hidden object-contain object-center"
  />
);

export default ImagePreview;
