'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Portfolio } from '@/types'
import { VideoThumbnail } from './VideoThumbnail'
import { GradientButton } from '@/components/ui/GradientButton'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { PageContainer } from '@/components/ui/PageContainer'

interface PortfolioShowcaseProps {
  portfolioItems: Portfolio[]
  title?: string
  subtitle?: string
  showAll?: boolean
  limit?: number
}

export function PortfolioShowcase({
  portfolioItems,
  title = 'PORTFOLIO',
  subtitle = '制作実績',
  showAll = false,
  limit = 6
}: PortfolioShowcaseProps) {
  const displayedItems = showAll ? portfolioItems : portfolioItems.slice(0, limit)

  return (
    <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <PageContainer>
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            {title}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {subtitle}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            クライアント様の想いをカタチにした制作実績をご紹介
          </p>
        </AnimatedSection>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedItems.map((project, index) => (
            <VideoThumbnail
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        {!showAll && portfolioItems.length > limit && (
          <AnimatedSection direction="scale" className="text-center">
            <Link href="/portfolio">
              <GradientButton size="lg">
                すべての実績を見る
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </GradientButton>
            </Link>
          </AnimatedSection>
        )}
      </PageContainer>
    </section>
  )
}