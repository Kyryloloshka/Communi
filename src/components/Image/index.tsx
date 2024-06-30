import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
}

const Image = ({ src, alt, ...props }: ImageProps) => {
  const isSvg = src.endsWith('.svg') || src.includes('ui-avatars.com');

  if (isSvg) {
    return <img src={src} alt={alt} {...props} />;
  }

  return <NextImage src={src} alt={alt} {...props} />;
};

export default Image;
