'use client'

import { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Scene3D with no SSR
const Scene3D = dynamic(() => import('./Scene3D').then(mod => ({ default: mod.Scene3D })), {
  ssr: false,
  loading: () => <Scene3DFallback />
})

interface Scene3DWrapperProps {
  className?: string
}

// Fallback component for when WebGL is not supported
function Scene3DFallback({ className = "absolute inset-0 z-0" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-500/10">
        {/* Animated CSS background as fallback */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-500/20 rounded-full animate-ping"></div>
        
        {/* CSS-only particle effect - deterministic positioning to avoid hydration mismatch */}
        <div className="absolute inset-0 opacity-50">
          {Array.from({ length: 20 }, (_, i) => {
            // Create deterministic values based on index to avoid hydration mismatch
            const positions = [
              { left: 10, top: 20 }, { left: 85, top: 15 }, { left: 30, top: 80 }, { left: 70, top: 60 },
              { left: 50, top: 10 }, { left: 20, top: 90 }, { left: 95, top: 45 }, { left: 40, top: 30 },
              { left: 60, top: 75 }, { left: 15, top: 55 }, { left: 80, top: 25 }, { left: 25, top: 70 },
              { left: 90, top: 85 }, { left: 45, top: 5 }, { left: 65, top: 95 }, { left: 35, top: 40 },
              { left: 75, top: 65 }, { left: 55, top: 35 }, { left: 5, top: 50 }, { left: 85, top: 75 }
            ]
            const delays = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9]
            const durations = [2, 2.5, 3, 3.5, 4, 4.5, 5, 2.2, 2.8, 3.2, 3.8, 4.2, 4.8, 2.4, 2.6, 3.4, 3.6, 4.4, 4.6, 2.3]
            
            const position = positions[i] || { left: 50, top: 50 }
            const animationDelay = delays[i] || 0
            const animationDuration = durations[i] || 3
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  animationDelay: `${animationDelay}s`,
                  animationDuration: `${animationDuration}s`
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Scene3DWrapper({ className }: Scene3DWrapperProps) {
  const [isClient, setIsClient] = useState(false)
  const [webGLSupported, setWebGLSupported] = useState(false)

  useEffect(() => {
    // Only run on client
    setIsClient(true)
    
    // Check WebGL support
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (!gl) {
          console.warn('WebGL not supported, using fallback')
          return false
        }

        // Additional Chrome-specific checks
        if (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            
            // Check for software rendering (common issue in Chrome)
            if (renderer && renderer.toLowerCase().includes('software')) {
              console.warn('Software WebGL rendering detected, using fallback')
              return false
            }
          }
        }

        return true
      } catch (error) {
        console.warn('WebGL support check failed:', error)
        return false
      }
    }

    setWebGLSupported(checkWebGLSupport())
  }, [])

  // Always render fallback on server and initially on client
  if (!isClient || !webGLSupported) {
    return <Scene3DFallback className={className} />
  }

  return (
    <Suspense fallback={<Scene3DFallback className={className} />}>
      <Scene3D className={className} />
    </Suspense>
  )
}