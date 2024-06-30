import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
}

const Image = ({ src, alt, ...props }: ImageProps) => {
  if (!src || !alt) return null;
  const isSvg = src.endsWith('.svg') || src.includes('ui-avatars.com');

  if (isSvg) {
    return (
      <img
        src={src}
        alt={alt}
        className={props.className}
        style={props.style}
      />
    );
  }

  return <NextImage src={src} alt={alt} {...props} />;
};

export default Image;
