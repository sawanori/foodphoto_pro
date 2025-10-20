'use client'

import { useEffect } from 'react'

export function FontOptimization() {
  useEffect(() => {
    // Preload critical font files
    const preloadFonts = [
      {
        href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      },
      {
        href: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      }
    ]

    preloadFonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font.href
      link.as = font.as
      link.type = font.type
      link.crossOrigin = font.crossOrigin
      document.head.appendChild(link)
    })

    // Font display optimization
    const addFontDisplaySwap = () => {
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: 'Inter-fallback';
          size-adjust: 100.06%;
          ascent-override: 90%;
          src: local('Arial');
        }
        
        @font-face {
          font-family: 'JetBrains-Mono-fallback';
          size-adjust: 100%;
          ascent-override: 85%;
          src: local('Courier New');
        }
        
        /* Critical font loading styles */
        .font-inter {
          font-family: 'Inter', 'Inter-fallback', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .font-jetbrains-mono {
          font-family: 'JetBrains Mono', 'JetBrains-Mono-fallback', 'Courier New', monospace;
        }
        
        /* Prevent layout shift during font load */
        .font-loading {
          visibility: hidden;
        }
        
        .fonts-loaded .font-loading {
          visibility: visible;
        }
      `
      document.head.appendChild(style)
    }

    addFontDisplaySwap()

    // Font loading detection
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 16px Inter'),
        document.fonts.load('700 16px Inter'),
        document.fonts.load('400 16px JetBrains Mono'),
        document.fonts.load('700 16px JetBrains Mono'),
      ]).then(() => {
        document.documentElement.classList.add('fonts-loaded')
        
        // Store font loading state
        sessionStorage.setItem('fonts-loaded', 'true')
        
        // Performance monitoring
        if ('performance' in window && 'mark' in performance) {
          performance.mark('fonts-loaded')
        }
      }).catch(err => {
        console.warn('Font loading failed:', err)
        // Fallback to system fonts
        document.documentElement.classList.add('fonts-failed')
      })
    }

    // Check if fonts were already loaded in this session
    if (sessionStorage.getItem('fonts-loaded')) {
      document.documentElement.classList.add('fonts-loaded')
    }

    // Cleanup function
    return () => {
      // Remove added elements if component unmounts
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="font"]')
      preloadLinks.forEach(link => {
        if (preloadFonts.some(font => font.href === link.getAttribute('href'))) {
          link.remove()
        }
      })
    }
  }, [])

  return null
}

// Hook for font loading status
export function useFontLoading() {
  const checkFontLoading = () => {
    return document.documentElement.classList.contains('fonts-loaded')
  }

  return { fontsLoaded: checkFontLoading() }
}

// Critical CSS for fonts (should be inlined)
export const criticalFontCSS = `
  /* Critical font styles to prevent FOIT/FOUT */
  .font-inter {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .font-jetbrains-mono {
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  }
  
  /* Ensure text remains visible during webfont load */
  @font-face {
    font-family: 'Inter';
    font-display: swap;
  }
  
  @font-face {
    font-family: 'JetBrains Mono';
    font-display: swap;
  }
`

// Font metrics for precise fallback matching
export const fontMetrics = {
  inter: {
    capHeight: 2048,
    ascent: 2728,
    descent: -680,
    lineGap: 0,
    unitsPerEm: 2048,
  },
  jetbrainsMono: {
    capHeight: 2048,
    ascent: 2252,
    descent: -496,
    lineGap: 0,
    unitsPerEm: 2048,
  }
}