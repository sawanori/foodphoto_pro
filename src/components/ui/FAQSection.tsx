'use client'

import { motion } from 'framer-motion'
import { FAQ } from '@/types'

interface FAQSectionProps {
  title?: string
  subtitle?: string
  faqs: FAQ[]
  gradient?: string
  className?: string
}

export function FAQSection({
  title = 'FAQ',
  subtitle = 'よくあるご質問',
  faqs,
  gradient = 'from-yellow-400 to-orange-500',
  className = ''
}: FAQSectionProps) {
  return (
    <section className={`py-32 bg-black relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}/5 via-transparent`}></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            {title}
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {subtitle && ` ${subtitle}`}
            </span>
          </h2>
          {subtitle && !title.includes(subtitle) && (
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="space-y-6">
          {faqs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-700/50 rounded-lg p-6 hover:border-${gradient.split('-')[1]}-400/40 transition-all duration-300`}
            >
              <h3 className={`text-lg font-semibold text-${gradient.split('-')[1]}-400 mb-3`}>
                Q. {item.question}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                A. {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}