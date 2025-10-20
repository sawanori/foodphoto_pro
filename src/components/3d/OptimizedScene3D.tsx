'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { OptimizedFloatingCubes } from './OptimizedFloatingCubes'
import { OptimizedParticleField } from './OptimizedParticleField'
import { OptimizedAnimatedSphere } from './OptimizedAnimatedSphere'
import { PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'

interface OptimizedScene3DProps {
  className?: string
}

export function OptimizedScene3D({ className = "absolute inset-0 z-0" }: OptimizedScene3DProps) {
  const [dpr, setDpr] = useState(1)
  const [isSafari, setIsSafari] = useState(false)
  const [pixelRatio, setPixelRatio] = useState(1)

  useEffect(() => {
    // Safari検出
    const userAgent = window.navigator.userAgent
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent)
    setIsSafari(isSafariBrowser)
    
    // デバイスピクセル比を取得（最大2に制限）
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    setPixelRatio(isSafariBrowser ? Math.min(ratio, 1.5) : ratio)
    
    // Safariの場合は初期DPRを下げる
    if (isSafariBrowser) {
      setDpr(0.8)
    }
  }, [])

  return (
    <div className={className}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: !isSafari, // Safariではアンチエイリアスを無効化
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        dpr={[pixelRatio * 0.5, pixelRatio]}
        frameloop="demand" // 必要な時のみレンダリング
        shadows={false}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, dpr + 0.1))}
          onDecline={() => setDpr(Math.max(0.5, dpr - 0.1))}
          flipflops={3}
          factor={1}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} color="#fbbf24" intensity={0.8} />
            <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
            
            <OptimizedFloatingCubes simplified={isSafari} />
            <OptimizedParticleField count={isSafari ? 100 : 200} />
            <OptimizedAnimatedSphere simplified={isSafari} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}