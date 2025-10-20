'use client'

import { useEffect, useState } from 'react'

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    // Service Workerの登録
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration)
            
            // Service Workerの更新チェック
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 新しいService Workerがインストールされたことを通知
                    if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error)
          })
      })
    }

    // インストールプロンプトのイベントリスナー
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // アプリがインストールされた場合
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
      <button
        onClick={handleInstallClick}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
        aria-label="アプリをインストール"
      >
        <span className="text-xl">📲</span>
        <span>アプリをインストール</span>
      </button>
    </div>
  )
}