'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import { MainLayout } from '@/components/layout/MainLayout'
import { HeroSection } from '@/components/ui/HeroSection'
import { services } from '@/data/services'

export default function MovieServicePageClient() {
  const serviceData = services.movie
  const [activeStep, setActiveStep] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const movieServiceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "映像制作",
    "description": "企業VP・採用動画など高品質な映像制作を提供",
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
    "url": "https://non-turn.com/services/movie"
  }

  const cardHover = {
    rest: { scale: 1, rotateY: 0, z: 0 },
    hover: { 
      scale: 1.05, 
      rotateY: 5, 
      z: 50
    }
  }

  return (
    <>
      <Script
        id="movie-service-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieServiceStructuredData),
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
          gradient="from-yellow-400 via-orange-500 to-red-500"
          backgroundOpacity={0.4}
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg uppercase tracking-wide sm:tracking-wider hover:from-orange-500 hover:to-red-500 transition-all duration-300 relative overflow-hidden group rounded-xl sm:rounded-2xl w-full sm:w-auto"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(true)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span>リール動画を見る（準備中）</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ▶
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl sm:rounded-2xl"></div>
            </motion.button>
            
            <Link href="/contact" className="w-full sm:w-auto">
              <motion.button
                className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg uppercase tracking-wide sm:tracking-wider hover:bg-yellow-400 hover:text-black transition-all duration-300 rounded-xl sm:rounded-2xl w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                お問い合わせ
              </motion.button>
            </Link>
          </div>
        </HeroSection>

        {/* Enhanced Process Section with 3D Cards */}
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
                制作<span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">プロセス</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                プロフェッショナルな4段階のワークフローで、あなたのビジョンを映像に
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {serviceData.process.map((step, index) => {
                const isActive = activeStep === index
                
                return (
                  <motion.div
                    key={step.step}
                    initial="rest"
                    whileHover="hover"
                    animate={isActive ? "hover" : "rest"}
                    variants={cardHover}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setActiveStep(index)}
                    onClick={() => setActiveStep(index)}
                  >
                    <motion.div
                      className={`relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 shadow-2xl' 
                          : 'bg-gray-900/50 border-gray-700/50 hover:border-yellow-400/30'
                      }`}
                      style={{ transform: "translateZ(25px)" }}
                    >
                      {/* Step Number with Advanced Animation */}
                      <motion.div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg' 
                            : 'bg-gray-800 text-gray-400 group-hover:bg-yellow-400/20 group-hover:text-yellow-400'
                        }`}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 360,
                          boxShadow: "0 10px 30px rgba(251, 191, 36, 0.4)"
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {step.icon || step.step}
                      </motion.div>
                      
                      <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-center transition-colors duration-300 ${
                        isActive ? 'text-yellow-400' : 'text-white group-hover:text-yellow-400'
                      }`}>
                        {step.title}
                      </h3>
                      
                      <p className={`text-center mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300 ${
                        isActive ? 'text-yellow-300' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {step.duration}
                      </p>
                      
                      <p className={`text-center text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {step.description}
                      </p>
                      
                      {/* Details with Accordion Animation */}
                      <AnimatePresence>
                        {isActive && step.details && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 pt-4 border-t border-yellow-400/30"
                          >
                            <ul className="space-y-2">
                              {step.details.map((detail, detailIndex) => (
                                <motion.li
                                  key={detailIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: detailIndex * 0.1 }}
                                  className="text-sm text-gray-300 flex items-center"
                                >
                                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                                  {detail}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Glowing Border Effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 via-transparent to-orange-500/20 animate-pulse"></div>
                      )}
                    </motion.div>
                    
                    {/* Connection Line */}
                    {index < serviceData.process.length - 1 && (
                      <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent transform -translate-y-1/2 z-20">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive || activeStep > index ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section with Advanced Grid */}
        <section className="py-16 sm:py-24 md:py-32 bg-gray-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  最先端技術
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                業界最高水準の撮影・編集技術であなたの映像を次のレベルへ
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {serviceData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial="rest"
                  whileHover="hover"
                  variants={{
                    rest: { scale: 1, rotateY: 0 },
                    hover: { scale: 1.05, rotateY: 5 }
                  }}
                  className="bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl hover:border-yellow-400/50 transition-all duration-500  group"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl group-hover:shadow-lg"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    {index + 1}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-white text-center group-hover:text-yellow-400 transition-colors duration-300">
                    {feature}
                  </h3>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-24 md:py-32 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-orange-500/5"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
                料金<span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">プラン</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-yellow-400/30 p-12 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-500/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-yellow-400 mb-3 sm:mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  ¥{serviceData.basePrice.toLocaleString()}
                </motion.div>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">{serviceData.priceNote}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div>
                    <h4 className="text-xl font-semibold text-yellow-400 mb-4">基本料金に含まれるもの</h4>
                    <ul className="space-y-3 text-gray-300">
                      {serviceData.features.slice(0, 3).map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center"
                        >
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-yellow-400 mb-4">追加オプション</h4>
                    <ul className="space-y-3 text-gray-300">
                      {serviceData.additionalCosts.map((cost, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between"
                        >
                          <span>{cost.item}</span>
                          <span className="text-yellow-400">{cost.price}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Modal */}
        <AnimatePresence>
          {isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsVideoPlaying(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="absolute -top-12 right-0 text-white text-xl hover:text-yellow-400 transition-colors"
                >
                  ✕ 閉じる
                </button>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster="/demo-video-poster.jpg"
                  >
                    <source src="/demo-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
    </>
  )
}