'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export interface InternalLink {
  href: string
  label: string
  description?: string
  category?: string
  priority?: 'high' | 'medium' | 'low'
  keywords?: string[]
  isExternal?: boolean
}

interface InternalLinksProps {
  links: InternalLink[]
  title?: string
  className?: string
  showDescriptions?: boolean
  maxItems?: number
  layout?: 'grid' | 'list'
}

export function InternalLinks({
  links,
  title = "関連ページ",
  className = "",
  showDescriptions = true,
  maxItems,
  layout = 'grid'
}: InternalLinksProps) {
  const pathname = usePathname()
  const [visibleLinks, setVisibleLinks] = useState<InternalLink[]>([])

  useEffect(() => {
    // Filter out current page and limit items
    let filteredLinks = links.filter(link => link.href !== pathname)
    
    // Sort by priority
    filteredLinks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority || 'low'] - priorityOrder[a.priority || 'low'])
    })
    
    if (maxItems) {
      filteredLinks = filteredLinks.slice(0, maxItems)
    }
    
    setVisibleLinks(filteredLinks)
  }, [links, pathname, maxItems])

  if (visibleLinks.length === 0) {
    return null
  }

  const containerClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'space-y-4',
    inline: 'flex flex-wrap gap-2'
  }

  return (
    <nav 
      className={`${className}`}
      aria-labelledby="internal-links-heading"
      role="navigation"
    >
      {title && (
        <h3 
          id="internal-links-heading"
          className="text-xl font-semibold text-white mb-6"
        >
          {title}
        </h3>
      )}
      
      <div className={containerClasses[layout]}>
        <AnimatePresence>
          {visibleLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <LinkCard 
                link={link} 
                showDescription={showDescriptions}
                compact={layout === 'list'}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </nav>
  )
}

