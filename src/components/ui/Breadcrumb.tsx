'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`bg-white border-b ${className}`}
      aria-label="パンくず"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <motion.ol 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2 text-sm flex-wrap"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li 
                key={index} 
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <span className="text-gray-400 mr-2" aria-hidden="true">/</span>
                )}
                {isLast ? (
                  <span 
                    className="text-gray-900 font-medium"
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href || '#'}
                    className="text-gray-500 hover:text-orange-500 transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={`${index + 1}`} />
              </li>
            )
          })}
        </motion.ol>
      </div>
    </nav>
  )
}

// パンくずデータを生成するユーティリティ関数
export function generateBreadcrumbStructuredData(items: BreadcrumbItem[], baseUrl: string = 'https://foodphoto-pro.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${baseUrl}${item.href}` })
    }))
  }
}