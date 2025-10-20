'use client'

import { useEffect, useState } from 'react'

export function AccessibilityEnhancements() {
  const [, setSkipLinksVisible] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    // Check for user preferences
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    setReducedMotion(hasReducedMotion)
    setHighContrast(hasHighContrast)

    // Apply initial settings
    if (hasReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
    }

    if (hasHighContrast) {
      document.documentElement.classList.add('high-contrast')
    }

    // Load saved preferences
    const savedFontSize = localStorage.getItem('accessibility-font-size')
    if (savedFontSize) {
      const size = parseInt(savedFontSize)
      setFontSize(size)
      document.documentElement.style.fontSize = `${size}px`
    }

    const savedHighContrast = localStorage.getItem('accessibility-high-contrast')
    if (savedHighContrast === 'true') {
      setHighContrast(true)
      document.documentElement.classList.add('high-contrast')
    }

    // Keyboard navigation enhancement
    const handleTabNavigation = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard')
      }
    }

    const handleMouseNavigation = () => {
      document.body.classList.remove('using-keyboard')
    }

    document.addEventListener('keydown', handleTabNavigation)
    document.addEventListener('mousedown', handleMouseNavigation)

    return () => {
      document.removeEventListener('keydown', handleTabNavigation)
      document.removeEventListener('mousedown', handleMouseNavigation)
    }
  }, [])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem('accessibility-high-contrast', newValue.toString())
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(14, Math.min(24, fontSize + delta))
    setFontSize(newSize)
    localStorage.setItem('accessibility-font-size', newSize.toString())
    document.documentElement.style.fontSize = `${newSize}px`
  }

  const skipToContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const skipToNavigation = () => {
    const navigation = document.getElementById('main-navigation')
    if (navigation) {
      navigation.focus()
      navigation.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Skip Links */}
      <div className="sr-only focus:not-sr-only">
        <nav aria-label="Skip navigation links" className="fixed top-0 left-0 z-50 bg-yellow-400 text-black p-2">
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={skipToContent}
                className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-black"
                onFocus={() => setSkipLinksVisible(true)}
                onBlur={() => setSkipLinksVisible(false)}
              >
                メインコンテンツにスキップ
              </button>
            </li>
            <li>
              <button
                onClick={skipToNavigation}
                className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-black"
                onFocus={() => setSkipLinksVisible(true)}
                onBlur={() => setSkipLinksVisible(false)}
              >
                ナビゲーションにスキップ
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Accessibility Tools Panel */}
      <div className="fixed top-4 right-4 z-40">
        <details className="relative">
          <summary 
            className="bg-yellow-400 text-black p-3 rounded-full cursor-pointer hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
            aria-label="アクセシビリティツール"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </summary>

          <div className="absolute top-14 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-72">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              アクセシビリティ設定
            </h3>
            
            <div className="space-y-4">
              {/* Font Size Controls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文字サイズ
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustFontSize(-2)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    aria-label="文字を小さくする"
                  >
                    A-
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-12 text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => adjustFontSize(2)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    aria-label="文字を大きくする"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={toggleHighContrast}
                    className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ハイコントラスト
                  </span>
                </label>
              </div>

              {/* Motion Preference Display */}
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  アニメーション: {reducedMotion ? '無効' : '有効'}
                </span>
              </div>

              {/* Focus Mode */}
              <div>
                <button
                  onClick={() => {
                    document.body.classList.toggle('focus-mode')
                  }}
                  className="w-full px-3 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
                >
                  フォーカスモード切替
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Accessibility Styles */}
      <style jsx global>{`
        /* High contrast mode */
        .high-contrast {
          filter: contrast(150%);
        }

        .high-contrast * {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #fff !important;
        }

        .high-contrast .bg-yellow-400, 
        .high-contrast .text-yellow-400,
        .high-contrast [class*="yellow"] {
          background-color: #ffff00 !important;
          color: #000 !important;
        }

        /* Focus mode */
        .focus-mode *:not(:focus):not(:focus-within) {
          opacity: 0.5 !important;
        }

        /* Keyboard navigation indicators */
        .using-keyboard *:focus {
          outline: 3px solid #facc15 !important;
          outline-offset: 2px !important;
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        /* Enhanced focus indicators */
        summary:focus {
          outline: 3px solid #facc15;
          outline-offset: 2px;
        }

        /* Ensure minimum touch target size */
        button, a, input, textarea, select {
          min-height: 44px;
          min-width: 44px;
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  )
}

// Screen Reader Announcements
export function ScreenReaderAnnouncement({ message, priority = 'polite' }: {
  message: string
  priority?: 'polite' | 'assertive'
}) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Visually Hidden Component
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}