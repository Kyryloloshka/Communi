const ImagePreview = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="preview"
    className="mt-2 w-full max-h-[500px] overflow-hidden object-contain object-center"
  />
);

export default ImagePreview;
