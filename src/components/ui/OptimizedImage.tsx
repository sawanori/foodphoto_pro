'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  fetchPriority?: 'high' | 'low' | 'auto'
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  fetchPriority = 'auto',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 画像フォーマットの最適化設定
  const imageFormats = ['image/avif', 'image/webp']

  // レスポンシブサイズの設定
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  // エラー時のフォールバック画像
  const fallbackSrc = '/images/placeholder.jpg'

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500 text-sm">画像を読み込めませんでした</span>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        quality={quality}
        sizes={defaultSizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : fetchPriority}
        decoding="async"
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        // Next.js 画像最適化の設定
        unoptimized={false}
      />
    </>
  )
}