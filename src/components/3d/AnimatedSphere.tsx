'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} scale={viewport.width > 4 ? 1.5 : 1}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#fbbf24"
        transparent
        opacity={0.1}
        distort={0.5}
        speed={1}
        wireframe
      />
    </mesh>
  )
}