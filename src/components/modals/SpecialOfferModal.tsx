'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface SpecialOfferModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SpecialOfferModal({ isOpen, onClose }: SpecialOfferModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/sample1.jpg',
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/sample2.jpg',
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/sample3.jpg'
  ]

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, images.length])

  // Confetti effect
  useEffect(() => {
    if (isOpen) {
      const confettiColors = ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00CED1']
      const confettiCount = 30 // Reduced for mobile performance

      const createConfetti = () => {
        for (let i = 0; i < confettiCount; i++) {
          setTimeout(() => {
            const confetti = document.createElement('div')
            confetti.className = 'confetti-particle'
            confetti.style.left = Math.random() * 100 + '%'
            confetti.style.animationDelay = Math.random() * 3 + 's'
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
            document.getElementById('confetti-container')?.appendChild(confetti)

            setTimeout(() => confetti.remove(), 5000)
          }, Math.random() * 300)
        }
      }

      createConfetti()
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[9999] md:max-w-5xl md:w-[90vw] md:max-h-[90vh]"
          >
            {/* Scrollable container */}
            <div className="relative h-full md:h-auto flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl md:rounded-3xl shadow-2xl">
              {/* Confetti container */}
              <div id="confetti-container" className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl md:rounded-3xl" />
              
              {/* Fixed header with close button */}
              <div className="sticky top-0 z-20 flex justify-between items-center p-4 md:p-6 bg-gradient-to-b from-gray-900 to-transparent">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
                  🎉 期間限定特典
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors group"
                >
                  <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 md:px-8 md:pb-8">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {/* Left side - Content */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Title */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        10月撮影特典
                      </h2>
                      <div className="flex items-center gap-1 md:gap-2 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="text-xl md:text-3xl"
                          >
                            ⭐
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Main offer */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3 md:space-y-4"
                    >
                      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-orange-400/30">
                        <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">
                          🎁 特別プレゼント
                        </h3>
                        <p className="text-sm md:text-lg text-gray-200 leading-relaxed">
                          飲食店サイトの
                          <span className="text-yellow-400 font-bold">TOP画像やサムネイル</span>で使用しやすい
                          編集画像を作成して
                          <span className="block text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mt-2">
                            1枚無料プレゼント！
                          </span>
                        </p>
                      </div>

                      {/* Value badge */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.03, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="inline-block"
                      >
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-xl font-bold shadow-xl">
                          通常 ¥11,000 → 無料！
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* CTA Button - Mobile only */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="md:hidden"
                    >
                      <Link href="/services/photo/foodphoto/form">
                        <button id="cta-offer-modal-apply1" className="w-full py-3 px-6 bg-gradient-to-r from-orange-400 to-red-500 text-white text-base font-bold rounded-xl shadow-xl">
                          今すぐ申し込む
                        </button>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right side - Images and conditions */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Image carousel - 1:1 aspect ratio */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative aspect-square w-full max-w-sm mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-xl bg-gray-900"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={images[currentImageIndex]}
                            alt={`サンプル画像 ${currentImageIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-white z-10">
                            <p className="text-xs md:text-sm font-semibold drop-shadow-lg">
                              編集サンプル {currentImageIndex + 1}/3
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Image indicators */}
                      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex gap-1 md:gap-2 z-10">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'w-6 md:w-8 bg-white' 
                                : 'bg-white/50 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Conditions */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-700"
                    >
                      <h4 className="text-xs md:text-sm font-bold text-orange-400 mb-2 md:mb-3 flex items-center">
                        <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        適用条件
                      </h4>
                      <ul className="space-y-1 md:space-y-2 text-xs text-gray-300">
                        <li className="flex items-start">
                          <span className="text-orange-400 mr-1 md:mr-2">①</span>
                          <span>10月中申込→10/31までの撮影限定</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-400 mr-1 md:mr-2">②</span>
                          <span>800px×800px（1:1画像）</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-400 mr-1 md:mr-2">③</span>
                          <span>作成後の修正不可</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-400 mr-1 md:mr-2">④</span>
                          <span>スタンダードプラン（¥44,000）以上</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* CTA Button - Desktop only */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="hidden md:block"
                    >
                      <Link href="/services/photo/foodphoto/form">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          id="cta-offer-modal-apply2"
                          className="w-full py-4 px-8 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xl font-bold rounded-2xl shadow-2xl"
                        >
                          今すぐ申し込む
                        </motion.button>
                      </Link>
                    </motion.div>

                    {/* Urgency message */}
                    <motion.div
                      animate={{ 
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="text-center"
                    >
                      <p className="text-yellow-400 font-bold text-sm md:text-lg">
                        ⏰ 10月限定・残りわずか！
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Global styles for confetti */}
          <style jsx global>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
              }
            }

            .confetti-particle {
              position: absolute;
              width: 8px;
              height: 8px;
              animation: confetti-fall 3s linear forwards;
              border-radius: 50%;
            }

            @media (min-width: 768px) {
              .confetti-particle {
                width: 10px;
                height: 10px;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}