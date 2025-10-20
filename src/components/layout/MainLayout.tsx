'use client'

import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navigation />
      <main className="pt-24 sm:pt-20 md:pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}