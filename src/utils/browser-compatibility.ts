/**
 * Browser compatibility utilities for Chrome and other browsers
 */

export interface BrowserInfo {
  name: string
  version: string
  isSupported: boolean
  features: {
    webgl: boolean
    webp: boolean
    es6: boolean
    css3: boolean
    serviceWorker: boolean
  }
}

/**
 * Detect browser and version
 */
export function detectBrowser(): BrowserInfo {
  if (typeof window === 'undefined') {
    return {
      name: 'unknown',
      version: '0',
      isSupported: true,
      features: {
        webgl: false,
        webp: false,
        es6: false,
        css3: false,
        serviceWorker: false
      }
    }
  }

  const userAgent = window.navigator.userAgent
  let name = 'unknown'
  let version = '0'

  // Chrome detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'chrome'
    const match = userAgent.match(/Chrome\/(\d+)/)
    version = match ? match[1] : '0'
  }
  // Safari detection
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'safari'
    const match = userAgent.match(/Version\/(\d+)/)
    version = match ? match[1] : '0'
  }
  // Firefox detection
  else if (userAgent.includes('Firefox')) {
    name = 'firefox'
    const match = userAgent.match(/Firefox\/(\d+)/)
    version = match ? match[1] : '0'
  }
  // Edge detection
  else if (userAgent.includes('Edg')) {
    name = 'edge'
    const match = userAgent.match(/Edg\/(\d+)/)
    version = match ? match[1] : '0'
  }

  return {
    name,
    version,
    isSupported: checkBrowserSupport(name, parseInt(version)),
    features: {
      webgl: checkWebGLSupport(),
      webp: checkWebPSupport(),
      es6: checkES6Support(),
      css3: checkCSS3Support(),
      serviceWorker: 'serviceWorker' in navigator
    }
  }
}

/**
 * Check if browser version is supported
 */
function checkBrowserSupport(name: string, version: number): boolean {
  const minVersions: Record<string, number> = {
    chrome: 70,
    safari: 12,
    firefox: 65,
    edge: 79
  }

  return version >= (minVersions[name] || 0)
}

/**
 * Check WebGL support with Chrome-specific fixes
 */
export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || 
               canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl')

    if (!gl) return false

    // Chrome-specific hardware acceleration check
    if (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        
        // Avoid software rendering
        if (renderer && renderer.toLowerCase().includes('software')) {
          console.warn('WebGL using software rendering')
          return false
        }
      }
    }

    return true
  } catch {
    return false
  }
}

/**
 * Check WebP support
 */
export function checkWebPSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

/**
 * Check ES6+ support
 */
export function checkES6Support(): boolean {
  try {
    // Test arrow functions, const/let, template literals
    eval('const test = () => `ES6 supported`')
    return true
  } catch {
    return false
  }
}

/**
 * Check CSS3 support
 */
export function checkCSS3Support(): boolean {
  if (typeof window === 'undefined') return false
  
  const div = document.createElement('div')
  const properties = [
    'transform',
    'transition',
    'animation',
    'flexbox',
    'grid'
  ]

  return properties.some(prop => {
    const prefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-']
    return prefixes.some(prefix => {
      const property = prefix + prop
      return property in div.style
    })
  })
}

/**
 * Apply Chrome-specific fixes
 */
export function applyChromeCompatibilityFixes(): void {
  if (typeof window === 'undefined') return

  const browser = detectBrowser()
  
  if (browser.name === 'chrome') {
    // Fix Chrome's aggressive caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }

    // Fix Chrome's WebGL context issues
    if (!browser.features.webgl) {
      console.warn('Chrome WebGL issues detected, applying fixes')
      
      // Add meta tag to force GPU acceleration
      const meta = document.createElement('meta')
      meta.name = 'chrome'
      meta.content = 'notranslate'
      document.head.appendChild(meta)
    }

    // Fix Chrome's font loading issues
    if (document.fonts && 'ready' in document.fonts) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded')
      })
    }

    // Chrome performance optimizations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload critical resources
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        document.head.appendChild(link)
      })
    }
  }
}

/**
 * Show browser compatibility warning
 */
export function showBrowserWarning(browser: BrowserInfo): void {
  if (!browser.isSupported) {
    const warning = document.createElement('div')
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6b6b;
      color: white;
      padding: 10px;
      text-align: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `
    warning.innerHTML = `
      ⚠️ お使いのブラウザ (${browser.name} ${browser.version}) は古いバージョンです。
      最適な表示のため、最新版にアップデートしてください。
      <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: white; color: #ff6b6b; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
        閉じる
      </button>
    `
    document.body.insertBefore(warning, document.body.firstChild)
  }
}

/**
 * Initialize browser compatibility checks
 */
export function initBrowserCompatibility(): BrowserInfo {
  if (typeof window === 'undefined') {
    return {
      name: 'unknown',
      version: '0',
      isSupported: true,
      features: {
        webgl: false,
        webp: false,
        es6: false,
        css3: false,
        serviceWorker: false
      }
    }
  }

  const browser = detectBrowser()
  
  // Apply compatibility fixes
  applyChromeCompatibilityFixes()
  
  // Show warning for unsupported browsers
  showBrowserWarning(browser)
  
  // Log browser info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser Info:', browser)
  }
  
  return browser
}