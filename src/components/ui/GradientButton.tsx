'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

const variants = {
  primary: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600',
  secondary: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:from-teal-500 hover:to-cyan-600',
  outline: 'bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export function GradientButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = ''
}: GradientButtonProps) {
  const baseClasses = `
    font-bold uppercase tracking-wider transition-all duration-300 rounded-2xl
    relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {buttonContent}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {buttonContent}
    </motion.button>
  )
}