'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import { MainLayout } from '@/components/layout/MainLayout'
import { HeroSection } from '@/components/ui/HeroSection'
import { services } from '@/data/services'

export default function WebServicePageClient() {
  const serviceData = services.web
  const [activeService, setActiveService] = useState(0)
  const [activeTech, setActiveTech] = useState(0)

  const serviceCardVariants = {
    rest: { 
      scale: 1, 
      rotateY: 0, 
      z: 0,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    },
    hover: { 
      scale: 1.05, 
      rotateY: 3, 
      z: 50,
      boxShadow: "0 25px 50px rgba(147, 51, 234, 0.3)"
    }
  }

  const webServiceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Web制作",
    "description": "飲食店や企業向けのサイト制作をトータルで支援",
    "provider": {
      "@type": "Organization",
      "name": "NonTurn合同会社",
      "url": "https://non-turn.com"
    },
    "areaServed": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "横浜市西区",
        "addressRegion": "神奈川県"
      }
    },
    "url": "https://non-turn.com/services/web"
  }

  return (
    <>
      <Script
        id="web-service-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webServiceStructuredData),
        }}
      />
      <MainLayout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <HeroSection
          title={serviceData.title}
          subtitle={serviceData.subtitle}
          description={serviceData.detailedDescription}
          icon={serviceData.icon}
          gradient="from-purple-400 via-pink-500 to-blue-500"
          backgroundOpacity={0.4}
        >
          <div className="flex justify-center">
            <Link href="/contact" className="w-full sm:w-auto">
              <motion.button
                className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-8 sm:px-12 py-3 sm:py-4 font-bold text-base sm:text-lg uppercase tracking-wide sm:tracking-wider hover:from-pink-500 hover:to-blue-500 transition-all duration-300 rounded-xl sm:rounded-2xl w-full"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                制作依頼
              </motion.button>
            </Link>
          </div>
        </HeroSection>

        {/* Web Services Grid */}
        <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
                Web<span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">サービス</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                あらゆるビジネスニーズに対応するWebソリューション
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceData.services.map((service, index) => (
                <motion.div
                  key={index}
                  initial="rest"
                  whileHover="hover"
                  animate={activeService === index ? "hover" : "rest"}
                  variants={serviceCardVariants}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                >
                  <motion.div
                    className={`relative p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-500 ${
                      activeService === index 
                        ? 'bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-purple-400/50 shadow-2xl' 
                        : 'bg-gray-900/50 border-gray-700/50 hover:border-purple-400/30'
                    }`}
                    style={{ transform: "translateZ(25px)" }}
                  >
                    {/* Service Icon */}
                    <motion.div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl transition-all duration-500 ${
                        activeService === index 
                          ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg' 
                          : 'bg-gray-800 text-gray-400 group-hover:bg-purple-400/20 group-hover:text-purple-400'
                      }`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotateY: 360,
                        boxShadow: "0 15px 35px rgba(147, 51, 234, 0.4)"
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      💻
                    </motion.div>
                    
                    <motion.h3 
                      className={`text-2xl font-bold mb-4 text-center transition-colors duration-300 ${
                        activeService === index ? 'text-purple-400' : 'text-white group-hover:text-purple-400'
                      }`}
                      animate={activeService === index ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {service.name}
                    </motion.h3>
                    
                    <p className={`text-center mb-6 transition-colors duration-300 ${
                      activeService === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      {service.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={false}
                          className={`flex items-center text-sm transition-colors duration-300 ${
                            activeService === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                          }`}
                        >
                          <motion.span 
                            className="w-2 h-2 bg-purple-400 rounded-full mr-3"
                            animate={activeService === index ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                          />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Glowing Border Effect */}
                    {activeService === index && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-transparent to-pink-500/20 animate-pulse"></div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16 sm:py-24 md:py-32 bg-gray-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent eng-only">TECH STACK</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                業界最先端の技術で高性能なWebサイトを構築
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceData.technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(147, 51, 234, 0.3)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-xl border border-gray-700/50 p-6 sm:p-8 rounded-2xl hover:border-purple-400/50 transition-all duration-500  group"
                  onMouseEnter={() => setActiveTech(index)}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:shadow-lg"
                    whileHover={{ rotateX: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    {tech.category.charAt(0)}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white text-center group-hover:text-purple-400 transition-colors duration-300">
                    {tech.category}
                  </h3>
                  
                  <div className="space-y-2">
                    {tech.tools.map((tool, toolIndex) => (
                      <motion.div
                        key={toolIndex}
                        initial={false}
                        className={`text-sm p-2 rounded-lg text-center transition-all duration-300 ${
                          activeTech === index 
                            ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30' 
                            : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                        }`}
                      >
                        {tool}
                      </motion.div>
                    ))}
                  </div>
                  
                  {activeTech === index && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="mt-6 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Development Process */}
        <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-gray-900 to-black relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
                開発<span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">プロセス</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                戦略的な4段階で確実に成果を出すWeb制作
              </p>
            </motion.div>

            <div className="space-y-16">
              {serviceData.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Content */}
                  <div className="flex-1 w-full lg:w-auto">
                    <motion.div
                      className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-xl border border-gray-700/50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl hover:border-purple-400/50 transition-all duration-500 group"
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <div className="flex items-center mb-6">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-6"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {step.step}
                        </motion.div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-300 mb-6 text-base sm:text-lg leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="space-y-3">
                        {step.deliverables.map((deliverable, deliverableIndex) => (
                          <motion.div
                            key={deliverableIndex}
                            initial={false}
                            className="flex items-center text-purple-400 text-sm sm:text-base"
                          >
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
                            {deliverable}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Step Visualization */}
                  <div className="flex-1 w-full lg:w-auto max-w-md mx-auto lg:max-w-none">
                    <motion.div
                      className="aspect-square bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-3xl flex items-center justify-center relative overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-8xl opacity-30"
                        animate={{
                          rotateY: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        💻
                      </motion.div>
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0">
                        {[0, 1, 2, 3, 4].map((i) => {
                          const positions = [
                            { left: 20, top: 30 },
                            { left: 35, top: 50 },
                            { left: 50, top: 25 },
                            { left: 65, top: 45 },
                            { left: 80, top: 35 }
                          ]
                          const position = positions[i]
                          
                          return (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
                              style={{
                                left: `${position.left}%`,
                                top: `${position.top}%`
                              }}
                              animate={{
                                y: [0, -20, 0],
                                opacity: [0.2, 0.8, 0.2]
                              }}
                              transition={{
                                duration: 3,
                                delay: i * 0.5,
                                repeat: Infinity
                              }}
                            />
                          )
                        })}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
    </>
  )
}