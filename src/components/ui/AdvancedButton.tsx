'use client'

import { forwardRef, useState, useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdvancedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  effect?: 'glow' | 'ripple' | 'magnetic' | 'particles' | 'morph' | 'liquid'
  icon?: React.ReactNode
  loading?: boolean
  success?: boolean
  children: React.ReactNode
}

const AdvancedButton = forwardRef<HTMLButtonElement, AdvancedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    effect = 'glow',
    icon,
    loading = false,
    success = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
    const [showRipple, setShowRipple] = useState(false)
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
    
    const controls = useAnimation()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [30, -30])
    const rotateY = useTransform(x, [-100, 100], [-30, 30])

    // Variant styles
    const variants = {
      primary: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-orange-500 hover:to-red-500',
      secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600',
      ghost: 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white',
      destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
      outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black',
      gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:scale-105'
    }

    // Size styles
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    }

    // Handle mouse movement for magnetic effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (effect !== 'magnetic') return
      
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      
      x.set(deltaX * 0.1)
      y.set(deltaY * 0.1)
    }

    // Handle click for ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (effect === 'ripple') {
        const rect = e.currentTarget.getBoundingClientRect()
        setClickPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
        setShowRipple(true)
        setTimeout(() => setShowRipple(false), 600)
      }
      
      if (effect === 'particles') {
        // Generate particles
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY
        }))
        setParticles(newParticles)
        setTimeout(() => setParticles([]), 1000)
      }
      
      props.onClick?.(e)
    }

    // Reset position for magnetic effect
    const handleMouseLeave = () => {
      setIsHovered(false)
      if (effect === 'magnetic') {
        x.set(0)
        y.set(0)
      }
    }

    // Loading animation
    useEffect(() => {
      if (loading) {
        controls.start({
          rotate: 360,
          transition: { duration: 1, repeat: Infinity, ease: "linear" }
        })
      } else {
        controls.stop()
      }
    }, [loading, controls])

    // Success animation
    useEffect(() => {
      if (success) {
        controls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.3 }
        })
      }
    }, [success, controls])

    const buttonVariants = {
      initial: { scale: 1 },
      hover: { 
        scale: effect === 'morph' ? 1.05 : 1.02,
        y: effect === 'liquid' ? -2 : 0
      },
      tap: { scale: 0.95 },
      loading: {
        rotate: 360
      }
    }

    const glowVariants = {
      initial: { boxShadow: "0 0 0 0 rgba(251, 191, 36, 0)" },
      hover: { 
        boxShadow: effect === 'glow' 
          ? "0 0 20px 5px rgba(251, 191, 36, 0.3), 0 0 40px 10px rgba(251, 191, 36, 0.1)"
          : "0 0 0 0 rgba(251, 191, 36, 0)"
      }
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400/50',
          variants[variant],
          sizes[size],
          className
        )}
        style={effect === 'magnetic' ? { x, y, rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={loading ? "loading" : "initial"}
        disabled={disabled || loading}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {/* Glow effect */}
        {effect === 'glow' && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
          />
        )}

        {/* Ripple effect */}
        {effect === 'ripple' && showRipple && (
          <motion.div
            className="absolute rounded-full bg-white/30"
            style={{
              left: clickPosition.x - 50,
              top: clickPosition.y - 50,
              width: 100,
              height: 100,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Particles effect */}
        {effect === 'particles' && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
            style={{
              left: particle.x - 4,
              top: particle.y - 4,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}

        {/* Liquid effect background */}
        {effect === 'liquid' && isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 rounded-lg"
            initial={{ scale: 0, borderRadius: "50%" }}
            animate={{ scale: 1, borderRadius: "0.5rem" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}

        {/* Morph effect */}
        {effect === 'morph' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={controls}
            />
          )}
          
          {success && !loading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              ✓
            </motion.div>
          )}
          
          {!loading && !success && icon && (
            <motion.span
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.span>
          )}
          
          <motion.span
            animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
          >
            {children}
          </motion.span>
        </span>

        {/* Background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      </motion.button>
    )
  }
)

AdvancedButton.displayName = "AdvancedButton"

export { AdvancedButton }