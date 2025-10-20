'use client'

import { useEffect, useRef, useState, useCallback, useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  className?: string
  particleCount?: number
  colors?: string[]
  particleSize?: [number, number] // [min, max]
  speed?: [number, number] // [min, max]
  direction?: 'up' | 'down' | 'left' | 'right' | 'random' | 'center'
  effect?: 'floating' | 'explosion' | 'orbit' | 'wave' | 'spiral' | 'magnetic'
  interactive?: boolean
  followMouse?: boolean
  gravity?: number
  wind?: number
  connectionDistance?: number
  showConnections?: boolean
  emissionRate?: number
  lifetime?: [number, number] // [min, max] in milliseconds
  respawn?: boolean
}

export function ParticleSystem({
  className,
  particleCount = 50,
  colors = ['#fbbf24', '#f59e0b', '#d97706'],
  particleSize = [2, 6],
  speed = [0.5, 2],
  direction = 'random',
  effect = 'floating',
  interactive = false,
  followMouse = false,
  gravity = 0,
  wind = 0,
  connectionDistance = 100,
  showConnections = false,
  emissionRate = 1,
  lifetime = [3000, 6000],
  respawn = true
}: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const _particleIdPrefix = useId()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(true)
  const lastEmissionTime = useRef(0)

  // Create a new particle
  const createParticle = useCallback((
    x?: number, 
    y?: number, 
    forceDirection?: { x: number; y: number }
  ): Particle => {
    const container = containerRef.current
    if (!container) {
      return {
        id: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 4,
        opacity: 1,
        color: colors[0],
        life: 0,
        maxLife: 5000
      }
    }

    const rect = container.getBoundingClientRect()
    const startX = x ?? rect.width / 2
    const startY = y ?? rect.height / 2
    
    let vx = 0, vy = 0
    
    if (forceDirection) {
      vx = forceDirection.x
      vy = forceDirection.y
    } else {
      const minSpeed = speed[0]
      const maxSpeed = speed[1]
      const velocity = minSpeed + Math.random() * (maxSpeed - minSpeed)
      
      switch (direction) {
        case 'up':
          vx = (Math.random() - 0.5) * velocity * 0.5
          vy = -velocity
          break
        case 'down':
          vx = (Math.random() - 0.5) * velocity * 0.5
          vy = velocity
          break
        case 'left':
          vx = -velocity
          vy = (Math.random() - 0.5) * velocity * 0.5
          break
        case 'right':
          vx = velocity
          vy = (Math.random() - 0.5) * velocity * 0.5
          break
        case 'center':
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const angle = Math.atan2(centerY - startY, centerX - startX)
          vx = Math.cos(angle) * velocity
          vy = Math.sin(angle) * velocity
          break
        case 'random':
        default:
          const angle2 = Math.random() * Math.PI * 2
          vx = Math.cos(angle2) * velocity
          vy = Math.sin(angle2) * velocity
          break
      }
    }

    return {
      id: 0,
      x: startX,
      y: startY,
      vx,
      vy,
      size: particleSize[0],
      opacity: 0.8,
      color: colors[0],
      life: 0,
      maxLife: lifetime[0]
    }
  }, [colors, particleSize, speed, direction, lifetime])

  // Initialize particles
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const initialParticles = Array.from({ length: particleCount }, (_, index) => {
      const particle = createParticle()
      // Create unique ID using index
      particle.id = index
      // Randomize properties only on client
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        particle.x = Math.random() * rect.width
        particle.y = Math.random() * rect.height
        particle.size = particleSize[0] + Math.random() * (particleSize[1] - particleSize[0])
        particle.opacity = 0.8 + Math.random() * 0.2
        particle.color = colors[Math.floor(Math.random() * colors.length)]
        particle.maxLife = lifetime[0] + Math.random() * (lifetime[1] - lifetime[0])
        
        // Set random velocity based on direction
        const minSpeed = speed[0]
        const maxSpeed = speed[1]
        const velocity = minSpeed + Math.random() * (maxSpeed - minSpeed)
        
        switch (direction) {
          case 'up':
            particle.vx = (Math.random() - 0.5) * velocity * 0.5
            particle.vy = -velocity
            break
          case 'down':
            particle.vx = (Math.random() - 0.5) * velocity * 0.5
            particle.vy = velocity
            break
          case 'left':
            particle.vx = -velocity
            particle.vy = (Math.random() - 0.5) * velocity * 0.5
            break
          case 'right':
            particle.vx = velocity
            particle.vy = (Math.random() - 0.5) * velocity * 0.5
            break
          case 'center':
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const angle = Math.atan2(centerY - particle.y, centerX - particle.x)
            particle.vx = Math.cos(angle) * velocity
            particle.vy = Math.sin(angle) * velocity
            break
          case 'random':
          default:
            const angle2 = Math.random() * Math.PI * 2
            particle.vx = Math.cos(angle2) * velocity
            particle.vy = Math.sin(angle2) * velocity
            break
        }
      }
      return particle
    })
    setParticles(initialParticles)
  }, [particleCount, createParticle, colors, particleSize, lifetime, speed, direction])

  // Handle mouse movement
  useEffect(() => {
    if (!interactive && !followMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    const handleMouseClick = (e: MouseEvent) => {
      if (!interactive) return
      
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      // Create explosion effect
      if (effect === 'explosion') {
        const newParticles = Array.from({ length: 10 }, (_, i) => {
          const angle = Math.random() * Math.PI * 2
          const velocity = 2 + Math.random() * 4
          const particle = createParticle(clickX, clickY, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity
          })
          particle.id = Date.now() + i
          particle.size = particleSize[0] + Math.random() * (particleSize[1] - particleSize[0])
          particle.opacity = 0.8 + Math.random() * 0.2
          particle.color = colors[Math.floor(Math.random() * colors.length)]
          particle.maxLife = lifetime[0] + Math.random() * (lifetime[1] - lifetime[0])
          return particle
        })
        
        setParticles(prev => [...prev, ...newParticles])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleMouseClick)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleMouseClick)
    }
  }, [interactive, followMouse, effect, createParticle, colors, lifetime, particleSize])

  // Animation loop
  useEffect(() => {
    if (!isActive) return

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - (animationRef.current || currentTime)
      animationRef.current = currentTime

      setParticles(prevParticles => {
        const container = containerRef.current
        if (!container) return prevParticles

        const rect = container.getBoundingClientRect()
        const updatedParticles = prevParticles.map(particle => {
          let { x, y, vx, vy, life } = particle
          const { maxLife } = particle

          // Update lifetime
          life += deltaTime

          // Apply gravity
          vy += gravity * deltaTime * 0.001

          // Apply wind
          vx += wind * deltaTime * 0.001

          // Effect-specific behaviors
          switch (effect) {
            case 'orbit':
              const centerX = rect.width / 2
              const centerY = rect.height / 2
              const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
              const angle = Math.atan2(y - centerY, x - centerX) + 0.02
              x = centerX + Math.cos(angle) * distance
              y = centerY + Math.sin(angle) * distance
              break

            case 'wave':
              y += Math.sin(x * 0.01 + currentTime * 0.001) * 0.5
              x += vx
              break

            case 'spiral':
              const spiralAngle = currentTime * 0.001 + particle.id
              const radius = 50 + Math.sin(currentTime * 0.001) * 30
              x = rect.width / 2 + Math.cos(spiralAngle) * radius
              y = rect.height / 2 + Math.sin(spiralAngle) * radius
              break

            case 'magnetic':
              if (followMouse) {
                const dx = mousePosition.x - x
                const dy = mousePosition.y - y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const force = Math.min(200 / distance, 2)
                vx += (dx / distance) * force * 0.1
                vy += (dy / distance) * force * 0.1
              }
              x += vx
              y += vy
              break

            default:
              x += vx
              y += vy
              break
          }

          // Boundary behavior
          if (effect !== 'orbit' && effect !== 'spiral') {
            if (x < 0 || x > rect.width) {
              if (respawn) {
                x = x < 0 ? rect.width : 0
              } else {
                vx *= -0.8
                x = Math.max(0, Math.min(rect.width, x))
              }
            }
            if (y < 0 || y > rect.height) {
              if (respawn) {
                y = y < 0 ? rect.height : 0
              } else {
                vy *= -0.8
                y = Math.max(0, Math.min(rect.height, y))
              }
            }
          }

          // Apply friction
          vx *= 0.999
          vy *= 0.999

          return {
            ...particle,
            x,
            y,
            vx,
            vy,
            life,
            opacity: Math.max(0, 1 - life / maxLife)
          }
        })

        // Remove dead particles and add new ones if respawn is enabled
        let aliveParticles = updatedParticles.filter(p => p.life < p.maxLife)
        
        if (respawn && aliveParticles.length < particleCount) {
          const needParticles = particleCount - aliveParticles.length
          
          // Emission rate control
          if (currentTime - lastEmissionTime.current >= 1000 / emissionRate) {
            const newParticles = Array.from({ length: Math.min(needParticles, 5) }, (_, i) => {
              const particle = createParticle()
              particle.id = Date.now() + i
              // Randomize properties for new particles
              const rect = containerRef.current?.getBoundingClientRect()
              if (rect) {
                particle.x = Math.random() * rect.width
                particle.y = Math.random() * rect.height
                particle.size = particleSize[0] + Math.random() * (particleSize[1] - particleSize[0])
                particle.opacity = 0.8 + Math.random() * 0.2
                particle.color = colors[Math.floor(Math.random() * colors.length)]
                particle.maxLife = lifetime[0] + Math.random() * (lifetime[1] - lifetime[0])
                
                const minSpeed = speed[0]
                const maxSpeed = speed[1]
                const velocity = minSpeed + Math.random() * (maxSpeed - minSpeed)
                const angle = Math.random() * Math.PI * 2
                particle.vx = Math.cos(angle) * velocity
                particle.vy = Math.sin(angle) * velocity
              }
              return particle
            })
            aliveParticles = [...aliveParticles, ...newParticles]
            lastEmissionTime.current = currentTime
          }
        }

        return aliveParticles
      })

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, effect, gravity, wind, followMouse, mousePosition, respawn, particleCount, emissionRate, createParticle, colors, lifetime, particleSize, speed])

  // Calculate connections between particles
  const connections = showConnections ? particles.flatMap((particle, i) => 
    particles.slice(i + 1).map((otherParticle) => {
      const distance = Math.sqrt(
        (particle.x - otherParticle.x) ** 2 + 
        (particle.y - otherParticle.y) ** 2
      )
      
      if (distance < connectionDistance) {
        return {
          from: particle,
          to: otherParticle,
          opacity: Math.max(0, 1 - distance / connectionDistance) * 0.3
        }
      }
      return null
    }).filter(Boolean)
  ).filter(Boolean) : []

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className
      )}
    >
      {/* Connections */}
      {showConnections && (
        <svg className="absolute inset-0 w-full h-full">
          {connections.map((connection, i) => (
            connection && (
              <line
                key={i}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke={connection.from.color}
                strokeWidth="1"
                opacity={connection.opacity}
              />
            )
          ))}
        </svg>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      ))}

      {/* Controls */}
      {interactive && (
        <div className="absolute top-4 right-4 z-10 pointer-events-auto">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-3 py-1 bg-black/50 text-white text-sm rounded hover:bg-black/70 transition-colors"
          >
            {isActive ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </div>
  )
}