import { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  fps: number
  memory: number | null
  isSafari: boolean
  isLowPerformance: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: null,
    isSafari: false,
    isLowPerformance: false,
    deviceType: 'desktop'
  })

  const detectDevice = useCallback(() => {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }, [])

  const detectSafari = useCallback(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /^((?!chrome|android).)*safari/i.test(userAgent)
  }, [])

  const measureFPS = useCallback(() => {
    let fps = 60
    let lastTime = performance.now()
    let frames = 0
    
    const calculateFPS = () => {
      frames++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime))
        frames = 0
        lastTime = currentTime
        
        // 低パフォーマンス検出
        const isLow = fps < 30 || (metrics.isSafari && fps < 45)
        
        setMetrics(prev => ({
          ...prev,
          fps,
          isLowPerformance: isLow
        }))
      }
      
      if (frames < 200) { // 最初の200フレームを測定
        requestAnimationFrame(calculateFPS)
      }
    }
    
    requestAnimationFrame(calculateFPS)
  }, [metrics.isSafari])

  const getMemoryUsage = useCallback(() => {
    // @ts-expect-error - performance.memory is Chrome-specific
    if (performance.memory) {
      // @ts-expect-error - performance.memory is Chrome-specific
      const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1048576)
      return memoryMB
    }
    return null
  }, [])

  useEffect(() => {
    const isSafari = detectSafari()
    const deviceType = detectDevice()
    
    setMetrics(prev => ({
      ...prev,
      isSafari,
      deviceType,
      memory: getMemoryUsage()
    }))

    // FPS測定開始
    const measureTimeout = setTimeout(() => {
      measureFPS()
    }, 1000)

    // デバイスの向き変更を検出
    const handleResize = () => {
      setMetrics(prev => ({
        ...prev,
        deviceType: detectDevice()
      }))
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(measureTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [detectDevice, detectSafari, getMemoryUsage, measureFPS])

  const getOptimizationSettings = useCallback(() => {
    const { isSafari, isLowPerformance, deviceType } = metrics
    
    return {
      // 3Dレンダリング設定
      use3D: !isLowPerformance && deviceType === 'desktop',
      simplified3D: isSafari || deviceType !== 'desktop',
      particleCount: isLowPerformance ? 50 : (deviceType === 'mobile' ? 100 : 200),
      
      // アニメーション設定
      enableComplexAnimations: !isLowPerformance && !isSafari,
      animationDuration: isSafari ? 1.5 : 1,
      
      // 画質設定
      imageQuality: isLowPerformance ? 75 : 90,
      useLazyLoading: true,
      
      // レンダリング設定
      dpr: isLowPerformance ? 1 : (isSafari ? 1.5 : 2),
      antialias: !isSafari && !isLowPerformance,
      
      // CSS最適化
      useGPUAcceleration: !isSafari || deviceType === 'desktop',
      useBackdropFilter: !isSafari,
      useWillChange: !isSafari
    }
  }, [metrics])

  return {
    metrics,
    settings: getOptimizationSettings(),
    isSafari: metrics.isSafari,
    isLowPerformance: metrics.isLowPerformance
  }
}