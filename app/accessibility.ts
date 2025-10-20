/**
 * Accessibility Utilities for WCAG 2.1 Level AA Compliance
 */

/**
 * Skip Link Implementation
 */
export function initSkipLinks() {
  if (typeof window === 'undefined') return

  // Create skip to content link
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.className = 'skip-link'
  skipLink.textContent = 'メインコンテンツへスキップ'
  skipLink.setAttribute('aria-label', 'メインコンテンツへスキップ')
  
  // Check if skip link already exists
  if (!document.querySelector('.skip-link')) {
    document.body.insertBefore(skipLink, document.body.firstChild)
  }
}

/**
 * Focus Management Utilities
 */
export class FocusManager {
  private focusableElements: HTMLElement[] = []
  private lastFocusedElement: HTMLElement | null = null

  /**
   * Trap focus within a container (for modals, dialogs)
   */
  trapFocus(container: HTMLElement) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    this.focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors)
    )

    if (this.focusableElements.length === 0) return

    // Store current focus
    this.lastFocusedElement = document.activeElement as HTMLElement

    // Focus first element
    this.focusableElements[0].focus()

    // Handle Tab key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const currentIndex = this.focusableElements.indexOf(
        document.activeElement as HTMLElement
      )

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (currentIndex === 0) {
          e.preventDefault()
          this.focusableElements[this.focusableElements.length - 1].focus()
        }
      } else {
        // Tab (forward)
        if (currentIndex === this.focusableElements.length - 1) {
          e.preventDefault()
          this.focusableElements[0].focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      this.lastFocusedElement?.focus()
    }
  }

  /**
   * Restore focus to last focused element
   */
  restoreFocus() {
    this.lastFocusedElement?.focus()
  }
}

/**
 * Keyboard Navigation Enhancement
 */
export function enhanceKeyboardNavigation() {
  if (typeof window === 'undefined') return

  // Add keyboard event listeners for common patterns
  document.addEventListener('keydown', (e) => {
    // Escape key to close modals/dialogs
    if (e.key === 'Escape') {
      const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]')
      if (openModal) {
        const closeButton = openModal.querySelector('[aria-label*="閉じる"]') as HTMLElement
        closeButton?.click()
      }
    }

    // Arrow key navigation for menu items
    if (e.key && e.key.startsWith('Arrow')) {
      const activeElement = document.activeElement
      if (activeElement?.getAttribute('role') === 'menuitem') {
        handleMenuNavigation(e)
      }
    }

    // Home/End keys for lists
    if (e.key === 'Home' || e.key === 'End') {
      const activeElement = document.activeElement
      if (activeElement?.parentElement?.getAttribute('role') === 'list') {
        handleListNavigation(e)
      }
    }
  })

  // Add focus visible polyfill for older browsers
  if (!CSS.supports('selector(:focus-visible)')) {
    document.body.classList.add('focus-visible-polyfill')
  }
}

/**
 * Handle arrow key navigation in menus
 */
function handleMenuNavigation(e: KeyboardEvent) {
  const currentItem = document.activeElement as HTMLElement
  const menu = currentItem.closest('[role="menu"]')
  if (!menu) return

  const menuItems = Array.from(
    menu.querySelectorAll('[role="menuitem"]')
  ) as HTMLElement[]
  
  const currentIndex = menuItems.indexOf(currentItem)
  let nextIndex = currentIndex

  switch (e.key) {
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % menuItems.length
      break
    case 'ArrowUp':
      nextIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1
      break
    case 'ArrowRight':
      // Handle submenu
      const submenu = currentItem.querySelector('[role="menu"]')
      if (submenu) {
        const firstItem = submenu.querySelector('[role="menuitem"]') as HTMLElement
        firstItem?.focus()
        e.preventDefault()
        return
      }
      break
    case 'ArrowLeft':
      // Handle parent menu
      const parentMenuItem = menu.closest('[role="menuitem"]') as HTMLElement
      parentMenuItem?.focus()
      e.preventDefault()
      return
  }

  if (nextIndex !== currentIndex) {
    e.preventDefault()
    menuItems[nextIndex].focus()
  }
}

/**
 * Handle Home/End key navigation in lists
 */
