'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OptimizedParticleFieldProps {
  count?: number
}

export function OptimizedParticleField({ count = 200 }: OptimizedParticleFieldProps) {
  const points = useRef<THREE.Points>(null)
  const particlesCount = count
  
  // パーティクルデータをメモ化
  const particleData = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    const colors = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount; i++) {
      // より効率的な乱数生成
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const radius = 3 + Math.random() * 2
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // カラー設定
      colors[i * 3] = 0.5 + Math.random() * 0.5
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
    }
    
    return { positions, colors }
  }, [particlesCount])
  
  // ジオメトリをメモ化
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(particleData.positions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(particleData.colors, 3))
    return geo
  }, [particleData])
  
  // アニメーションデータ
  const animData = useMemo(() => ({
    rotationSpeed: count > 100 ? 0.05 : 0.08,
    time: 0
  }), [count])
  
  useFrame((state, delta) => {
    if (points.current && delta < 0.1) {
      animData.time += delta
      // より軽量なアニメーション
      points.current.rotation.y = animData.time * animData.rotationSpeed
    }
  })
  
  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial 
        size={0.02} 
        vertexColors 
        transparent 
        opacity={0.5}
        sizeAttenuation={false} // パフォーマンス向上のため無効化
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}