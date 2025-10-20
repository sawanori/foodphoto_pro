/**
 * Font Optimization Utilities for Better Performance
 */

/**
 * Font display strategies
 */
export const fontDisplayStrategies = {
  // Show fallback font immediately, swap when loaded
  swap: 'swap',
  // Block text rendering until font loads (max 3s)
  block: 'block',
  // Use fallback immediately, don't swap
  fallback: 'fallback',
  // Extremely small block period
  optional: 'optional',
  // Default browser behavior
  auto: 'auto'
} as const

/**
 * Preload critical fonts
 */
export function preloadCriticalFonts() {
  if (typeof window === 'undefined') return

  const criticalFonts = [
    {
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap',
      as: 'style',
      crossOrigin: 'anonymous'
    }
  ]

  criticalFonts.forEach(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = font.as
    link.href = font.href
    if (font.crossOrigin) {
      link.crossOrigin = font.crossOrigin
    }
    
    // Check if already exists
    const existing = document.querySelector(`link[href="${font.href}"]`)
    if (!existing) {
      document.head.appendChild(link)
    }
  })
}

/**
 * Font Face Observer - Load fonts with Promise
 */
export class FontLoader {
  private fontFamily: string
  private fontWeight: string | number
  private timeout: number

  constructor(fontFamily: string, fontWeight: string | number = 'normal', timeout: number = 3000) {
    this.fontFamily = fontFamily
    this.fontWeight = fontWeight
    this.timeout = timeout
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      // Check if font is already loaded
      if (document.fonts && document.fonts.check) {
        const fontString = `${this.fontWeight} 1em ${this.fontFamily}`
        if (document.fonts.check(fontString)) {
          resolve()
          return
        }
      }

      // Create test element
      const testString = 'giItT1WQy@!-/#'
      const testSize = '40px'
      
      const tester = document.createElement('span')
      tester.innerHTML = testString
      tester.style.position = 'absolute'
      tester.style.left = '-9999px'
      tester.style.top = '-9999px'
      tester.style.visibility = 'hidden'
      tester.style.fontFamily = 'sans-serif'
      tester.style.fontSize = testSize
      tester.style.fontWeight = String(this.fontWeight)
      
      document.body.appendChild(tester)
      
      const initialWidth = tester.offsetWidth
      tester.style.fontFamily = `"${this.fontFamily}", sans-serif`
      
      let timeoutId: NodeJS.Timeout | null = null
      let intervalId: NodeJS.Timeout | null = null
      
      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        if (intervalId) clearInterval(intervalId)
        document.body.removeChild(tester)
      }
      
      // Check if font loaded
      const checkFont = () => {
        if (tester.offsetWidth !== initialWidth) {
          cleanup()
          resolve()
        }
      }
      
      // Start checking
      intervalId = setInterval(checkFont, 50)
      
      // Timeout fallback
      timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error(`Font ${this.fontFamily} failed to load within ${this.timeout}ms`))
      }, this.timeout)
    })
  }
}

/**
 * Progressive Font Loading Strategy
 */
export async function loadFontsProgressively() {
  if (typeof window === 'undefined') return

  try {
    // Stage 1: Load critical font weights first
    const criticalFonts = [
      new FontLoader('Noto Sans JP', 400),
      new FontLoader('Noto Sans JP', 700)
    ]
    
    await Promise.all(criticalFonts.map(font => font.load()))
    document.documentElement.classList.add('fonts-loaded-stage-1')
    
    // Stage 2: Load additional weights after interaction
    const additionalFonts = [
      new FontLoader('Noto Sans JP', 900)
    ]
    
    // Load on first interaction or after delay
    const loadAdditionalFonts = async () => {
      try {
        await Promise.all(additionalFonts.map(font => font.load()))
        document.documentElement.classList.add('fonts-loaded-stage-2')
      } catch (error) {
        console.warn('Additional fonts failed to load:', error)
      }
    }
    
    // Load after user interaction or 2 seconds
    let loaded = false
    const interactionEvents = ['mousedown', 'touchstart', 'keydown', 'scroll']
    
    const handleInteraction = () => {
      if (!loaded) {
        loaded = true
        loadAdditionalFonts()
        interactionEvents.forEach(event => {
          window.removeEventListener(event, handleInteraction)
        })
      }
    }
    
    interactionEvents.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })
    
    // Fallback: load after 2 seconds anyway
    setTimeout(() => {
      if (!loaded) {
        loaded = true
        loadAdditionalFonts()
      }
    }, 2000)
    
  } catch (error) {
    console.warn('Critical fonts failed to load:', error)
    // Fallback to system fonts
    document.documentElement.classList.add('fonts-fallback')
  }
}

/**
 * Optimize font rendering with CSS
 */
export function generateFontCSS(): string {
  return `
    /* Font Loading Optimization */
    @font-face {
      font-family: 'Noto Sans JP';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    @font-face {
      font-family: 'Noto Sans JP';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    @font-face {
      font-family: 'Noto Sans JP';
      font-style: normal;
      font-weight: 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    /* Progressive Enhancement */
    html {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
    }
    
    html.fonts-loaded-stage-1 {
      font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    /* Reduce FOIT (Flash of Invisible Text) */
    .font-loading {
      visibility: visible !important;
    }
    
    /* Japanese-specific optimization */
    html:lang(ja) {
      font-feature-settings: 'palt' 1;
      letter-spacing: 0.05em;
      line-height: 1.7;
    }
    
    /* Optimize for different font weights */
    .font-weight-normal {
      font-weight: 400;
    }
    
    .font-weight-bold {
      font-weight: 700;
    }
    
    .font-weight-black {
      font-weight: 900;
    }
    
    /* Fallback styles */
    html.fonts-fallback {
      letter-spacing: 0.02em;
    }
  `
}

/**
 * Initialize all font optimizations
 */
export function initFontOptimizations() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  preloadCriticalFonts()
  
  // Load fonts progressively
  loadFontsProgressively()
  
  // Add font loading class
  document.documentElement.classList.add('font-loading')
  
  // Monitor font loading with Font Loading API
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.remove('font-loading')
      document.documentElement.classList.add('fonts-loaded')
    })
  }
}

/**
 * Create optimized font subset for Japanese text
 */
export function generateJapaneseFontSubset(): string {
  // Common Japanese characters for initial load
  const commonKanji = '料理店舗撮影写真食品飲東京横浜千葉専門'
  const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
  const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  
  return commonKanji + hiragana + katakana
}

/**
 * Variable font optimization
 */
export function supportsVariableFonts(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for variable font support
  const testEl = document.createElement('span')
  testEl.style.fontVariationSettings = '"wght" 400'
  return testEl.style.fontVariationSettings !== ''
}