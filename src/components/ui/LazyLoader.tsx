'use client'

import { Suspense, lazy, ComponentType, useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'

interface LazyLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  minHeight?: string | number
  skeleton?: React.ReactNode
}

// Advanced loading skeleton component
export function LoadingSkeleton({ 
  variant = 'default',
  lines = 3,
  width = '100%',
  height = '20px',
  className = ''
}: {
  variant?: 'default' | 'card' | 'image' | 'text' | 'button'
  lines?: number
  width?: string | number
  height?: string | number
  className?: string
}) {
  const skeletonVariants = {
    loading: {
      opacity: [0.5, 1, 0.5]
    }
  }

  const shimmerVariants = {
    loading: {
      x: ['-100%', '100%']
    }
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={`bg-gray-800 rounded-lg p-6 space-y-4 ${className}`}
        variants={skeletonVariants}
        animate="loading"
      >
        <div className="relative overflow-hidden bg-gray-700 h-48 rounded-lg">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
            variants={shimmerVariants}
            animate="loading"
          />
        </div>
        <div className="space-y-3">
          <div className="relative overflow-hidden bg-gray-700 h-6 rounded">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
              variants={shimmerVariants}
              animate="loading"
            />
          </div>
          <div className="relative overflow-hidden bg-gray-700 h-4 rounded w-3/4">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
              variants={shimmerVariants}
              animate="loading"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  if (variant === 'image') {
    return (
      <motion.div
        className={`relative overflow-hidden bg-gray-800 rounded-lg ${className}`}
        style={{ width, height }}
        variants={skeletonVariants}
        animate="loading"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
          variants={shimmerVariants}
          animate="loading"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </motion.div>
    )
  }

  if (variant === 'button') {
    return (
      <motion.div
        className={`relative overflow-hidden bg-gray-800 rounded-lg px-6 py-3 ${className}`}
        style={{ width, height }}
        variants={skeletonVariants}
        animate="loading"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
          variants={shimmerVariants}
          animate="loading"
        />
      </motion.div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden bg-gray-800 rounded"
          style={{ 
            width: i === lines - 1 ? '60%' : width, 
            height 
          }}
          variants={skeletonVariants}
          animate="loading"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
            variants={shimmerVariants}
            animate="loading"
          />
        </motion.div>
      ))}
    </div>
  )
}

// Intersection observer based lazy loader
export function LazyLoader({
  children,
  fallback,
  minHeight = '200px',
  skeleton
}: LazyLoaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: true
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isInView && !isLoaded) {
      setIsLoaded(true)
    }
  }, [isInView, isLoaded])

  return (
    <div ref={ref} style={{ minHeight }}>
      <AnimatePresence mode="wait">
        {isLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Suspense fallback={fallback || <LoadingSkeleton />}>
              {children}
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {skeleton || fallback || <LoadingSkeleton />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }))
  
  return function WrappedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSkeleton variant="card" />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Progressive image loading component
interface ProgressiveImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  placeholder?: string
  blurDataURL?: string
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  onLoad,
  onError
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholder || blurDataURL)
  const ref = useRef<HTMLImageElement>(null)

  const loadImage = useCallback(() => {
    const img = new Image()
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
      onLoad?.()
    }
    img.onerror = () => {
      setIsError(true)
      onError?.()
    }
    img.src = src
  }, [src, onLoad, onError])

  useEffect(() => {
    if (priority) {
      loadImage()
    }
  }, [priority, loadImage])

  const isInView = useInView(ref, {
    once: true
  })

  useEffect(() => {
    if (isInView && !priority && !isLoaded && !isError) {
      loadImage()
    }
  }, [isInView, priority, isLoaded, isError, loadImage])

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <AnimatePresence mode="wait">
        {isError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full bg-gray-800 flex items-center justify-center rounded-lg"
          >
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 mx-auto mb-2 opacity-50">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm">画像を読み込めませんでした</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Placeholder/Blur */}
            {currentSrc && !isLoaded && (
              <motion.img
                src={currentSrc}
                alt=""
                className="w-full h-full object-cover filter blur-sm scale-110"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
            
            {/* Loading skeleton */}
            {!currentSrc && !isLoaded && (
              <LoadingSkeleton variant="image" width="100%" height="100%" />
            )}
            
            {/* Main image */}
            <motion.img
              src={src}
              alt={alt}
              className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                position: currentSrc ? 'absolute' : 'static',
                top: 0,
                left: 0
              }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: isLoaded ? 1 : 0,
                scale: isLoaded ? 1 : 1.1
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onLoad={() => {
                setIsLoaded(true)
                onLoad?.()
              }}
              onError={() => {
                setIsError(true)
                onError?.()
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Lazy video component
interface LazyVideoProps {
  src: string
  poster?: string
  width?: number | string
  height?: number | string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  onLoad?: () => void
}

export function LazyVideo({
  src,
  poster,
  width,
  height,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  onLoad
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(isLoaded ? ref : placeholderRef, {
    once: true
  })

  useEffect(() => {
    if (isInView && !isLoaded) {
      setIsLoaded(true)
    }
  }, [isInView, isLoaded])

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <AnimatePresence mode="wait">
        {isLoaded ? (
          <motion.video
            ref={ref}
            src={src}
            poster={poster}
            width={width}
            height={height}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            className="w-full h-full object-cover rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onLoadedData={() => {
              setIsLoaded(true)
              onLoad?.()
            }}
          />
        ) : (
          <motion.div
            ref={placeholderRef}
            className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {poster ? (
              <ProgressiveImage
                src={poster}
                alt="Video thumbnail"
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <p>動画を読み込み中...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}