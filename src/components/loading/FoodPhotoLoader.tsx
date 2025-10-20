'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function FoodPhotoLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // 安全策：load時または1.5秒で必ず消す（どちらか早い方）
    const handleLoad = () => {
      onComplete()
    }

    window.addEventListener('load', handleLoad)
    const timeout = setTimeout(() => {
      onComplete()
    }, 800) // 0.8秒後に必ず消す

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <motion.div
      id="loader"
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, visibility: 'hidden' }}
      transition={{ duration: 0.4 }}
      aria-hidden="true"
      style={{
        background: 'rgba(0, 0, 0, 0.25)', // 半透明、ヒーロー画像が透けて見える
        display: 'grid',
        placeItems: 'center',
        animation: 'fadeout 0.3s ease 0.5s forwards' // 0.5秒後にフェードアウト開始
      }}
    >
      <style jsx>{`
        @keyframes fadeout {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>

      {/* シンプルなロゴとスピナー */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* シンプルなアイコンとテキスト */}
          <div className="mb-4">
            <span style={{ fontSize: '48px' }}>📸</span>
          </div>
          <div className="text-white text-xl font-semibold mb-2">
            飲食店撮影PhotoStudio
          </div>

          {/* 軽量なスピナー */}
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    </motion.div>
  )
}