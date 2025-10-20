'use client'

import { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// CSS-only fallback for better performance
const StaticFallback = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-500/10">
      {/* Pure CSS animations instead of JS */}
      <div 
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/20 rounded-full"
        style={{
          animation: 'float 4s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full"
        style={{
          animation: 'float 6s ease-in-out infinite reverse'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-500/20 rounded-full"
        style={{
          animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    </div>
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
    `}</style>
  </div>
)

// Lazy load only when needed
const DynamicScene3D = dynamic(
  () => import('./DynamicScene3D').then(mod => ({ default: mod.DynamicScene3D })),
  {
    ssr: false,
    loading: () => <StaticFallback />
  }
)

interface ConditionalScene3DProps {
  className?: string;
  forceLoad?: boolean;
  enableWebGL?: boolean;
}

export function ConditionalScene3D({ 
  className,
  forceLoad = false,
  enableWebGL = true
}: ConditionalScene3DProps) {
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  })
  
  const [shouldLoad3D, setShouldLoad3D] = useState(false)
  const [hasWebGLSupport, setHasWebGLSupport] = useState(true)

  useEffect(() => {
    if (!enableWebGL) return

    // Check WebGL support and device performance
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (!gl) return false
        
        // Check for device performance indicators
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        const isSlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
        
        return !isMobile && !isSlowDevice
      } catch {
        return false
      }
    }

    setHasWebGLSupport(checkWebGLSupport())
  }, [enableWebGL])

  useEffect(() => {
    if (forceLoad || (isVisible && hasWebGLSupport && enableWebGL)) {
      setShouldLoad3D(true)
    }
  }, [isVisible, hasWebGLSupport, forceLoad, enableWebGL])

  return (
    <div ref={containerRef} className={className || "absolute inset-0 z-0"}>
      {shouldLoad3D ? (
        <Suspense fallback={<StaticFallback />}>
          <DynamicScene3D className={className} />
        </Suspense>
      ) : (
        <StaticFallback />
      )}
    </div>
  )
}