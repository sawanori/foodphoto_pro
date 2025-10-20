'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

export function FloatingCubes() {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime) * 0.5
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.3
    }
  })
  
  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <MeshDistortMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.8} 
            distort={0.3} 
            speed={2} 
          />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[-2, 1, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <MeshDistortMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.6} 
            distort={0.4} 
            speed={1.5} 
          />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={0.7} floatIntensity={0.7}>
        <mesh position={[0, -1, 1]}>
          <octahedronGeometry args={[0.4]} />
          <MeshDistortMaterial 
            color="#8b5cf6" 
            transparent 
            opacity={0.7} 
            distort={0.2} 
            speed={3} 
          />
        </mesh>
      </Float>
    </group>
  )
}