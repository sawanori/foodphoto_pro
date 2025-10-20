'use client'

import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface AnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// Fade in animation using CSS transitions
export function FadeIn({ children, className = '', delay = 0, duration = 600 }: AnimationProps) {
  const [animationRef, isVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (isVisible && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay, isAnimated])

  return (
    <div
      ref={animationRef}
      className={className}
      style={{
        opacity: isAnimated ? 1 : 0,
        transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Slide up animation
export function SlideUp({ children, className = '', delay = 0, duration = 600 }: AnimationProps) {
  const [animationRef, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div
      ref={animationRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Scale animation
export function ScaleIn({ children, className = '', delay = 0, duration = 600 }: AnimationProps) {
  const [animationRef, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div
      ref={animationRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Stagger animation for lists
interface StaggerProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function Stagger({ children, className = '', staggerDelay = 100, duration = 600 }: StaggerProps) {
  const [animationRef, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div ref={animationRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            transitionDelay: `${index * staggerDelay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Parallax scroll effect (lightweight)
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 0-1, where 0 is no movement and 1 is normal scroll speed
}

export function Parallax({ children, className = '', speed = 0.5 }: ParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('translateY(0px)')

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset || document.documentElement.scrollTop
      const rate = scrolled * -speed

      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        setTransform(`translateY(${rate}px)`)
      }
    }

    // Throttle scroll events for performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [speed])

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  )
}