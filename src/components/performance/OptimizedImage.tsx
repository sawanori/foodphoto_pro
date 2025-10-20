'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [webpSupported, setWebpSupported] = useState(false)
  const [avifSupported, setAvifSupported] = useState(false)
  
  // Use webp and avif support flags for future format optimization
  console.log('Format support:', { webpSupported, avifSupported })

  // Check for modern format support
  useEffect(() => {
    const checkWebpSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const dataURL = canvas.toDataURL('image/webp')
      return dataURL.indexOf('image/webp') === 5
    }

    const checkAvifSupport = () => {
      const avif = new window.Image()
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMgwi8D2KAAAmzAClLRUAClKgALAzEe4='
      return avif.complete && avif.naturalHeight !== 0
    }

    setWebpSupported(checkWebpSupport())
    setAvifSupported(checkAvifSupport())
  }, [])

  // Generate optimized src based on format support
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return originalSrc
    }

    // If using external CDN, return as-is
    if (originalSrc.startsWith('http')) {
      return originalSrc
    }

    // For local images, Next.js Image component handles optimization
    return originalSrc
  }

  // Generate blur data URL if not provided
  const generateBlurDataURL = (w = 8, h = 8) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6' // Light gray
      ctx.fillRect(0, 0, w, h)
    }
    return canvas.toDataURL()
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-200 text-gray-500',
          className
        )}
        style={{ width, height }}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
    )
  }

  const imageProps = {
    src: getOptimizedSrc(src),
    alt,
    className: cn(
      'transition-opacity duration-300',
      isLoaded ? 'opacity-100' : 'opacity-0',
      className
    ),
    quality,
    onLoad: handleLoad,
    onError: handleError,
    ...(fill ? { fill: true } : { width, height }),
    ...(priority ? { priority: true } : { loading }),
    ...(placeholder === 'blur' ? {
      placeholder: 'blur' as const,
      blurDataURL: blurDataURL || generateBlurDataURL()
    } : {}),
    sizes,
  }

  return (
    <div className={cn('relative', !fill && 'inline-block')}>
      <Image {...imageProps} alt={alt} />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse',
            'bg-[length:400%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'
          )}
          style={fill ? {} : { width, height }}
        />
      )}
    </div>
  )
}

// Progressive Image Component with intersection observer
export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  ...props
}: OptimizedImageProps & { lowQualitySrc?: string }) {
  const [inView, setInView] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    const imgElement = document.createElement('div')
    observer.observe(imgElement)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (inView && lowQualitySrc && currentSrc === lowQualitySrc) {
      const img = new window.Image()
      img.onload = () => setCurrentSrc(src)
      img.src = src
    }
  }, [inView, src, lowQualitySrc, currentSrc])

  return <OptimizedImage {...props} src={currentSrc} alt={alt} />
}

// Critical Image Component (for above-the-fold images)
export function CriticalImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      loading="eager"
      placeholder="empty"
    />
  )
}

// Lazy Image Component with enhanced lazy loading
export function LazyImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={false}
      loading="lazy"
      placeholder="blur"
    />
  )
}