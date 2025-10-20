'use client'

import { useState, useEffect, useRef } from 'react'

interface StatCounterProps {
  end: number
  duration?: number
  suffix?: string
}

export function StatCounter({ end, duration = 2000, suffix = '' }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const countRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          
          const startTime = Date.now()
          const startValue = 0
          const endValue = end
          
          const updateCount = () => {
            const currentTime = Date.now()
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
            
            setCount(currentCount)
            
            if (progress < 1) {
              requestAnimationFrame(updateCount)
            }
          }
          
          requestAnimationFrame(updateCount)
        }
      },
      { threshold: 0.5 }
    )
    
    if (countRef.current) {
      observer.observe(countRef.current)
    }
    
    return () => observer.disconnect()
  }, [end, duration, isVisible])
  
  return (
    <div ref={countRef} className="text-4xl md:text-6xl font-bold text-yellow-400">
      {count.toLocaleString()}{suffix}
    </div>
  )
}