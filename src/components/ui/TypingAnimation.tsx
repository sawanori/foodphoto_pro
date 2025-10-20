'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypingAnimationProps {
  text: string
  delay?: number
  duration?: number
  className?: string
  showCursor?: boolean
  cursorColor?: string
  onComplete?: () => void
}

export function TypingAnimation({
  text,
  delay = 0,
  duration = 100,
  className = '',
  showCursor = true,
  cursorColor = 'text-yellow-400',
  onComplete
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showCursorBlink, setShowCursorBlink] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, currentIndex === 0 ? delay : duration)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
      
      // Hide cursor after typing is complete
      if (showCursor) {
        setTimeout(() => {
          setShowCursorBlink(false)
        }, 2000)
      }
    }
  }, [currentIndex, text, delay, duration, isComplete, onComplete, showCursor])

  return (
    <span className={className}>
      {displayedText}
      <AnimatePresence>
        {showCursor && showCursorBlink && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className={`inline-block ${cursorColor}`}
          >
            |
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

interface TypewriterProps {
  words: string[]
  deleteDelay?: number
  typeSpeed?: number
  deleteSpeed?: number
  className?: string
  cursorColor?: string
}

export function Typewriter({
  words,
  deleteDelay = 1000,
  typeSpeed = 100,
  deleteSpeed = 50,
  className = '',
  cursorColor = 'text-yellow-400'
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    
    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false)
        setIsDeleting(true)
      }, deleteDelay)
      return () => clearTimeout(timer)
    }

    if (!isDeleting && currentText === currentWord) {
      setIsWaiting(true)
      return
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false)
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1))
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timer)
  }, [currentText, currentWordIndex, isDeleting, isWaiting, words, typeSpeed, deleteSpeed, deleteDelay])

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className={`inline-block ${cursorColor}`}
      >
        |
      </motion.span>
    </span>
  )
}