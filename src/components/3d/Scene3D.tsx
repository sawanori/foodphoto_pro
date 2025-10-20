'use client'

import { Canvas } from '@react-three/fiber'
import { FloatingCubes } from './FloatingCubes'
import { ParticleField } from './ParticleField'
import { AnimatedSphere } from './AnimatedSphere'

interface Scene3DProps {
  className?: string
}

export function Scene3D({ className = "absolute inset-0 z-0" }: Scene3DProps) {
  return (
    <div className={className}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#fbbf24" intensity={0.8} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
        <FloatingCubes />
        <ParticleField />
        <AnimatedSphere />
      </Canvas>
    </div>
  )
}