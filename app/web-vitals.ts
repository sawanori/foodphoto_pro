import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }    // Interaction to Next Paint
}

// Helper function to determine rating
function getRating(value: number, metric: keyof typeof THRESHOLDS): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

// Send analytics function
function sendToAnalytics(metric: Metric) {
  const rating = getRating(metric.value, metric.name as keyof typeof THRESHOLDS)
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType
    })
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: rating,
      navigation_type: metric.navigationType,
      non_interaction: true
    })
  }
}

// Initialize web vitals monitoring
export function initWebVitals() {
  if (typeof window === 'undefined') return

  // Core Web Vitals
  onLCP(sendToAnalytics)
  onCLS(sendToAnalytics)
  
  // Additional metrics
  onFCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
  onINP(sendToAnalytics)
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload hero images
  const heroImages = [
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg',
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg'
  ]

  heroImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
  })

  // Preconnect to external domains
  const domains = [
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]

  domains.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Optimize images loading
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return

  // Native lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]')
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'lazy'
      }
    })
  } else {
    // Fallback to Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px'
    })

    images.forEach(img => imageObserver.observe(img))
  }
}

// Reduce layout shifts
export function preventLayoutShifts() {
  if (typeof window === 'undefined') return

  // Set dimensions for all images without explicit width/height
  const images = document.querySelectorAll('img:not([width]):not([height])')
  images.forEach(img => {
    if (img instanceof HTMLImageElement) {
      // Set aspect ratio to prevent layout shift
      const aspectRatio = img.naturalWidth / img.naturalHeight
      if (aspectRatio && !isNaN(aspectRatio)) {
        img.style.aspectRatio = aspectRatio.toString()
      }
    }
  })

  // Ensure fonts are loaded to prevent FOUT
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded')
    })
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}