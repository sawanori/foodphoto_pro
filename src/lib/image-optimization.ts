/**
 * Image optimization utilities for SEO and performance
 */

export interface ImageMetadata {
  src: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: number
  priority?: boolean
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  sizes?: string
  blurDataURL?: string
  caption?: string
  credit?: string
}

export interface ResponsiveImageConfig {
  breakpoints: number[]
  formats: string[]
  quality: number
  sizes: string
}

/**
 * Default responsive image configuration
 */
export const defaultImageConfig: ResponsiveImageConfig = {
  breakpoints: [320, 640, 768, 1024, 1280, 1536, 1920],
  formats: ['avif', 'webp', 'jpeg'],
  quality: 85,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}

/**
 * Generate optimized image URLs for different formats and sizes
 */
export function generateOptimizedImageUrls(
  src: string, 
  config: ResponsiveImageConfig = defaultImageConfig
): Record<string, string[]> {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_CDN || ''
  const urls: Record<string, string[]> = {}

  config.formats.forEach(format => {
    urls[format] = config.breakpoints.map(width => {
      if (src.startsWith('http')) {
        // External image - use Next.js image optimization
        return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${config.quality}&fm=${format}`
      } else {
        // Local image - use direct optimization
        return `${baseUrl}${src}?w=${width}&q=${config.quality}&fm=${format}`
      }
    })
  })

  return urls
}

/**
 * Generate blur data URL for image placeholder
 */
export async function generateBlurDataURL(): Promise<string> {
  try {
    if (typeof window === 'undefined') {
      // Server-side: return a generic blur
      return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
    }

    // Client-side: generate actual blur
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return ''
    
    canvas.width = 8
    canvas.height = 8
    
    // Create a simple gradient blur
    const gradient = ctx.createLinearGradient(0, 0, 8, 8)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 8, 8)
    
    return canvas.toDataURL('image/jpeg', 0.1)
  } catch (error) {
    console.warn('Failed to generate blur data URL:', error)
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
  }
}

/**
 * Image metadata for structured data
 */
export function generateImageStructuredData(image: ImageMetadata, url: string) {
  return {
    '@type': 'ImageObject',
    url: image.src,
    width: image.width,
    height: image.height,
    caption: image.caption || image.alt,
    creditText: image.credit,
    contentUrl: image.src,
    thumbnailUrl: image.blurDataURL,
    encodingFormat: getImageMimeType(image.src),
    license: `${url}/license`,
    acquireLicensePage: `${url}/license`,
    creator: {
      '@type': 'Organization',
      name: 'NonTurn.LLC'
    }
  }
}

/**
 * Get MIME type from image URL
 */
export function getImageMimeType(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    case 'svg':
      return 'image/svg+xml'
    case 'gif':
      return 'image/gif'
    default:
      return 'image/jpeg'
  }
}

/**
 * Image SEO optimization
 */
export interface ImageSEOConfig {
  title?: string
  alt: string
  caption?: string
  credit?: string
  keywords?: string[]
  location?: {
    lat: number
    lng: number
    place?: string
  }
}

export function generateImageSEO(config: ImageSEOConfig) {
  const metadata: Record<string, string> = {}
  
  if (config.title) {
    metadata['image:title'] = config.title
  }
  
  metadata['image:alt'] = config.alt
  
  if (config.caption) {
    metadata['image:caption'] = config.caption
  }
  
  if (config.credit) {
    metadata['image:credit'] = config.credit
  }
  
  if (config.keywords) {
    metadata['image:keywords'] = config.keywords.join(', ')
  }
  
  if (config.location) {
    metadata['image:geo:latitude'] = config.location.lat.toString()
    metadata['image:geo:longitude'] = config.location.lng.toString()
    if (config.location.place) {
      metadata['image:geo:place'] = config.location.place
    }
  }
  
  return metadata
}

/**
 * Critical image identification
 */
export function isCriticalImage(src: string, priority?: boolean): boolean {
  if (priority) return true
  
  // Above-the-fold images
  const criticalImages = [
    '/og-image.jpg',
    '/hero-background.jpg',
    '/logo.png',
    '/icons/icon-192x192.png'
  ]
  
  return criticalImages.some(critical => src.includes(critical))
}

/**
 * Lazy loading configuration
 */
export function getLazyLoadingConfig(src: string, isVisible = false) {
  const isCritical = isCriticalImage(src)
  
  return {
    loading: (isCritical || isVisible) ? 'eager' as const : 'lazy' as const,
    priority: isCritical,
    placeholder: isCritical ? 'empty' as const : 'blur' as const
  }
}

/**
 * Performance budget for images
 */
export const imageBudget = {
  maxFileSize: 500 * 1024, // 500KB
  maxWidth: 2560,
  maxHeight: 1440,
  quality: {
    hero: 90,
    content: 85,
    thumbnail: 75
  },
  formats: ['avif', 'webp', 'jpeg'] as const
}

/**
 * Validate image against performance budget
 */
export function validateImageBudget(
  src: string, 
  width?: number, 
  height?: number
): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  if (width && width > imageBudget.maxWidth) {
    issues.push(`Width ${width}px exceeds maximum ${imageBudget.maxWidth}px`)
  }
  
  if (height && height > imageBudget.maxHeight) {
    issues.push(`Height ${height}px exceeds maximum ${imageBudget.maxHeight}px`)
  }
  
  // Check format
  const format = getImageMimeType(src)
  if (!['image/avif', 'image/webp', 'image/jpeg'].includes(format)) {
    issues.push(`Format ${format} not optimized for web`)
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}