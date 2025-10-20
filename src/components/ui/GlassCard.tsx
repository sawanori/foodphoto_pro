'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  backdrop?: boolean
  border?: boolean
  onClick?: () => void
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const roundedSizes = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl'
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  padding = 'md',
  rounded = '2xl',
  backdrop = true,
  border = true,
  onClick
}: GlassCardProps) {
  const baseClasses = `
    relative overflow-hidden transition-all duration-300
    ${backdrop ? 'bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl' : ''}
    ${border ? 'border border-gray-700/50' : ''}
    ${paddings[padding]}
    ${roundedSizes[rounded]}
    ${hover ? 'hover:border-gray-600/50 hover:shadow-2xl' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `

  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: hover ? 1.02 : 1, 
      y: hover ? -5 : 0,
      boxShadow: hover ? "0 25px 50px rgba(0, 0, 0, 0.5)" : "0 0 0 rgba(0, 0, 0, 0)"
    }
  }

  return (
    <motion.div
      className={baseClasses}
      initial="rest"
      whileHover="hover"
      variants={cardVariants}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}