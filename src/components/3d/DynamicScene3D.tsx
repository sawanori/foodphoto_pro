'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading fallback component
const LoadingFallback = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-500/10">
      {/* Animated CSS background as fallback */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-500/20 rounded-full animate-ping"></div>
    </div>
  </div>
)

// Dynamically import Scene3D component with no SSR
export const DynamicScene3D = dynamic(
  () => import('./Scene3D').then(mod => ({ default: mod.Scene3D })),
  {
    ssr: false,
    loading: () => <LoadingFallback />
  }
) as ComponentType<{ className?: string }>

// Dynamically import AnimatedSphere component
export const DynamicAnimatedSphere = dynamic(
  () => import('./AnimatedSphere').then(mod => ({ default: mod.AnimatedSphere })),
  {
    ssr: false,
    loading: () => <LoadingFallback />
  }
) as ComponentType<{ className?: string }>

// Dynamically import FloatingCubes component
export const DynamicFloatingCubes = dynamic(
  () => import('./FloatingCubes').then(mod => ({ default: mod.FloatingCubes })),
  {
    ssr: false,
    loading: () => <LoadingFallback />
  }
) as ComponentType<{ className?: string }>

// Dynamically import ParticleField component
export const DynamicParticleField = dynamic(
  () => import('./ParticleField').then(mod => ({ default: mod.ParticleField })),
  {
    ssr: false,
    loading: () => <LoadingFallback />
  }
) as ComponentType<{ className?: string }>