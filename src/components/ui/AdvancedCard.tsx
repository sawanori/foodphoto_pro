'use client'

import { forwardRef, useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdvancedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'neon' | 'holographic'
  effect?: 'none' | 'tilt' | 'float' | 'glow' | 'parallax' | 'magnetic' | 'morphing'
  glowColor?: string
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  interactive?: boolean
}

const AdvancedCard = forwardRef<HTMLDivElement, AdvancedCardProps>(
  ({ 
    className,
    variant = 'default',
    effect = 'none',
    glowColor = '#fbbf24',
    children,
    header,
    footer,
    interactive = true,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()
    
    // Motion values for advanced effects
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [30, -30])
    const rotateY = useTransform(x, [-100, 100], [-30, 30])
    const scale = useMotionValue(1)

    // Variant styles
    const variants = {
      default: 'bg-gray-900 border border-gray-700',
      elevated: 'bg-gradient-to-br from-gray-900 to-black shadow-2xl border border-gray-800',
      outlined: 'bg-transparent border-2 border-gray-600',
      glass: 'bg-white/10 backdrop-blur-xl border border-white/20',
      neon: 'bg-black border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      holographic: 'bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 border border-purple-400/30'
    }

    // Effect handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return
      
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      
      if (effect === 'tilt') {
        x.set(deltaX * 0.1)
        y.set(deltaY * 0.1)
      } else if (effect === 'magnetic') {
        x.set(deltaX * 0.05)
        y.set(deltaY * 0.05)
      }
    }

    const handleMouseEnter = () => {
      if (!interactive) return
      
      setIsHovered(true)
      
      if (effect === 'float') {
        controls.start({
          y: -10,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        })
      } else if (effect === 'glow') {
        controls.start({
          boxShadow: `0 0 30px ${glowColor}40, 0 0 60px ${glowColor}20`,
          transition: { duration: 0.3 }
        })
      }
      
      scale.set(1.02)
    }

    const handleMouseLeave = () => {
      if (!interactive) return
      
      setIsHovered(false)
      
      if (effect === 'tilt' || effect === 'magnetic') {
        x.set(0)
        y.set(0)
      }
      
      if (effect === 'float') {
        controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        })
      } else if (effect === 'glow') {
        controls.start({
          boxShadow: "0 0 0px rgba(0,0,0,0)",
          transition: { duration: 0.3 }
        })
      }
      
      scale.set(1)
    }

    // Parallax effect
    useEffect(() => {
      if (effect !== 'parallax') return
      
      const handleScroll = () => {
        if (!cardRef.current) return
        
        const scrolled = window.pageYOffset
        const parallax = scrolled * 0.1
        
        y.set(parallax)
      }
      
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [effect, y])

    // Morphing effect
    useEffect(() => {
      if (effect !== 'morphing') return
      
      const morphAnimation = async () => {
        await controls.start({
          borderRadius: ['1rem', '2rem', '0.5rem', '1rem'],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        })
      }
      
      morphAnimation()
    }, [effect, controls])

    const cardVariants = {
      initial: { 
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        opacity: 1
      },
      hover: { 
        scale: 1.02
      }
    }

    const contentVariants = {
      initial: { opacity: 1 },
      hover: { 
        opacity: 1
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-lg overflow-hidden transition-all duration-300',
          variants[variant],
          className
        )}
        style={
          effect === 'tilt' || effect === 'magnetic' 
            ? { 
                x, 
                y, 
                rotateX, 
                rotateY, 
                scale,
                transformStyle: "preserve-3d",
                perspective: 1000
              }
            : effect === 'parallax'
            ? { y }
            : undefined
        }
        variants={cardVariants}
        initial="initial"
        whileHover={interactive ? "hover" : undefined}
        animate={controls}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Holographic effect */}
        {variant === 'holographic' && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, transparent 50%)`
            }}
            animate={isHovered ? { opacity: 0.5 } : { opacity: 0.3 }}
          />
        )}

        {/* Glass effect reflection */}
        {variant === 'glass' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"
            animate={isHovered ? { opacity: 1 } : { opacity: 0.5 }}
          />
        )}

        {/* Neon glow effect */}
        {variant === 'neon' && isHovered && (
          <motion.div
            className="absolute inset-0 bg-cyan-400/5 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Magnetic field visualization */}
        {effect === 'magnetic' && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-yellow-400/20 rounded-full"
                style={{
                  width: `${100 + i * 20}%`,
                  height: `${100 + i * 20}%`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
        />

        {/* Card content */}
        <motion.div
          className="relative z-10"
          variants={contentVariants}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Header */}
          {header && (
            <motion.div
              className="p-6 pb-0"
              style={{ transform: "translateZ(20px)" }}
            >
              {header}
            </motion.div>
          )}

          {/* Main content */}
          <motion.div
            className="p-6"
            style={{ transform: "translateZ(10px)" }}
          >
            {children}
          </motion.div>

          {/* Footer */}
          {footer && (
            <motion.div
              className="px-6 pb-6 pt-0"
              style={{ transform: "translateZ(5px)" }}
            >
              {footer}
            </motion.div>
          )}
        </motion.div>

        {/* Interactive spotlight */}
        {interactive && isHovered && (
          <motion.div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, white, transparent)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Border gradient animation */}
        {(variant === 'outlined' || variant === 'neon') && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, transparent, ${glowColor}, transparent, ${glowColor}, transparent)`,
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>
    )
  }
)

AdvancedCard.displayName = "AdvancedCard"

export { AdvancedCard }