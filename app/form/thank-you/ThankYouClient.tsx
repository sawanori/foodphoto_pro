'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function ThankYouClient() {
  const [showMessage, setShowMessage] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [particlesActive, setParticlesActive] = useState(true)

  // Timeline steps
  const steps = [
    { title: '申込受付', icon: '📝', status: 'completed' },
    { title: '内容確認中', icon: '👀', status: 'current' },
    { title: 'ご連絡', icon: '📞', status: 'pending' },
  ]

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Orange and red theme confetti
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#fb923c', '#ef4444', '#fbbf24', '#f97316', '#dc2626']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#fb923c', '#ef4444', '#fbbf24', '#f97316', '#dc2626']
      })
    }, 250)

    // Show message after delay
    setTimeout(() => setShowMessage(true), 500)

    // Animate timeline
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 1) return prev + 1
        return prev
      })
    }, 2000)

    // Stop particles after 10 seconds
    setTimeout(() => setParticlesActive(false), 10000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating Particles */}
        {particlesActive && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/50 rounded-full"
            initial={{
              x: `${Math.random() * 100}%`,
              y: '100vh',
            }}
            animate={{
              y: '-100px',
              x: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Success Icon Animation */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1
              }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(251, 146, 60, 0.5)",
                      "0 0 0 30px rgba(251, 146, 60, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-6xl"
                  >
                    ✓
                  </motion.div>
                </motion.div>
                
                {/* Rotating Ring */}
                <motion.div
                  className="absolute inset-0 border-4 border-orange-400/30 rounded-full"
                  style={{ borderStyle: 'dashed' }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12 max-w-2xl"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              送信完了しました！
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            お申し込みありがとうございます
          </motion.p>
          
          <motion.p
            className="text-lg text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            担当者より<span className="text-orange-400 font-bold">2営業日以内</span>にご連絡させていただきます
          </motion.p>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-12 w-full max-w-3xl"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-orange-400/20">
            <h3 className="text-lg font-semibold text-gray-300 mb-6 text-center">次のステップ</h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                  >
                    <motion.div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-2xl
                        ${index <= currentStep 
                          ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' 
                          : 'bg-gray-700 text-gray-400'}
                      `}
                      animate={index === currentStep ? {
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{
                        duration: 1,
                        repeat: index === currentStep ? Infinity : 0,
                        repeatDelay: 1
                      }}
                    >
                      {step.icon}
                    </motion.div>
                    <span className="mt-2 text-xs text-gray-400 text-center max-w-[80px]">
                      {step.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl"
        >
          {[
            {
              icon: '📧',
              title: '確認メール送信済み',
              description: 'ご登録いただいたメールアドレスに確認メールをお送りしました'
            },
            {
              icon: '📅',
              title: '日程調整',
              description: 'ご希望の撮影日時を確認し、最適なカメラマンをアサインします'
            },
            {
              icon: '💬',
              title: 'お急ぎの場合',
              description: 'お電話でのお問い合わせも承っております'
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-orange-400/10 hover:border-orange-400/30 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 + index * 0.1 }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h4 className="text-white font-semibold mb-2">{card.title}</h4>
              <p className="text-gray-400 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-xl hover:from-orange-500 hover:to-red-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              サービス詳細に戻る
            </motion.button>
          </Link>
          
          <Link href="/">
            <motion.button
              className="px-8 py-4 bg-transparent border-2 border-orange-400 text-orange-400 font-bold rounded-xl hover:bg-orange-400/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              トップページへ
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating Camera Icon */}
        <motion.div
          className="absolute bottom-10 right-10 text-6xl opacity-10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          📸
        </motion.div>
      </div>
    </div>
  )
}