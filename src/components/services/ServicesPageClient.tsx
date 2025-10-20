'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { DynamicScene3D } from '@/components/3d/DynamicScene3D'
import { services, serviceOverview } from '@/data/services'

export default function ServicesPageClient() {
  const servicesArray = Object.values(services)

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <DynamicScene3D className="absolute inset-0 z-0 opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-wider uppercase"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent eng-only">
                {serviceOverview.title}
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {serviceOverview.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesArray.map((service, index) => (
              <motion.div 
                key={service.id}
                className="group scale-in bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-yellow-400/20 p-8 hover:border-yellow-400/50 transition-all duration-500  relative overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.2)"
                }}
              >
                <div className={`aspect-square bg-gradient-to-br ${service.gradient} mb-6 flex items-center justify-center rounded-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  <motion.div 
                    className="w-16 h-16 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl">{service.icon}</span>
                  </motion.div>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-white tracking-wider uppercase group-hover:text-yellow-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <h4 className="text-lg text-yellow-400 mb-4 font-medium">{service.subtitle}</h4>
                <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-white transition-colors duration-300">
                  {service.description}
                </p>

                {/* Price Display */}
                {'basePrice' in service && service.basePrice && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-2">基本料金</div>
                    <div className="text-yellow-400 text-sm">
                      ¥{service.basePrice.toLocaleString()}{service.priceNote}
                    </div>
                  </div>
                )}

                {'plans' in service && service.plans && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-2">料金プラン</div>
                    {service.plans.map((plan, planIndex) => (
                      <div key={planIndex} className="text-yellow-400 text-sm">
                        {plan.name}: ¥{plan.basePrice.toLocaleString()}〜
                      </div>
                    ))}
                  </div>
                )}
                
                <Link href={`/services/${service.id}`}>
                  <motion.button 
                    className="w-full bg-transparent border border-yellow-400 text-yellow-400 px-6 py-3 font-medium text-sm uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all duration-300  relative overflow-hidden group/btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">詳細を見る</span>
                    <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </motion.button>
                </Link>
                
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Comparison */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="text-yellow-400">{serviceOverview.comparison.title}</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-yellow-400/20 rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-yellow-400/10">
                    {serviceOverview.comparison.headers.map((header, index) => (
                      <th key={index} className="px-6 py-4 text-left text-yellow-400 font-semibold uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {serviceOverview.comparison.rows.map((row, rowIndex) => (
                    <motion.tr 
                      key={rowIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                      className="border-b border-gray-700 hover:bg-yellow-400/5 transition-colors duration-300"
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 text-white">
                          {cellIndex === 0 ? (
                            <span className="font-medium text-yellow-400">{cell}</span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Common Process */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="text-yellow-400">{serviceOverview.commonProcess.title}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              どのサービスも共通の4ステップで進行します
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceOverview.commonProcess.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black font-bold text-2xl"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-2xl">{step.icon}</span>
                </motion.div>
                
                <div className="mb-4">
                  <div className="text-yellow-400 text-sm font-medium uppercase tracking-wider mb-1">
                    STEP {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Connection Line */}
                {index < serviceOverview.commonProcess.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent transform translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="text-yellow-400">FAQ</span>
            </h2>
            <p className="text-xl text-gray-300">
              よくあるご質問
            </p>
          </motion.div>

          <div className="space-y-6">
            {serviceOverview.faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6 hover:border-yellow-400/40 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Q. {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  A. {item.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/contact">
              <motion.button
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-4 font-medium text-lg uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300  relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">その他のご質問</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  )
}