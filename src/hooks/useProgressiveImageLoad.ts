import { useState, useEffect, useRef } from 'react'

interface UseProgressiveImageLoadOptions {
  src: string
  placeholderSrc?: string
  rootMargin?: string
  threshold?: number
}

export function useProgressiveImageLoad({
  src,
  placeholderSrc,
  rootMargin = '50px',
  threshold = 0.01,
}: UseProgressiveImageLoadOptions) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '')
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  useEffect(() => {
    if (!isInView) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setIsLoading(false)
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, isInView])

  return {
    imageSrc,
    isLoading,
    imgRef,
    isInView,
  }
}