'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
// Simple arrow and home icons as SVG components
const ChevronRightIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const HomeIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
import { motion } from 'framer-motion'

export interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function Breadcrumbs({ 
  items, 
  showHome = true, 
  className = '' 
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)
  
  if (!breadcrumbItems.length && !showHome) {
    return null
  }

  const allItems = showHome 
    ? [{ label: 'ホーム', href: '/', current: pathname === '/' }, ...breadcrumbItems]
    : breadcrumbItems

  // Ensure last item is marked as current
  if (allItems.length > 0) {
    allItems[allItems.length - 1].current = true
  }

  return (
    <nav 
      aria-label="パンくずリスト"
      className={`flex ${className}`}
      role="navigation"
    >
      <ol 
        className="flex items-center space-x-2 text-sm"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, index) => (
          <motion.li
            key={item.href}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Add separator before non-first items */}
            {index > 0 && (
              <ChevronRightIcon 
                className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" 
                aria-hidden="true"
              />
            )}
            
            {item.current ? (
              <span
                className="text-yellow-400 font-medium"
                aria-current="page"
                itemProp="name"
              >
                {/* Add home icon for first item if it's home */}
                {index === 0 && showHome && (
                  <HomeIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                )}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center"
                itemProp="item"
              >
                {/* Add home icon for first item if it's home */}
                {index === 0 && showHome && (
                  <HomeIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                )}
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            
            {/* Schema.org metadata */}
            <meta itemProp="position" content={(index + 1).toString()} />
            {!item.current && <meta itemProp="item" content={item.href} />}
          </motion.li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Generate breadcrumbs from pathname
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  if (pathname === '/') return []
  
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Path mapping for better labels
  const pathLabels: Record<string, string> = {
    'services': 'サービス',
    'movie': '映像制作',
    'photo': '写真撮影',
    'web': 'Web制作',
    'portfolio': '撮影事例',
    'about': '会社概要',
    'contact': 'お問い合わせ',
    'pricing': '料金',
    'access': 'アクセス',
    'corporate': '企業向け',
    'product': '商品紹介',
    'event': 'イベント',
    'commercial': 'コマーシャル',
    'news': 'ニュース',
    'case-study': '事例紹介',
    'faq': 'よくある質問'
  }
  
  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = pathLabels[segment] || formatSegmentLabel(segment)
    
    breadcrumbs.push({
      label,
      href: currentPath,
      current: index === pathSegments.length - 1
    })
  })
  
  return breadcrumbs
}

/**
 * Format segment label for display
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Enhanced breadcrumbs with rich snippets
 */
export function RichBreadcrumbs(props: BreadcrumbsProps) {
  const pathname = usePathname()
  const items = props.items || generateBreadcrumbsFromPath(pathname)
  
  // Generate JSON-LD for breadcrumbs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `https://non-turn.com${item.href}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs {...props} />
    </>
  )
}

/**
 * Breadcrumb hooks for different page types
 */
export function useServiceBreadcrumbs(serviceType?: string) {
  const baseBreadcrumbs = [
    { label: 'サービス', href: '/services' }
  ]
  
  if (serviceType) {
    const serviceLabels: Record<string, string> = {
      'movie': '映像制作',
      'photo': '写真撮影',
      'web': 'Web制作'
    }
    
    baseBreadcrumbs.push({
      label: serviceLabels[serviceType] || serviceType,
      href: `/services/${serviceType}`,
      current: true
    } as BreadcrumbItem)
  }
  
  return baseBreadcrumbs
}

export function usePortfolioBreadcrumbs(category?: string, projectId?: string) {
  const breadcrumbs = [
    { label: '撮影事例', href: '/portfolio' }
  ]
  
  if (category) {
    const categoryLabels: Record<string, string> = {
      'corporate': '企業向け',
      'product': '商品紹介',
      'event': 'イベント'
    }
    
    breadcrumbs.push({
      label: categoryLabels[category] || category,
      href: `/portfolio/${category}`
    })
  }
  
  if (projectId) {
    breadcrumbs.push({
      label: 'プロジェクト詳細',
      href: `/portfolio/${category}/${projectId}`,
      current: true
    } as BreadcrumbItem)
  }
  
  return breadcrumbs
}

/**
 * Compact breadcrumbs for mobile
 */
export function CompactBreadcrumbs(props: BreadcrumbsProps) {
  const items = props.items || []
  
  if (items.length <= 2) {
    return <Breadcrumbs {...props} />
  }
  
  // Show only first, last, and current for mobile
  const compactItems = [
    items[0],
    { label: '...', href: '#', current: false },
    items[items.length - 1]
  ]
  
  return (
    <div className="block sm:hidden">
      <Breadcrumbs {...props} items={compactItems} />
    </div>
  )
}