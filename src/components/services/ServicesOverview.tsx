'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Service } from '@/types'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { PageContainer } from '@/components/ui/PageContainer'

interface ServicesOverviewProps {
  services: Service[]
  title?: string
  subtitle?: string
}

export function ServicesOverview({
  services,
  title = 'SERVICES',
  subtitle = 'サービス内容'
}: ServicesOverviewProps) {
  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-orange-500/5"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <PageContainer>
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            {title}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {subtitle}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            企画から完成まで、一貫したクオリティでお客様のビジョンを実現
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection
              key={service.id}
              delay={index * 0.2}
              className="h-full"
            >
              <Link href={`/services/${service.id}`}>
                <GlassCard hover className="h-full group">
                  {/* Service Icon */}
                  <motion.div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl transition-all duration-500 bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      boxShadow: "0 15px 35px rgba(255, 193, 7, 0.4)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.icon}
                  </motion.div>

                  {/* Service Title */}
                  <h3 className="text-2xl font-bold text-center mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {service.subtitle}
                  </h3>

                  {/* Service Description */}
                  <p className="text-gray-300 text-center mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Price */}
                  {service.basePrice && (
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">
                        ¥{service.basePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {service.priceNote}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {service.features && (
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className="flex items-center text-sm text-gray-300"
                        >
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="text-center mt-auto pt-4">
                    <span className="text-yellow-400 font-medium group-hover:text-white transition-colors duration-300">
                      詳細を見る →
                    </span>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </GlassCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}