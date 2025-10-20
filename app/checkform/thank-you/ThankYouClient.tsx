'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function ThankYouClient() {
  useEffect(() => {
    // Celebration confetti
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      spread: 50,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FF8C42', '#FFB366', '#FF6347'],
    })
    fire(0.2, {
      spread: 60,
      colors: ['#FF8C42', '#FFB366', '#FF6347'],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FF8C42', '#FFB366', '#FF6347'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#FF8C42', '#FFB366', '#FF6347'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#FF8C42', '#FFB366', '#FF6347'],
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="px-4">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            お申し込み完了！
          </h1>
          <p className="text-xl text-gray-300">
            無料撮影サンプルのお申し込みを受け付けました
          </p>
        </motion.div>
      </div>
    </div>
  )
}