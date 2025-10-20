'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization'

// 最適化されたScene3Dを動的インポート
const OptimizedScene3D = dynamic(
  () => import('./OptimizedScene3D').then(mod => mod.OptimizedScene3D),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-black" />
  }
)

// 既存のScene3Dを動的インポート（フォールバック用）
const Scene3D = dynamic(
  () => import('./Scene3D').then(mod => mod.Scene3D),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-black" />
  }
)

interface DynamicOptimizedScene3DProps {
  className?: string
  forceOptimized?: boolean
}

export function DynamicOptimizedScene3D({ 
  className = "absolute inset-0 z-0",
  forceOptimized = true 
}: DynamicOptimizedScene3DProps) {
  const { settings, isLowPerformance } = usePerformanceOptimization()
  
  // 3D表示しない場合のフォールバック
  if (!settings.use3D) {
    return (
      <div className={className}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black opacity-70" />
      </div>
    )
  }
  
  // パフォーマンスが低い場合は軽量版を使用
  if (isLowPerformance || forceOptimized) {
    return (
      <Suspense fallback={
        <div className={className}>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
        </div>
      }>
        <OptimizedScene3D className={className} />
      </Suspense>
    )
  }
  
  // 通常版を使用
  return (
    <Suspense fallback={
      <div className={className}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
      </div>
    }>
      <Scene3D className={className} />
    </Suspense>
  )
}