function LinkCard({ 
  link, 
  showDescription = true, 
  compact = false 
}: { 
  link: InternalLink
  showDescription?: boolean
  compact?: boolean
}) {
  return (
    <Link
      href={link.href}
      className={`
        block p-4 bg-gray-900/50 border border-yellow-400/20 
        hover:border-yellow-400/50 hover:bg-gray-900/70
        transition-all duration-300 group
        ${compact ? 'rounded-lg' : 'rounded-xl'}
      `}
      target={link.isExternal ? '_blank' : undefined}
      rel={link.isExternal ? 'noopener noreferrer' : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-white group-hover:text-yellow-400 transition-colors duration-300">
            {link.label}
            {link.isExternal && (
              <svg 
                className="inline-block w-4 h-4 ml-1 opacity-70" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-label="外部リンク"
              >
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
            )}
          </h4>
          
          {showDescription && link.description && (
            <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors duration-300">
              {link.description}
            </p>
          )}
          
          {link.category && (
            <span className="inline-block px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full mt-2">
              {link.category}
            </span>
          )}
        </div>
        
        <div className="ml-4 text-yellow-400 group-hover:translate-x-1 transition-transform duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

// Unused component - keeping for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InlineLinkItem({ link }: { link: InternalLink }) {
  return (
    <Link
      href={link.href}
      className="inline-flex items-center px-3 py-1 bg-gray-900/50 border border-yellow-400/20 rounded-full text-sm text-gray-300 hover:text-yellow-400 hover:border-yellow-400/50 transition-all duration-300"
      target={link.isExternal ? '_blank' : undefined}
      rel={link.isExternal ? 'noopener noreferrer' : undefined}
    >
      {link.label}
      {link.isExternal && (
        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
        </svg>
      )}
    </Link>
  )
}

/**
 * Predefined link collections for different page types
 */
export const siteLinks = {
  main: [
    {
      href: '/',
      label: 'ホーム',
      description: 'NonTurn.LLCのメインページ',
      priority: 'high' as const,
      keywords: ['ホーム', 'トップ', '映像制作']
    },
    {
      href: '/services',
      label: 'サービス',
      description: '映像制作・写真撮影・Web制作の全サービス',
      priority: 'high' as const,
      keywords: ['サービス', '映像制作', '写真撮影', 'Web制作']
    },
    {
      href: '/portfolio',
      label: '撮影事例',
      description: '制作実績とプロジェクト事例',
      priority: 'high' as const,
      keywords: ['撮影事例', '実績', '事例']
    },
    {
      href: '/about',
      label: '会社概要',
      description: 'NonTurn.LLCについて',
      priority: 'medium' as const,
      keywords: ['会社概要', '企業情報', 'チーム']
    },
    {
      href: '/contact',
      label: 'お問い合わせ',
      description: 'プロジェクトのご相談はこちら',
      priority: 'high' as const,
      keywords: ['お問い合わせ', '相談', 'コンタクト']
    }
  ],
  
  services: [
    {
      href: '/services/movie',
      label: '映像制作',
      description: '企業プロモーション・商品紹介動画制作',
      category: 'サービス',
      priority: 'high' as const,
      keywords: ['映像制作', '動画制作', 'プロモーション']
    },
    {
      href: '/services/photo',
      label: '写真撮影',
      description: '商品撮影・イベント撮影・ポートレート',
      category: 'サービス',
      priority: 'high' as const,
      keywords: ['写真撮影', '商品撮影', 'イベント撮影']
    },
    {
      href: '/services/photo/foodphoto',
      label: '飲食店撮影PhotoStudio',
      description: 'プロカメラマンによる飲食店専門の料理・店舗撮影',
      category: '特別サービス',
      priority: 'high' as const,
      keywords: ['飲食店撮影', '料理撮影', 'メニュー撮影', 'レストラン撮影', 'フードフォト'],
      isExternal: false
    },
    {
      href: '/services/web',
      label: 'Web制作',
      description: 'Webサイト・LP・ECサイト制作',
      category: 'サービス',
      priority: 'medium' as const,
      keywords: ['Web制作', 'ホームページ', 'LP']
    }
  ],
  
  portfolio: [
    {
      href: '/portfolio/corporate',
      label: '企業向け制作',
      description: '企業プロモーション・ブランディング動画',
      category: '撮影事例',
      priority: 'high' as const,
      keywords: ['企業向け', 'コーポレート', 'ブランディング']
    },
    {
      href: '/portfolio/product',
      label: '商品紹介',
      description: '商品プロモーション・ECサイト用動画',
      category: '撮影事例',
      priority: 'high' as const,
      keywords: ['商品紹介', 'プロダクト', 'Eコマース']
    },
    {
      href: '/portfolio/event',
      label: 'イベント記録',
      description: 'セミナー・カンファレンス・式典の記録',
      category: '撮影事例',
      priority: 'medium' as const,
      keywords: ['イベント', '記録', 'セミナー']
    }
  ],
  
  footer: [
    {
      href: '/pricing',
      label: '料金',
      description: 'サービス料金表',
      priority: 'medium' as const,
      keywords: ['料金', '価格', '費用']
    },
    {
      href: '/access',
      label: 'アクセス',
      description: '会社の所在地・アクセス情報',
      priority: 'low' as const,
      keywords: ['アクセス', '所在地', '横浜']
    },
    {
      href: '/privacy',
      label: 'プライバシーポリシー',
      description: '個人情報の取り扱いについて',
      priority: 'low' as const,
      keywords: ['プライバシー', '個人情報']
    },
    {
      href: '/terms',
      label: '利用規約',
      description: 'サービス利用に関する規約',
      priority: 'low' as const,
      keywords: ['利用規約', '規約', '条件']
    }
  ]
}

/**
 * Related links component with smart suggestions
 */
export function RelatedLinks({ currentPath }: { currentPath: string }) {
  const getRelatedLinks = (path: string): InternalLink[] => {
    if (path === '/') {
      return [...siteLinks.services, ...siteLinks.portfolio.slice(0, 2)]
    }
    
    if (path.startsWith('/services')) {
      return [...siteLinks.services, ...siteLinks.portfolio, ...siteLinks.main.slice(0, 2)]
    }
    
    if (path.startsWith('/portfolio')) {
      return [...siteLinks.portfolio, ...siteLinks.services, ...siteLinks.main.slice(0, 2)]
    }
    
    if (path === '/about') {
      return [...siteLinks.services, ...siteLinks.main.filter(l => l.href !== '/about')]
    }
    
    if (path === '/contact') {
      return [...siteLinks.services, ...siteLinks.portfolio.slice(0, 2)]
    }
    
    return siteLinks.main
  }

  const relatedLinks = getRelatedLinks(currentPath)
  
  return (
    <InternalLinks
      links={relatedLinks}
      title="関連ページ"
      maxItems={6}
      className="mt-16"
    />
  )
}

/**
 * Contextual navigation for specific sections
 */
export function ContextualNav({ section }: { section: keyof typeof siteLinks }) {
  const links = siteLinks[section] || []
  
  return (
    <InternalLinks
      links={links}
      layout="list"
      showDescriptions={false}
      className="mb-8"
    />
  )
}