function handleListNavigation(e: KeyboardEvent) {
  const list = (document.activeElement as HTMLElement).parentElement
  if (!list) return

  const items = Array.from(
    list.querySelectorAll('[tabindex="0"]')
  ) as HTMLElement[]

  if (e.key === 'Home') {
    e.preventDefault()
    items[0]?.focus()
  } else if (e.key === 'End') {
    e.preventDefault()
    items[items.length - 1]?.focus()
  }
}

/**
 * Live Region Announcer
 */
export class LiveRegionAnnouncer {
  private liveRegion: HTMLElement | null = null

  constructor() {
    this.initLiveRegion()
  }

  private initLiveRegion() {
    if (typeof window === 'undefined') return

    // Check if live region already exists
    this.liveRegion = document.getElementById('aria-live-region')
    
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div')
      this.liveRegion.id = 'aria-live-region'
      this.liveRegion.setAttribute('aria-live', 'polite')
      this.liveRegion.setAttribute('aria-atomic', 'true')
      this.liveRegion.className = 'sr-only'
      document.body.appendChild(this.liveRegion)
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion) return

    this.liveRegion.setAttribute('aria-live', priority)
    this.liveRegion.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = ''
      }
    }, 1000)
  }
}

/**
 * Form Accessibility Enhancement
 */
export function enhanceFormAccessibility(form: HTMLFormElement) {
  // Add required field indicators
  const requiredFields = form.querySelectorAll('[required]')
  requiredFields.forEach((field) => {
    const label = form.querySelector(`label[for="${field.id}"]`)
    if (label && !label.querySelector('.required-indicator')) {
      const indicator = document.createElement('span')
      indicator.className = 'required-indicator'
      indicator.textContent = ' (必須)'
      indicator.setAttribute('aria-label', '必須項目')
      label.appendChild(indicator)
    }
  })

  // Add error message association
  const errorMessages = form.querySelectorAll('.error-message')
  errorMessages.forEach((error) => {
    const fieldId = error.getAttribute('data-field')
    if (fieldId) {
      const field = form.querySelector(`#${fieldId}`)
      if (field) {
        field.setAttribute('aria-invalid', 'true')
        field.setAttribute('aria-describedby', error.id)
      }
    }
  })

  // Add form validation announcements
  form.addEventListener('submit', (e) => {
    const errors = form.querySelectorAll('[aria-invalid="true"]')
    if (errors.length > 0) {
      const announcer = new LiveRegionAnnouncer()
      announcer.announce(
        `フォームに${errors.length}個のエラーがあります。修正してください。`,
        'assertive'
      )
    }
  })
}

/**
 * Initialize all accessibility enhancements
 */
export function initAccessibility() {
  if (typeof window === 'undefined') return

  // Initialize skip links
  initSkipLinks()

  // Enhance keyboard navigation
  enhanceKeyboardNavigation()

  // Initialize live region
  new LiveRegionAnnouncer()

  // Add high contrast mode detection
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
  if (prefersHighContrast.matches) {
    document.body.classList.add('high-contrast')
  }

  // Add reduced motion support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (prefersReducedMotion.matches) {
    document.body.classList.add('reduced-motion')
  }

  // Add focus visible styles
  addFocusVisibleStyles()
}

/**
 * Add focus visible styles dynamically
 */
function addFocusVisibleStyles() {
  const style = document.createElement('style')
  style.textContent = `
    /* Skip Link Styles */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 100000;
    }
    
    .skip-link:focus {
      top: 0;
    }
    
    /* Focus Visible Styles */
    :focus-visible {
      outline: 3px solid #ff6b00;
      outline-offset: 2px;
    }
    
    .focus-visible-polyfill *:focus {
      outline: 3px solid #ff6b00;
      outline-offset: 2px;
    }
    
    /* Screen Reader Only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    /* High Contrast Mode */
    .high-contrast {
      filter: contrast(1.2);
    }
    
    /* Reduced Motion */
    .reduced-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    /* Focus trap container */
    [data-focus-trap="active"] {
      position: relative;
    }
    
    /* Required field indicator */
    .required-indicator {
      color: #dc2626;
      font-weight: bold;
      margin-left: 4px;
    }
  `
  document.head.appendChild(style)
}