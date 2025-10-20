/**
 * Advanced Image Optimization and Lazy Loading Utilities
 */

/**
 * Initialize Intersection Observer for advanced lazy loading
 */
export function initAdvancedLazyLoading() {
  if (typeof window === 'undefined') return

  // Create intersection observer with root margin for preloading
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          
          // Load the image
          if (img.dataset.src) {
            // Preload the image before setting src
            const imageLoader = new Image()
            imageLoader.onload = () => {
              img.src = img.dataset.src!
              img.removeAttribute('data-src')
              img.classList.add('loaded')
            }
            imageLoader.src = img.dataset.src
          }
          
          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset
            img.removeAttribute('data-srcset')
          }
          
          // Stop observing this image
          imageObserver.unobserve(img)
        }
      })
    },
    {
      // Start loading 50px before the image enters viewport
      rootMargin: '50px 0px',
      threshold: 0.01
    }
  )

  // Observe all lazy-load images
  const lazyImages = document.querySelectorAll('img[data-src]')
  lazyImages.forEach((img) => imageObserver.observe(img))
  
  return imageObserver
}

/**
 * Progressive Image Loading
 * Load low quality placeholder first, then high quality
 */
export function initProgressiveImageLoading() {
  if (typeof window === 'undefined') return

  const images = document.querySelectorAll('img[data-progressive]')
  
  images.forEach((img: Element) => {
    const htmlImg = img as HTMLImageElement
    const highQualitySrc = htmlImg.dataset.progressive
    
    if (!highQualitySrc) return
    
    // Create a new image element to load high quality version
    const highQualityImage = new Image()
    
    highQualityImage.onload = () => {
      // Apply high quality image with fade effect
      htmlImg.style.transition = 'filter 0.3s'
      htmlImg.style.filter = 'blur(0)'
      htmlImg.src = highQualitySrc
      htmlImg.removeAttribute('data-progressive')
    }
    
    // Start with blur effect on low quality
    htmlImg.style.filter = 'blur(5px)'
    
    // Load high quality version
    highQualityImage.src = highQualitySrc
  })
}

/**
 * Adaptive Loading based on connection speed
 */
export function getImageQualityBasedOnConnection(): number {
  if (typeof window === 'undefined') return 85

  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection

  if (!connection) return 85

  // Adjust quality based on effective connection type
  switch (connection.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 60
    case '3g':
      return 75
    case '4g':
      return 85
    default:
      return 85
  }
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(imageUrls: string[]) {
  if (typeof window === 'undefined') return

  imageUrls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    
    // Add different image formats for modern browsers
    if (url.includes('.jpg') || url.includes('.jpeg')) {
      link.type = 'image/jpeg'
    } else if (url.includes('.png')) {
      link.type = 'image/png'
    } else if (url.includes('.webp')) {
      link.type = 'image/webp'
    }
    
    document.head.appendChild(link)
  })
}

/**
 * Native lazy loading with fallback
 */
export function supportsNativeLazyLoading(): boolean {
  if (typeof window === 'undefined') return false
  
  return 'loading' in HTMLImageElement.prototype
}

/**
 * Initialize all image optimizations
 */
export function initImageOptimizations() {
  if (typeof window === 'undefined') return

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  function init() {
    // Use native lazy loading if supported, otherwise use Intersection Observer
    if (!supportsNativeLazyLoading()) {
      initAdvancedLazyLoading()
    }
    
    // Initialize progressive image loading
    initProgressiveImageLoading()
    
    // Preload hero images
    const heroImages = [
      'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg',
      'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2032.jpg',
      'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_2%202.jpg'
    ]
    preloadCriticalImages(heroImages)
  }
}

/**
 * Generate responsive image sizes
 */
export function generateImageSizes(baseWidth: number): string {
  const sizes = [
    `(max-width: 640px) ${Math.round(baseWidth * 0.9)}px`,
    `(max-width: 768px) ${Math.round(baseWidth * 0.8)}px`,
    `(max-width: 1024px) ${Math.round(baseWidth * 0.7)}px`,
    `${baseWidth}px`
  ]
  return sizes.join(', ')
}

/**
 * Convert image URL to optimized format
 */
export function getOptimizedImageUrl(url: string, format: 'webp' | 'avif' = 'webp'): string {
  if (typeof window === 'undefined') return url
  
  // Check browser support
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return url
  
  try {
    const dataUrl = canvas.toDataURL(`image/${format}`)
    const isSupported = dataUrl.indexOf(`data:image/${format}`) === 0
    
    if (isSupported && url.includes('.jpg')) {
      return url.replace('.jpg', `.${format}`)
    }
  } catch (e) {
    // Format not supported
  }
  
  return url
}