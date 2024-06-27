const VideoPreview = ({ src }: { src: string }) => (
  <video
    src={src}
    controls
    className="mt-2 w-full max-h-[500px] overflow-hidden object-contain object-center"
  />
);

export default VideoPreview;
