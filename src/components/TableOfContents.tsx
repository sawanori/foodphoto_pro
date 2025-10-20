'use client'

import { useState, useEffect } from 'react'
import { Heading } from '@/utils/extract-headings'
import { motion, AnimatePresence } from 'framer-motion'

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -70% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* モバイル用折りたたみ目次 */}
      <div className="lg:hidden mb-8 border border-gray-200 rounded-xl bg-gray-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <span className="font-semibold text-gray-900">目次</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <nav className="px-4 pb-4">
                <ul className="space-y-2">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={heading.level === 3 ? 'ml-4' : ''}
                    >
                      <button
                        onClick={() => {
                          scrollToHeading(heading.id)
                          setIsOpen(false)
                        }}
                        className={`text-left text-sm hover:text-orange-600 transition-colors ${
                          activeId === heading.id
                            ? 'text-orange-600 font-medium'
                            : 'text-gray-600'
                        }`}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* デスクトップ用サイドバー目次 */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">目次</h3>
          <nav>
            <ul className="space-y-2 border-l-2 border-gray-200 pl-4">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={heading.level === 3 ? 'ml-4' : ''}
                >
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`text-left text-sm hover:text-orange-600 transition-colors block w-full py-1 ${
                      activeId === heading.id
                        ? 'text-orange-600 font-medium border-l-2 border-orange-600 -ml-[18px] pl-4'
                        : 'text-gray-600'
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}