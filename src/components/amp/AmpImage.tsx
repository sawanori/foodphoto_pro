'use client'

import Image from 'next/image'

interface AmpImageProps {
  src: string
  width: number
  height: number
  alt: string
  layout?: 'responsive' | 'fixed' | 'fixed-height' | 'fill' | 'intrinsic'
  className?: string
}

export default function AmpImage({ 
  src, 
  width, 
  height, 
  alt, 
  layout = 'responsive',
  className = ''
}: AmpImageProps) {
  // Since Next.js App Router doesn't support AMP directly,
  // we'll use the optimized Next.js Image component
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
      loading="lazy"
      quality={85}
    />
  )
}