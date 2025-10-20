'use client'

// import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { FadeIn, SlideUp, ScaleIn } from '@/components/animations/LightweightAnimations'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  once?: boolean
  threshold?: number
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  once = true,
  threshold = 0.1
}: AnimatedSectionProps) {
  const durationMs = Math.round(duration * 1000)

  // Use lightweight animations based on direction
  switch (direction) {
    case 'up':
    case 'down':
      return (
        <SlideUp className={className} delay={delay * 1000} duration={durationMs}>
          {children}
        </SlideUp>
      )
    case 'scale':
      return (
        <ScaleIn className={className} delay={delay * 1000} duration={durationMs}>
          {children}
        </ScaleIn>
      )
    default:
      return (
        <FadeIn className={className} delay={delay * 1000} duration={durationMs}>
          {children}
        </FadeIn>
      )
  }
}