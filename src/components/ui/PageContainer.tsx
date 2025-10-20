'use client'

import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  padding?: boolean
  className?: string
}

const maxWidths = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
}

export function PageContainer({
  children,
  maxWidth = '7xl',
  padding = true,
  className = ''
}: PageContainerProps) {
  return (
    <div className={`
      ${maxWidths[maxWidth]} 
      mx-auto 
      ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}