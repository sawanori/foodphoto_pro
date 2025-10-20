'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OptimizedAnimatedSphereProps {
  simplified?: boolean
}

export function OptimizedAnimatedSphere({ simplified = false }: OptimizedAnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  // Safariでは低ポリゴンメッシュを使用
  const segments = simplified ? 16 : 32
  
  // アニメーション用の変数をメモ化
  const animationData = useMemo(() => ({
    time: 0,
    rotationSpeed: simplified ? 0.2 : 0.3,
    floatSpeed: simplified ? 0.8 : 1
  }), [simplified])
  
  useFrame((state, delta) => {
    if (meshRef.current && delta < 0.1) { // フレームスキップ対策
      animationData.time += delta
      
      // 簡略化モードではアニメーションを減らす
      if (!simplified) {
        meshRef.current.rotation.x = animationData.time * animationData.rotationSpeed
        meshRef.current.rotation.y = animationData.time * animationData.rotationSpeed * 1.3
      } else {
        // Safariでは回転のみ
        meshRef.current.rotation.y = animationData.time * animationData.rotationSpeed
      }
      
      // 浮遊アニメーション
      meshRef.current.position.y = Math.sin(animationData.time * animationData.floatSpeed) * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} scale={1.2}>
      <sphereGeometry args={[1, segments, segments]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#fbbf24"
        transparent
        opacity={0.15}
        wireframe
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  )
}