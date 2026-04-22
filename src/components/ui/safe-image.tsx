'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { normalizeImageSrc } from '@/lib/images';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function SafeImage({ src, fallbackSrc = '/placeholder-product.svg', alt, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const finalSrc = !hasError ? normalizeImageSrc(src) : fallbackSrc;

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}