// Performance utilities for Core Web Vitals optimization

/**
 * Debounce function to reduce unnecessary re-renders and improve FID
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallbackShim(
  callback: () => void,
  options?: { timeout?: number }
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options)
  }
  
  // Fallback to setTimeout
  const timeout = options?.timeout || 1
  if (typeof window !== 'undefined') {
    const win = window as any
    return win.setTimeout(callback, timeout) as number
  }
  return 0
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallbackShim(id: number): void {
  if (typeof window !== 'undefined') {
    if ('cancelIdleCallback' in window) {
      window.cancelIdleCallback(id)
    } else {
      clearTimeout(id)
    }
  }
}

/**
 * Optimize event listener with passive option for better scroll performance
 */
export function addPassiveEventListener(
  element: Element | Window,
  event: string,
  handler: EventListener,
  options: AddEventListenerOptions = {}
): () => void {
  const optionsWithPassive = {
    ...options,
    passive: true
  }
  
  element.addEventListener(event, handler, optionsWithPassive)
  
  return () => {
    element.removeEventListener(event, handler, optionsWithPassive)
  }
}

/**
 * Prefetch link on hover for faster navigation
 */
export function prefetchOnHover(link: HTMLAnchorElement): void {
  let prefetchTimeout: NodeJS.Timeout | null = null
  
  const handleMouseEnter = () => {
    prefetchTimeout = setTimeout(() => {
      const href = link.href
      if (href && !link.dataset.prefetched) {
        const prefetchLink = document.createElement('link')
        prefetchLink.rel = 'prefetch'
        prefetchLink.href = href
        document.head.appendChild(prefetchLink)
        link.dataset.prefetched = 'true'
      }
    }, 100) // Small delay to avoid prefetching on accidental hover
  }
  
  const handleMouseLeave = () => {
    if (prefetchTimeout) {
      clearTimeout(prefetchTimeout)
    }
  }
  
  link.addEventListener('mouseenter', handleMouseEnter)
  link.addEventListener('mouseleave', handleMouseLeave)
}

/**
 * Load non-critical CSS asynchronously
 */
export function loadCSSAsync(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))
    document.head.appendChild(link)
  })
}

/**
 * Optimize animation frame for smooth animations
 */
export function optimizedRAF(callback: FrameRequestCallback): number {
  let ticking = false
  let rafId: number = 0
  
  const update = (time: number) => {
    callback(time)
    ticking = false
  }
  
  const requestTick = () => {
    if (!ticking) {
      rafId = requestAnimationFrame(update)
      ticking = true
    }
    return rafId
  }
  
  return requestTick()
}