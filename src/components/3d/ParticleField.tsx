'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const particlesCount = 200
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      const seed1 = Math.sin(i * 0.1) * 10000
      const seed2 = Math.cos(i * 0.2) * 10000
      const seed3 = Math.sin(i * 0.3) * 10000
      pos[i * 3] = (seed1 - Math.floor(seed1)) * 10 - 5
      pos[i * 3 + 1] = (seed2 - Math.floor(seed2)) * 10 - 5
      pos[i * 3 + 2] = (seed3 - Math.floor(seed3)) * 10 - 5
    }
    return pos
  }, [])
  
  const colors = useMemo(() => {
    const col = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      const seed1 = Math.sin(i * 0.4) * 10000
      const seed2 = Math.sin(i * 0.5) * 10000
      const seed3 = Math.sin(i * 0.6) * 10000
      col[i * 3] = seed1 - Math.floor(seed1)
      col[i * 3 + 1] = seed2 - Math.floor(seed2)
      col[i * 3 + 2] = seed3 - Math.floor(seed3)
    }
    return col
  }, [])
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.1
      points.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        vertexColors 
        transparent 
        opacity={0.6} 
        sizeAttenuation
      />
    </points>
  )
}