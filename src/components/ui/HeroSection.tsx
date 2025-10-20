'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { DynamicScene3D } from '@/components/3d/DynamicScene3D'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  icon?: string
  gradient?: string
  children?: ReactNode
  backgroundOpacity?: number
  showScene3D?: boolean
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  description,
  icon,
  gradient = 'from-yellow-400 via-yellow-500 to-orange-600',
  children,
  backgroundOpacity = 0.4,
  showScene3D = true,
  className = ''
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const headerY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section 
      ref={containerRef}
      className={`relative min-h-screen flex items-center overflow-hidden ${className}`}
    >
      {/* Background with 3D Scene */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        {showScene3D && <DynamicScene3D className={`opacity-${Math.round(backgroundOpacity * 100)}`} />}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}/20 via-transparent`} />
      </motion.div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-12 md:py-16">
        <motion.div
          style={{ y: headerY }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          {/* Icon */}
          {icon && (
            <motion.div
              variants={itemVariants}
              className="mb-6 sm:mb-8"
            >
              <motion.div 
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br ${gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-xl sm:shadow-2xl relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, 15, -15, 0],
                  boxShadow: "0 25px 50px rgba(255, 193, 7, 0.5)"
                }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-3xl sm:text-4xl md:text-5xl">{icon}</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          )}
          
          {/* Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-white tracking-wide sm:tracking-wider uppercase"
          >
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${/^[A-Za-z\s]+$/.test(title) ? 'eng-only' : ''}`} style={/^[A-Za-z\s]+$/.test(title) ? { fontFamily: "'PixeloidMono', monospace" } : undefined}>
              {title}
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          {subtitle && (
            <motion.h2
              variants={itemVariants}
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              {subtitle}
            </motion.h2>
          )}
          
          {/* Description */}
          {description && (
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4 sm:px-0"
            >
              {description}
            </motion.p>
          )}
          
          {/* Custom Content */}
          {children && (
            <motion.div
              variants={itemVariants}
              className="px-4 sm:px-0"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}