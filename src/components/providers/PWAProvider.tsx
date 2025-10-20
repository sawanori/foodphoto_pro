'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWA, useNetworkStatus } from '@/hooks/usePWA'
import { AdvancedButton } from '@/components/ui/AdvancedButton'

interface PWAContextValue {
  isSupported: boolean
  isInstalled: boolean
  canInstall: boolean
  isOnline: boolean
  updateAvailable: boolean
  install: () => Promise<boolean>
  updateApp: () => Promise<void>
  showInstallPrompt: () => Promise<boolean>
}

const PWAContext = createContext<PWAContextValue | null>(null)

export function usePWAContext() {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWAContext must be used within PWAProvider')
  }
  return context
}

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showUpdateBanner, setShowUpdateBanner] = useState(false)
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState({
    install: false,
    update: false,
    offline: false
  })

  const pwa = usePWA()
  const { isOnline, connectionType } = useNetworkStatus()

  // Check for dismissed banners in localStorage
  useEffect(() => {
    const dismissed = {
      install: localStorage.getItem('pwa-install-dismissed') === 'true',
      update: localStorage.getItem('pwa-update-dismissed') === 'true',
      offline: localStorage.getItem('pwa-offline-dismissed') === 'true'
    }
    setBannerDismissed(dismissed)
  }, [])

  // Show install banner
  useEffect(() => {
    if (pwa.canInstall && !pwa.isInstalled && !bannerDismissed.install) {
      const timer = setTimeout(() => setShowInstallBanner(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [pwa.canInstall, pwa.isInstalled, bannerDismissed.install])

  // Show update banner
  useEffect(() => {
    if (pwa.updateAvailable && !bannerDismissed.update) {
      setShowUpdateBanner(true)
    }
  }, [pwa.updateAvailable, bannerDismissed.update])

  // Show offline banner
  useEffect(() => {
    if (!isOnline && !bannerDismissed.offline) {
      setShowOfflineBanner(true)
    } else {
      setShowOfflineBanner(false)
    }
  }, [isOnline, bannerDismissed.offline])

  const handleInstall = async () => {
    const success = await pwa.install()
    if (success) {
      setShowInstallBanner(false)
    }
  }

  const handleUpdate = async () => {
    await pwa.updateApp()
    setShowUpdateBanner(false)
  }

  const dismissBanner = (type: keyof typeof bannerDismissed) => {
    localStorage.setItem(`pwa-${type}-dismissed`, 'true')
    setBannerDismissed(prev => ({ ...prev, [type]: true }))
    
    switch (type) {
      case 'install':
        setShowInstallBanner(false)
        break
      case 'update':
        setShowUpdateBanner(false)
        break
      case 'offline':
        setShowOfflineBanner(false)
        break
    }
  }

  const contextValue: PWAContextValue = {
    isSupported: pwa.isSupported,
    isInstalled: pwa.isInstalled,
    canInstall: pwa.canInstall,
    isOnline,
    updateAvailable: pwa.updateAvailable,
    install: pwa.install,
    updateApp: pwa.updateApp,
    showInstallPrompt: pwa.showInstallPrompt
  }

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      
      {/* Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl border border-yellow-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black text-lg mb-1">
                    アプリをインストール
                  </h3>
                  <p className="text-black/80 text-sm mb-4 leading-relaxed">
                    NonTurn.LLCをホーム画面に追加して、より快適にご利用いただけます
                  </p>
                  <div className="flex gap-2">
                    <AdvancedButton
                      variant="ghost"
                      size="sm"
                      onClick={handleInstall}
                      className="bg-white/20 hover:bg-white/30 text-black border-white/30"
                    >
                      インストール
                    </AdvancedButton>
                    <button
                      onClick={() => dismissBanner('install')}
                      className="px-3 py-1 text-black/70 hover:text-black text-sm transition-colors"
                    >
                      後で
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => dismissBanner('install')}
                  className="text-black/70 hover:text-black p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Banner */}
      <AnimatePresence>
        {showUpdateBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-2xl border border-blue-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    🔄
                  </motion.span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">
                    アップデート利用可能
                  </h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    新しいバージョンが利用可能です。最新の機能をお楽しみください
                  </p>
                  <div className="flex gap-2">
                    <AdvancedButton
                      variant="ghost"
                      size="sm"
                      onClick={handleUpdate}
                      loading={pwa.isUpdating}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      {pwa.isUpdating ? 'アップデート中...' : 'アップデート'}
                    </AdvancedButton>
                    <button
                      onClick={() => dismissBanner('update')}
                      className="px-3 py-1 text-white/70 hover:text-white text-sm transition-colors"
                    >
                      後で
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => dismissBanner('update')}
                  className="text-white/70 hover:text-white p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Banner */}
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>オフライン状態です。一部の機能が制限される場合があります</span>
                <button
                  onClick={() => dismissBanner('offline')}
                  className="ml-4 text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Status Indicator */}
      {isOnline && connectionType !== 'unknown' && (
        <div className="fixed bottom-4 left-4 z-40 opacity-70 hover:opacity-100 transition-opacity">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white border border-gray-700">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionType === '4g' ? 'bg-green-400' :
                connectionType === '3g' ? 'bg-yellow-400' :
                connectionType === '2g' ? 'bg-orange-400' :
                'bg-gray-400'
              }`} />
              <span className="capitalize">{connectionType}</span>
            </div>
          </div>
        </div>
      )}

      {/* PWA Status Debug (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-xs text-white font-mono border border-gray-700 max-w-sm">
          <div className="font-bold mb-2 text-yellow-400">PWA Debug Info</div>
          <div className="space-y-1">
            <div>Supported: {pwa.isSupported ? '✅' : '❌'}</div>
            <div>Installed: {pwa.isInstalled ? '✅' : '❌'}</div>
            <div>Can Install: {pwa.canInstall ? '✅' : '❌'}</div>
            <div>Standalone: {pwa.isStandalone ? '✅' : '❌'}</div>
            <div>Online: {isOnline ? '✅' : '❌'}</div>
            <div>Update Available: {pwa.updateAvailable ? '✅' : '❌'}</div>
            <div>Connection: {connectionType}</div>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  )
}