'use client'

import { useState, useEffect, useCallback } from 'react'

// Extend Navigator interface for connection properties
declare global {
  interface Navigator {
    connection?: NetworkInformation
    mozConnection?: NetworkInformation
    webkitConnection?: NetworkInformation
  }
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string
  addEventListener(type: string, listener: EventListener): void
  removeEventListener(type: string, listener: EventListener): void
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isSupported: boolean
  isInstalled: boolean
  isStandalone: boolean
  canInstall: boolean
  isOnline: boolean
  updateAvailable: boolean
  isUpdating: boolean
  installPrompt: BeforeInstallPromptEvent | null
}

interface PWAActions {
  install: () => Promise<boolean>
  updateApp: () => Promise<void>
  showInstallPrompt: () => Promise<boolean>
  registerServiceWorker: () => Promise<ServiceWorkerRegistration | null>
  unregisterServiceWorker: () => Promise<boolean>
  skipWaiting: () => void
  requestNotificationPermission: () => Promise<NotificationPermission>
  sendNotification: (title: string, options?: NotificationOptions) => Promise<void>
  clearCache: () => Promise<void>
  preloadRoute: (route: string) => Promise<void>
}

export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isSupported: false,
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    isOnline: true,
    updateAvailable: false,
    isUpdating: false,
    installPrompt: null
  })

  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Check PWA support and initialize
  useEffect(() => {
    const checkPWASupport = () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
      const isInstalled = isStandalone || localStorage.getItem('pwa-installed') === 'true'

      setState(prev => ({
        ...prev,
        isSupported,
        isStandalone,
        isInstalled
      }))
    }

    checkPWASupport()
  }, [])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const installEvent = e as BeforeInstallPromptEvent
      setState(prev => ({
        ...prev,
        canInstall: true,
        installPrompt: installEvent
      }))
    }

    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        installPrompt: null
      }))
      localStorage.setItem('pwa-installed', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Register service worker
  const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    if (!state.isSupported) {
      console.warn('Service Worker not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })

      console.log('Service Worker registered successfully:', registration)
      setSwRegistration(registration)

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          setState(prev => ({ ...prev, updateAvailable: true }))
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, updateAvailable: true }))
            }
          })
        }
      })

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })

      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }, [state.isSupported])

  // Auto-register service worker
  useEffect(() => {
    if (state.isSupported) {
      registerServiceWorker()
    }
  }, [state.isSupported, registerServiceWorker])

  // Install app
  const install = useCallback(async (): Promise<boolean> => {
    if (!state.installPrompt) {
      console.warn('Install prompt not available')
      return false
    }

    try {
      await state.installPrompt.prompt()
      const choiceResult = await state.installPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          canInstall: false,
          installPrompt: null
        }))
        localStorage.setItem('pwa-installed', 'true')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Install failed:', error)
      return false
    }
  }, [state.installPrompt])

  // Show install prompt
  const showInstallPrompt = useCallback(async (): Promise<boolean> => {
    return await install()
  }, [install])

  // Update app
  const updateApp = useCallback(async (): Promise<void> => {
    if (!swRegistration || !swRegistration.waiting) {
      console.warn('No update available')
      return
    }

    setState(prev => ({ ...prev, isUpdating: true }))

    try {
      // Tell the waiting service worker to skip waiting
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Wait for the new service worker to take control
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          resolve()
        }, { once: true })
      })

      setState(prev => ({ 
        ...prev, 
        updateAvailable: false, 
        isUpdating: false 
      }))
      
      // Reload the page to use the new service worker
      window.location.reload()
    } catch (error) {
      console.error('Update failed:', error)
      setState(prev => ({ ...prev, isUpdating: false }))
    }
  }, [swRegistration])

  // Skip waiting
  const skipWaiting = useCallback(() => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [swRegistration])

  // Unregister service worker
  const unregisterServiceWorker = useCallback(async (): Promise<boolean> => {
    if (!swRegistration) {
      return false
    }

    try {
      const result = await swRegistration.unregister()
      setSwRegistration(null)
      return result
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }, [swRegistration])

  // Request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
  }, [])

  // Send notification
  const sendNotification = useCallback(async (
    title: string, 
    options?: NotificationOptions
  ): Promise<void> => {
    const permission = await requestNotificationPermission()
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    if (swRegistration) {
      // Use service worker to show notification
      await swRegistration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      } as NotificationOptions & { vibrate?: number[] })
    } else {
      // Fallback to basic notification
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        ...options
      })
    }
  }, [swRegistration, requestNotificationPermission])

  // Clear cache
  const clearCache = useCallback(async (): Promise<void> => {
    if (!('caches' in window)) {
      console.warn('Cache API not supported')
      return
    }

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('All caches cleared')
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [])

  // Preload route
  const preloadRoute = useCallback(async (route: string): Promise<void> => {
    if (!('caches' in window)) {
      return
    }

    try {
      const cache = await caches.open('nonturn-dynamic-v1.0.0')
      await cache.add(route)
      console.log(`Route ${route} preloaded`)
    } catch (error) {
      console.error(`Failed to preload route ${route}:`, error)
    }
  }, [])

  return {
    // State
    ...state,
    
    // Actions
    install,
    updateApp,
    showInstallPrompt,
    registerServiceWorker,
    unregisterServiceWorker,
    skipWaiting,
    requestNotificationPermission,
    sendNotification,
    clearCache,
    preloadRoute
  }
}

// Hook for checking if app is in standalone mode
export function useStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                       ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
      setIsStandalone(standalone)
    }

    checkStandalone()
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => setIsStandalone(e.matches)
    
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return isStandalone
}

// Hook for network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    const updateConnectionType = () => {
      const connection = navigator.connection || 
                        navigator.mozConnection || 
                        navigator.webkitConnection
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown')
      }
    }

    updateOnlineStatus()
    updateConnectionType()

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection
    if (connection) {
      connection.addEventListener('change', updateConnectionType)
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      if (connection) {
        connection.removeEventListener('change', updateConnectionType)
      }
    }
  }, [])

  return { isOnline, connectionType }
}