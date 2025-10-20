'use client'

import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    
    window.addEventListener('mousemove', updateMousePosition)
    
    const hoverElements = document.querySelectorAll('button, a, .cursor-hover')
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])
  
  return (
    <>
      <div 
        className="fixed w-4 h-4 rounded-full bg-yellow-400 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      />
      <div 
        className="fixed w-8 h-8 rounded-full border border-yellow-400 pointer-events-none z-[9998] mix-blend-difference transition-transform duration-300 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
          opacity: isHovering ? 0.5 : 1
        }}
      />
    </>
  )
}
