'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OptimizedFloatingCubesProps {
  simplified?: boolean
}

const CubeInstance = ({ position, color, scale, simplified }: {
  position: [number, number, number]
  color: string
  scale: number
  simplified: boolean
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const animationSpeed = useMemo(() => 
    simplified ? 0.5 : 1 + Math.random() * 0.5
  , [simplified])
  
  useFrame((state, delta) => {
    if (meshRef.current && delta < 0.1) {
      const time = state.clock.elapsedTime * animationSpeed
      
      if (!simplified) {
        meshRef.current.rotation.x = time * 0.3
        meshRef.current.rotation.y = time * 0.4
        meshRef.current.position.y = position[1] + Math.sin(time) * 0.2
      } else {
        // Safariでは軽量なアニメーション
        meshRef.current.rotation.y = time * 0.3
      }
    }
  })
  
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.7}
        roughness={0.5}
        metalness={0.3}
      />
    </mesh>
  )
}

export function OptimizedFloatingCubes({ simplified = false }: OptimizedFloatingCubesProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // オブジェクトの配置をメモ化
  const cubes = useMemo(() => [
    { position: [2, 0, 0] as [number, number, number], color: '#fbbf24', scale: 0.5 },
    { position: [-2, 1, 0] as [number, number, number], color: '#3b82f6', scale: 0.3 },
    { position: [0, -1, 1] as [number, number, number], color: '#8b5cf6', scale: 0.4 }
  ], [])
  
  useFrame((state, delta) => {
    if (groupRef.current && !simplified && delta < 0.1) {
      // グループ全体の緩やかな回転
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      {cubes.map((cube, index) => (
        <CubeInstance
          key={index}
          position={cube.position}
          color={cube.color}
          scale={cube.scale}
          simplified={simplified}
        />
      ))}
    </group>
  )
}