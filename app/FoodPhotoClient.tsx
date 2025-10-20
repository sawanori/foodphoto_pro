'use client'

import React, { useState, useEffect, Suspense, lazy, memo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LocalBusinessSchema, FAQSchema, HowToSchema } from '@/components/StructuredData'
import AccessibilityEnhancer from '@/components/AccessibilityEnhancer'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import FoodPhotoLoader from '@/components/loading/FoodPhotoLoader'
import OptimizedImage from '@/components/ui/OptimizedImage'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { optimizeAltText } from '@/utils/image-optimization'
import { initWebVitals, preloadCriticalResources, preventLayoutShifts } from './web-vitals'
import { initImageOptimizations } from './image-optimization'
import { initFontOptimizations } from './font-optimization'
import { initAccessibility } from './accessibility'
import { getLatestPosts } from '@/lib/mock'
import './core-web-vitals.css'
import './hero-mobile.css'
import './accessibility.css'

// Lazy load heavy components for better performance
const SpecialOfferModal = lazy(() => import('@/components/modals/SpecialOfferModal'))
const PWAInstaller = lazy(() => import('@/components/PWAInstaller'))
const PainPointsSection = lazy(() => import('@/components/PainPointsSection'))
const PostCard = lazy(() => import('@/components/PostCard'))
// Use Next.js dynamic import so CSS for the chunk loads reliably
const LazyChat = dynamic(() => import('@/components/LazyChat'), { ssr: false, loading: () => null })

// Fallback components for Suspense
const ComponentFallback = memo(() => (
  <div className="h-32 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
))
ComponentFallback.displayName = 'ComponentFallback'

const SectionFallback = memo(() => (
  <div className="h-64 flex items-center justify-center" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
))
SectionFallback.displayName = 'SectionFallback'

// Optimized atomic components with React.memo
const Button = memo(({ variant = 'primary', children, onClick, className = '', ...props }: any) => {
  const baseClass = 'px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-4 font-bold text-sm md:text-base lg:text-lg rounded-2xl transition-all duration-300 min-w-[160px] md:min-w-[180px] lg:min-w-[200px]'
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-red-500 hover:to-pink-500',
    secondary: 'bg-orange-100 border-2 border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white'
  }

  return (
    <motion.button
      className={`${baseClass} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
})
Button.displayName = 'Button'

const SectionTitle = memo(({ children }: any) => (
  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
    {children}
  </h2>
))
SectionTitle.displayName = 'SectionTitle'

const SubTitle = memo(({ children }: any) => (
  <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-200">
    {children}
  </h3>
))
SubTitle.displayName = 'SubTitle'

// Optimized molecular components with React.memo
const FeatureCard = memo(({ title, description, icon, image, onClick }: any) => (
  <Suspense fallback={<ComponentFallback />}>
    <motion.div
      className="aspect-square bg-white shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* 上部画像エリア */}
      <div className="relative h-2/3 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
        {image ? (
          <OptimizedImage
            src={image}
            alt={optimizeAltText(title, '飲食店撮影')}
            width={400}
            height={300}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">{icon}</span>
          </div>
        )}
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* 下部テキストエリア */}
      <div className="h-1/3 p-6 flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        <p className="text-base text-gray-700 line-clamp-2">{description}</p>
        <p className="text-sm text-orange-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          クリックして詳細を見る →
        </p>
      </div>
    </motion.div>
  </Suspense>
))
FeatureCard.displayName = 'FeatureCard'

const FlowStep = memo(({ number, title, description }: any) => (
  <Suspense fallback={<ComponentFallback />}>
    <motion.div
      className="rounded-2xl p-6 shadow-lg relative" style={{ backgroundColor: 'rgb(77, 76, 76)' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: number * 0.1 }}
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 mt-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  </Suspense>
))
FlowStep.displayName = 'FlowStep'

const CaseCard = memo(({ title, company, role, name, comment }: any) => (
  <Suspense fallback={<ComponentFallback />}>
    <motion.article
      className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: 'rgb(77, 76, 76)' }}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 mb-4 italic">&ldquo;{comment}&rdquo;</p>
      <div className="text-sm text-gray-500">
        <p>{company}</p>
        <p>{role} {name}様</p>
      </div>
    </motion.article>
  </Suspense>
))
CaseCard.displayName = 'CaseCard'

// Optimized Header component with useCallback for scroll handler
const Header = memo(({ onOpenChat }: { onOpenChat: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.querySelector(targetId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Close mobile menu after navigation
      setMobileMenuOpen(false)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <OptimizedImage
            src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/cameralogo.svg"
            alt="飲食店撮影PhotoStudio - プロカメラマンによる料理撮影サービス"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10"
            priority
          />
          <span className="text-base md:text-xl font-bold text-white">飲食店撮影PhotoStudio</span>
        </Link>
        
        {/* Mobile and Tablet menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white"
          aria-label="メニューを開く"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        <nav className="hidden lg:flex items-center gap-2 lg:gap-4 xl:gap-6">
          <a 
            href="#features" 
            onClick={(e) => handleSmoothScroll(e, '#features')}
            className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer text-xs lg:text-sm xl:text-base whitespace-nowrap"
          >
            サービスの特徴
          </a>
          <a 
            href="#pricing"
            onClick={(e) => handleSmoothScroll(e, '#pricing')}
            className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer text-xs lg:text-sm xl:text-base whitespace-nowrap"
          >
            料金
          </a>
          <a 
            href="#samples"
            onClick={(e) => handleSmoothScroll(e, '#samples')}
            className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer text-xs lg:text-sm xl:text-base whitespace-nowrap"
          >
            撮影事例
          </a>
          <a 
            href="#flow"
            onClick={(e) => handleSmoothScroll(e, '#flow')}
            className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer text-xs lg:text-sm xl:text-base whitespace-nowrap"
          >
            撮影の流れ
          </a>
          <a 
            href="#cases"
            onClick={(e) => handleSmoothScroll(e, '#cases')}
            className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer text-xs lg:text-sm xl:text-base whitespace-nowrap"
          >
            導入事例
          </a>
          <a 
            href="#faq"
            onClick={(e) => handleSmoothScroll(e, '#faq')}
            className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer text-xs lg:text-sm xl:text-base whitespace-nowrap"
          >
            よくあるご質問
          </a>
        </nav>
        
        <div className="hidden lg:flex items-center">
          <Button 
            variant="primary" 
            className="text-xs lg:text-sm xl:text-base px-3 lg:px-4 py-2" 
            id="cta-header-contact"
            onClick={onOpenChat}
            data-chat-open
          >
            問い合わせる
          </Button>
        </div>
      </div>
      
      {/* Mobile and Tablet Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900 border-t border-gray-700"
          >
            <nav className="flex flex-col p-4 space-y-3">
              <a 
                href="#features" 
                onClick={(e) => handleSmoothScroll(e, '#features')}
                className="text-gray-300 hover:text-orange-500 py-2 transition-colors"
              >
                サービスの特徴
              </a>
              <a 
                href="#pricing"
                onClick={(e) => handleSmoothScroll(e, '#pricing')}
                className="text-gray-300 hover:text-orange-500 py-2 transition-colors"
              >
                料金
              </a>
              <a 
                href="#samples"
                onClick={(e) => handleSmoothScroll(e, '#samples')}
                className="text-gray-300 hover:text-orange-500 py-2 transition-colors"
              >
                撮影事例
              </a>
              <a 
                href="#flow"
                onClick={(e) => handleSmoothScroll(e, '#flow')}
                className="text-gray-300 hover:text-orange-500 py-2 transition-colors"
              >
                撮影の流れ
              </a>
              <a 
                href="#cases"
                onClick={(e) => handleSmoothScroll(e, '#cases')}
                className="text-gray-300 hover:text-orange-500 py-2 transition-colors"
              >
                導入事例
              </a>
              <a 
                href="#faq"
                onClick={(e) => handleSmoothScroll(e, '#faq')}
                className="text-gray-300 hover:text-orange-500 py-2 transition-colors"
              >
                よくあるご質問
              </a>
              <div className="pt-4 space-y-3 border-t border-gray-700">
                <Link href="/form" className="block">
                  <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 px-4 rounded-lg font-bold" id="cta-hero-apply">
                    申し込む
                  </button>
                </Link>
                <button 
                  className="w-full bg-orange-100 border-2 border-orange-400 text-orange-600 py-3 px-4 rounded-lg font-bold hover:bg-orange-400 hover:text-white transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenChat()
                  }}
                >
                  問い合わせる
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
})
Header.displayName = 'Header'

// Optimized IntroSection with priority image loading and better performance
const IntroSection = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Mobile/Tablet images
  const mobileImages = [
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg',
      alt: '飲食店の料理撮影例 - 美味しそうな料理写真'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%206.jpg',
      alt: '飲食店のメニュー撮影 - プロによる料理写真'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%205.jpg',
      alt: '飲食店撮影サービス - 料理の魅力を引き出す写真'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2023.jpg',
      alt: 'レストラン料理撮影 - 飲食店専門カメラマンによる撮影'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2019.jpg',
      alt: '飲食店メニュー撮影例 - プロフェッショナル料理写真'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_26.jpg',
      alt: '飲食店の撮影実績 - 料理写真で集客アップ'
    }
  ]
  
  // PC images
  const pcImages = [
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg',
      alt: '飲食店撮影事例 - プロカメラマンによる料理撮影'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2021.jpg',
      alt: '飲食店向け撮影サービス - メニュー撮影実績'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2022.jpg',
      alt: 'レストラン撮影サービス - 飲食店専門料理写真'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_.jpg',
      alt: '店内写真1'
    },
    {
      src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%201.jpg',
      alt: '店内写真2'
    }
  ]
  
  // Select images based on screen size
  const heroImages = isMobile ? mobileImages : pcImages
  
  // Optimized screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkScreenSize()
    const handleResize = () => checkScreenSize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-advance slideshow with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [heroImages.length])
  
  // Reset slide when switching between mobile and PC
  useEffect(() => {
    setCurrentSlide(0)
  }, [isMobile])

  return (
    <section className="relative h-screen hero-section-mobile overflow-hidden bg-black">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {/* Preload all images in background with optimized quality */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
          >
            <OptimizedImage
              src={image.src}
              alt={optimizeAltText(image.alt, '飲食店撮影のヒーロー画像')}
              width={1920}
              height={1080}
              className="absolute inset-0 w-full h-full object-cover hero-image-mobile"
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              sizes="100vw"
              quality={index === 0 ? 95 : 75}
            />
          </div>
        ))}
        
        {/* Animated overlay for transition effect */}
        <Suspense fallback={<div className="absolute inset-0 bg-black/50" />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-20"
            >
              <OptimizedImage
                src={heroImages[currentSlide].src}
                alt={optimizeAltText(heroImages[currentSlide].alt, '飲食店撮影のメインビジュアル')}
                width={1920}
                height={1080}
                className="absolute inset-0 w-full h-full object-cover hero-image-mobile"
                priority
                fetchPriority="high"
                sizes="100vw"
                quality={95}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* ページネーション削除 - SEOには不要 */}

      {/* Content overlay */}
      <div className="relative z-30 h-full flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Suspense fallback={
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">飲食店撮影PhotoStudio</h1>
            </div>
          }>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p 
                className="text-white/90 font-semibold mb-4 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                WEBサイト運用の基準で&ldquo;使える&rdquo;写真を。
              </motion.p>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-4 md:gap-6 mb-4">
                  <OptimizedImage
                    src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/cameralogo.svg"
                    alt="飲食店撮影PhotoStudioロゴ - プロの料理撮影サービス"
                    width={80}
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                    priority
                  />
                  <div className="relative">
                    <h1 className="relative inline-block">
                      {/* SEO用の完全なH1テキスト（スクリーンリーダー用） */}
                      <span className="sr-only">飲食店撮影PhotoStudio｜プロカメラマンによる料理・店舗撮影サービス</span>
                      {/* 視覚的な表示用（SEOには影響しない） */}
                      <span 
                        className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight"
                        style={{ 
                          fontFamily: '"Playfair Display", "Noto Serif JP", serif',
                          letterSpacing: '-0.02em'
                        }}
                        aria-hidden="true"
                      >
                        飲食店撮影
                      </span>
                      <span 
                        className="absolute -bottom-1 md:-bottom-2 right-0 text-xl md:text-2xl lg:text-3xl font-light italic opacity-90 tracking-[0.2em]"
                        style={{ 
                          fontFamily: '"Dancing Script", "Caveat", cursive',
                          background: 'linear-gradient(135deg, #F25C00 0%, #F9A603 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          transform: 'rotate(-2deg)',
                          transformOrigin: 'bottom right'
                        }}
                        aria-hidden="true"
                      >
                        PhotoStudio
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-light text-white mt-2 text-center">
                  飲食店専門の出張撮影で、集客を加速。
                </p>
              </motion.div>
              
              {/* 数値バッジ */}
              <motion.div 
                className="flex flex-row justify-center gap-2 md:gap-3 mb-6 w-full px-2 md:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-white/95 text-gray-900 px-2 md:px-4 py-2 rounded-full flex items-center justify-center gap-1 md:gap-2 font-bold shadow-lg flex-1 md:flex-initial">
                  <span className="text-orange-500 text-sm md:text-base">⚡</span>
                  <span className="text-xs md:text-base whitespace-nowrap">最短1週間納品</span>
                </div>
                <div className="bg-white/95 text-gray-900 px-2 md:px-4 py-2 rounded-full flex items-center justify-center gap-1 md:gap-2 font-bold shadow-lg flex-1 md:flex-initial">
                  <span className="text-orange-500 text-sm md:text-base">∞</span>
                  <span className="text-xs md:text-base whitespace-nowrap">時間内無制限</span>
                </div>
                <div className="bg-white/95 text-gray-900 px-2 md:px-4 py-2 rounded-full flex items-center justify-center gap-1 md:gap-2 font-bold shadow-lg flex-1 md:flex-initial">
                  <span className="text-orange-500 text-sm md:text-base">📍</span>
                  <span className="text-xs md:text-base whitespace-nowrap">東京・関東対応</span>
                </div>
              </motion.div>

              {/* 信頼実績カウンター */}
              <motion.div 
                className="mb-6 text-center px-2 md:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <div className="flex flex-row justify-center gap-3 md:gap-6 mb-4">
                  <div className="text-white relative">
                    <span className="text-[8px] md:text-xs absolute -top-1 left-0">店舗撮影</span>
                    <span className="text-xl md:text-3xl font-bold block pl-8 md:pl-12">500+</span>
                  </div>
                  <div className="text-white">
                    <span className="text-xl md:text-3xl font-bold block">年間100件以上</span>
                  </div>
                  <div className="text-white relative">
                    <span className="text-[8px] md:text-xs absolute -top-1 left-0">再依頼率</span>
                    <span className="text-xl md:text-3xl font-bold block pl-8 md:pl-12">95%</span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 opacity-70">
                  <span className="text-white text-xs">掲載実績:<br className="block md:hidden" /></span>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <span className="text-white font-bold text-xs md:text-base">食べログ</span>
                    <span className="text-white font-bold text-xs md:text-base">ぐるなび</span>
                    <span className="text-white font-bold text-xs md:text-base">ホットペッパー</span>
                    <span className="text-white font-bold text-xs md:text-base">Instagram</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/form">
                  <Button variant="primary" className="min-w-[200px] px-6 py-3" id="cta-intro-apply">
                    今すぐ申し込む
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="secondary" className="min-w-[200px] px-6 py-3 !bg-white/20 !border-white !text-white hover:!bg-white hover:!text-orange-500">
                    料金を見る
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </Suspense>
        </div>
      </div>

      {/* Scroll indicator */}
      <Suspense fallback={null}>
        <motion.div 
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </Suspense>
    </section>
  )
})
IntroSection.displayName = 'IntroSection'

const NewsSection = memo(() => (
  <section className="py-12" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-sm font-semibold text-white mb-4">お知らせ</h2>
      <div className="space-y-3">
        <Suspense fallback={<ComponentFallback />}>
          <motion.div
            className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgb(77, 76, 76)' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-gray-300">2025.8.19</span>
            <span className="text-white">飲食店撮影PhotoStudioサイトオープン</span>
          </motion.div>
        </Suspense>
      </div>
    </div>
  </section>
))
NewsSection.displayName = 'NewsSection'

// Lazy loaded FeaturesSection with proper optimization
const FeaturesSection = memo(() => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null)
  
  const features = [
    {
      icon: '📸',
      title: '協会認定のプロフェッショナル撮影',
      description: '日本フードフォトグラファー協会認定カメラマンによる確かな技術力。',
      image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/fpaicon.png',
      fullDescription: '日本フードフォトグラファー協会認定カメラマンが、長年培った技術と経験を活かしてプロフェッショナルな撮影を行います。料理の美味しさを最大限に引き出す構図、ライティング、スタイリングなど、すべての要素において最高水準のクオリティをお約束します。協会の厳しい基準をクリアした技術力で、お店の魅力を確実に表現します。'
    },
    {
      icon: '✨',
      title: '撮影画像は全て自由に使用可能',
      description: '著作権フリー。SNS、Web、印刷物など用途を問わず自由にご利用いただけます。',
      image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%204.jpg',
      fullDescription: '撮影した画像は全て著作権フリーでお渡しします。Instagram、Facebook、TwitterなどのSNS投稿、ホームページやECサイトへの掲載、メニューやチラシなどの印刷物、看板やポスターなど、あらゆる用途で追加料金なしでご自由にお使いいただけます。将来的な用途変更や再利用も完全自由。お店の資産として永続的にご活用ください。'
    },
    {
      icon: '🚀',
      title: '最短1週間の短期納品',
      description: '撮影から納品まで最短1週間。急ぎの案件にも柔軟に対応いたします。',
      image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%206.jpg',
      fullDescription: '撮影完了から最短1週間での納品が可能です。新メニューの告知、季節限定商品のPR、急なイベント対応など、スピーディーな対応が必要な場面でも安心してご依頼いただけます。基本的なレタッチ、色調補正を含めた完成品を短期間でお届け。お急ぎの場合は特急対応（3日納品）のオプションもご用意しています。'
    },
    {
      icon: '📊',
      title: '飲食媒体に精通した効果的な撮影',
      description: '飲食店専門WEBコンサルタントも務めるカメラマンが、集客に繋がる写真を撮影。',
      image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%208.jpg',
      fullDescription: '撮影を担当するカメラマンは、飲食店専門のWEBコンサルタントとしても活動しており、デジタルマーケティングの観点から最も効果的な撮影を行います。食べログ、ぐるなび、ホットペッパーなどの主要グルメサイトのアルゴリズムや、Google検索での上位表示に有利な画像の特徴を熟知。SNSでの拡散力、コンバージョン率の向上、SEO対策まで考慮した戦略的な撮影により、写真を通じて実際の集客アップに貢献します。WEBコンサルティングの知見を活かし、オンライン集客に直結する撮影をお約束します。'
    }
  ]

  return (
    <>
      <section id="features" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <Suspense fallback={<SectionFallback />}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 relative z-10"
            >
              <SectionTitle>
                <span className="inline md:hidden">飲食店撮影<br />PhotoStudioの特徴</span>
                <span className="hidden md:inline">飲食店撮影PhotoStudioの特徴</span>
              </SectionTitle>
            </motion.div>
          </Suspense>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-0">
            {features.map((feature, index) => (
              <Suspense key={index} fallback={<ComponentFallback />}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FeatureCard 
                    {...feature} 
                    onClick={() => setSelectedFeature(feature)}
                  />
                </motion.div>
              </Suspense>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Window */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedFeature && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl overflow-hidden flex flex-col"
                style={{ maxHeight: '95vh', margin: 'auto' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header image - responsive height */}
                <div className="relative flex-shrink-0 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] bg-gray-700">
                  <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                  <OptimizedImage
                    src={selectedFeature.image}
                    alt={optimizeAltText(selectedFeature.title, '飲食店撮影の特徴')}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    quality={75}
                    priority
                  />
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/90 transition-all border-2 border-white/30"
                  >
                    <span className="text-white text-xl sm:text-2xl font-bold">×</span>
                  </button>
                </div>

                {/* Modal content - responsive padding and text */}
                <div
                  className="flex-grow p-4 sm:p-6 md:p-8 bg-white overflow-y-auto min-h-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{selectedFeature.icon}</span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                      {selectedFeature.title}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                    {selectedFeature.fullDescription}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </>
  )
})
FeaturesSection.displayName = 'FeaturesSection'

const PricingSection = memo(({ onOpenModal }: { onOpenModal?: () => void }) => {
  const plans = [
    {
      name: 'ライトプラン',
      time: 1,
      originalPrice: 44000,
      price: 33000,
      discount: 11000,
      cuts: '撮影枚数限定',
      cutsGuide: '（3-5カット納品）',
      isPopular: false,
      features: [
        '1時間の撮影時間',
        '撮影枚数3-5カット限定',
        'データ即日納品可能',
        '商用利用OK',
        '現像のみ',
        '出張費込み（東京23区内、横浜市内、千葉※船橋）',
        '※間接照明の持参はございません',
        'お試し撮影に最適'
      ]
    },
    {
      name: 'スタンダードプラン',
      time: 2,
      originalPrice: 55000,
      price: 44000,
      discount: 11000,
      cuts: '撮影枚数無制限',
      cutsGuide: '（10-15カット納品目安）',
      isPopular: true,
      features: [
        '2時間の撮影時間',
        '撮影枚数時間内無制限（目安10-15カット）',
        'データ即日納品可能',
        '商用利用OK',
        '標準的なレタッチ込み',
        '出張費込み（東京23区内、横浜市内、千葉※船橋）',
        '店内撮影用間接照明持参（※弊社所有×１）',
        '人気メニュー重点撮影'
      ]
    },
    {
      name: 'プレミアムプラン',
      time: 4,
      originalPrice: 99000,
      price: 88000,
      discount: 11000,
      cuts: '撮影枚数無制限',
      cutsGuide: '（30-40カット納品目安）',
      isPopular: false,
      features: [
        '4時間の撮影時間',
        '撮影枚数時間内無制限（目安30-40カット）',
        'データ即日納品可能',
        '商用利用OK',
        '標準的なレタッチ込み',
        '出張費込み（東京23区内、横浜市内、千葉※船橋）',
        '店内撮影用間接照明持参（※弊社所有×１）',
        '撮影ディレクション付き'
      ]
    }
  ]

  return (
    <section id="pricing" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
      <div className="max-w-5xl mx-auto px-4">
        <Suspense fallback={<SectionFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <SectionTitle>料金プラン</SectionTitle>
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                今だけ特別価格
              </div>
            </div>
            <p className="text-gray-300 text-lg mb-2">
              <span className="inline md:hidden">シンプルで分かりやすい3つのプラン。<br />全て込みの明朗会計です。</span>
              <span className="hidden md:inline">シンプルで分かりやすい3つのプラン。全て込みの明朗会計です。</span>
            </p>
            <p className="text-orange-400 font-bold text-lg">
              🎉 期間限定キャンペーン：全プラン¥11,000 OFF！（税込）
            </p>
          </motion.div>
        </Suspense>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6 xl:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Suspense key={index} fallback={<ComponentFallback />}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6 xl:p-8 ${
                  plan.isPopular 
                    ? 'bg-gradient-to-br from-orange-50 via-white to-red-50 border-2 border-orange-400 shadow-2xl md:scale-105' 
                    : 'bg-white border border-gray-200 shadow-xl'
                } hover:shadow-2xl transition-all relative`}
                whileHover={{ y: -10 }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                      🌟 人気No.1
                    </div>
                  </div>
                )}
                <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-black mb-2 mt-2">{plan.name}</h3>
                
                {/* 値引き表示 */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      期間限定
                    </span>
                    <span className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                      ¥{plan.discount.toLocaleString()} OFF
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-gray-400 line-through text-base md:text-lg lg:text-xl">
                      ¥{plan.originalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-orange-500">
                        ¥{plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-gray-600">/ {plan.time}H</span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 font-semibold">
                    {plan.cuts}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {plan.cutsGuide}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 text-sm md:text-base">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/form" className="block">
                  <Button
                    variant={plan.isPopular ? "primary" : "secondary"}
                    className="w-full text-lg py-4"
                    id={plan.isPopular ? 'cta-pricing-popular-apply' : `cta-pricing-${plan.name.replace('プラン', '').toLowerCase()}-select`}
                  >
                    {plan.isPopular ? '今すぐ申し込む' : 'プランを選択'}
                  </Button>
                </Link>
              </motion.div>
            </Suspense>
          ))}
        </div>
        <Suspense fallback={null}>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-300 mb-4">
              その他のご要望にも柔軟に対応いたします
            </p>
            <button 
              onClick={onOpenModal}
              className="text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors inline-flex items-center gap-2 group"
            >
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                🎉 限定
              </span>
              10月申し込み特典はこちら
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </Suspense>
      </div>
    </section>
  )
})
PricingSection.displayName = 'PricingSection'

// Lazy loaded ParallaxSection with performance optimization
const ParallaxSection = memo(() => {
  const [scrollY, setScrollY] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const sectionElement = document.getElementById('parallax-section')
      if (sectionElement) {
        const rect = sectionElement.getBoundingClientRect()
        const sectionTop = rect.top + window.scrollY
        const relativeScroll = scrolled - sectionTop + window.innerHeight
        setOffsetY(relativeScroll * 0.3)
      }
      setScrollY(scrolled)
    }
    
    const throttledScroll = () => {
      requestAnimationFrame(handleScroll)
    }
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  return (
    <section id="parallax-section" className="relative h-[80vh] overflow-hidden">
      {/* Parallax background image */}
      <div 
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{
          transform: `translateY(${offsetY}px)`,
          willChange: 'transform'
        }}
      >
        <OptimizedImage
          src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2010.jpg"
          alt={optimizeAltText('LP_food_10.jpg', '料理写真の撮影風景')}
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <Suspense fallback={<SectionFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center px-4"
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              写真は、<span className="text-orange-400">売上を変える</span>チカラになる
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              料理の一瞬の輝きを捉え、集客につながる魅力的なビジュアルに。<br />
              飲食店専門PhotoStudioが、売上アップを後押しする&ldquo;集客できる料理写真&rdquo;を創り出します。
            </motion.p>
            
            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
              </div>
            </motion.div>
          </motion.div>
        </Suspense>
      </div>
    </section>
  )
})
ParallaxSection.displayName = 'ParallaxSection'

// Lazy loaded and optimized SamplesSection
const SamplesSection = memo(() => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const categories = [
    { id: 'all', name: '全て', count: 37 },
    { id: 'food', name: '料理', count: 26 },
    { id: 'exterior', name: '外観', count: 1 },
    { id: 'interior', name: '内観', count: 10 }
  ]

  const images = [
    // Food photos (LP_food_)
    { id: 1, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%201.jpg', alt: '飲食店撮影 前菜の料理撮影事例' },
    { id: 2, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%202.jpg', alt: '飲食店撮影 メインディッシュの撮影' },
    { id: 3, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%203.jpg', alt: '飲食店撮影 デザートプレートの撮影' },
    { id: 4, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%204.jpg', alt: '飲食店撮影 和食料理の撮影事例' },
    { id: 5, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%205.jpg', alt: '飲食店撮影 洋食メニューの撮影' },
    { id: 6, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%206.jpg', alt: '飲食店撮影 中華料理の撮影事例' },
    { id: 7, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%207.jpg', alt: '飲食店撮影 イタリアン料理撮影' },
    { id: 8, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%208.jpg', alt: '飲食店撮影 フレンチ料理の撮影' },
    { id: 9, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg', alt: '飲食店撮影 創作料理の撮影事例' },
    { id: 10, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2010.jpg', alt: '飲食店撮影 コース料理の撮影' },
    { id: 11, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2011.jpg', alt: '飲食店撮影 ランチメニュー撮影' },
    { id: 12, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2012.jpg', alt: '飲食店撮影 ディナー料理の撮影' },
    { id: 13, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2013.jpg', alt: '飲食店撮影 季節限定メニュー撮影' },
    { id: 14, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2014.jpg', alt: '飲食店撮影 看板料理の撮影事例' },
    { id: 15, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2015.jpg', alt: '飲食店撮影 おすすめ料理の撮影' },
    { id: 16, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2016.jpg', alt: '飲食店撮影 テイクアウトメニュー撮影' },
    { id: 17, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2017.jpg', alt: '飲食店撮影 ドリンクメニューの撮影' },
    { id: 18, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2018.jpg', alt: '飲食店撮影 カクテル・お酒の撮影' },
    { id: 19, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2019.jpg', alt: '飲食店撮影 スイーツメニュー撮影' },
    { id: 20, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2020.jpg', alt: '飲食店撮影 カフェメニューの撮影' },
    { id: 21, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2021.jpg', alt: '飲食店撮影 バーメニューの撮影事例' },
    { id: 22, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2012.jpg', alt: '飲食店撮影 居酒屋メニュー撮影' },
    { id: 23, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2023.jpg', alt: '飲食店撮影 ビストロ料理の撮影事例' },
    { id: 24, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg', alt: '飲食店撮影 会席料理の撮影' },
    { id: 25, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2025.jpg', alt: '飲食店撮影 鉄板焼き料理の撮影事例' },
    { id: 26, category: 'food', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_26.jpg', alt: '飲食店撮影 寿司・刺身の撮影' },
    // Exterior photos (LP_out_)
    { id: 27, category: 'exterior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_out_.png', alt: '飲食店撮影 店舗外観の撮影事例' },
    // Interior photos (LP_room_)
    { id: 28, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%201.jpg', alt: '飲食店撮影 レストラン内観の撮影' },
    { id: 29, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%202.jpg', alt: '飲食店撮影 カフェ店内の撮影事例' },
    { id: 30, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%203.jpg', alt: '飲食店撮影 個室席の撮影' },
    { id: 31, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%204.jpg', alt: '飲食店撮影 カウンター席の撮影事例' },
    { id: 32, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%205.jpg', alt: '飲食店撮影 テーブル席の撮影' },
    { id: 33, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%206.jpg', alt: '飲食店撮影 バーカウンターの撮影事例' },
    { id: 34, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%207.jpg', alt: '飲食店撮影 ダイニングエリアの撮影' },
    { id: 35, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%208.jpg', alt: '飲食店撮影 和室の店内撮影事例' },
    { id: 36, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_%209.jpg', alt: '飲食店撮影 テラス席の撮影' },
    { id: 37, category: 'interior', src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_room_.jpg', alt: '飲食店撮影 エントランスの撮影事例' }
  ]

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory)

  return (
    <>
      <section id="samples" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <Suspense fallback={<SectionFallback />}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionTitle>撮影事例</SectionTitle>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
                飲食店撮影PhotoStudioが手掛けた作品の一部をご紹介。
                単なる写真ではなく、芸術作品としてのフードフォトグラフィーをご覧ください。
              </p>
              
              {/* Category filters */}
              <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-3">
                {/* Mobile: All button on its own row */}
                <div className="flex justify-center md:contents">
                  <Suspense fallback={null}>
                    <motion.button
                      onClick={() => setActiveCategory('all')}
                      className={`px-8 py-3 font-semibold text-base transition-all duration-300 rounded-full w-full md:w-auto max-w-xs ${
                        activeCategory === 'all'
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-white border-2 border-orange-400 text-orange-500 hover:bg-orange-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      全て ({categories.find(c => c.id === 'all')?.count})
                    </motion.button>
                  </Suspense>
                </div>
                
                {/* Mobile: Other buttons in a row */}
                <div className="flex justify-center gap-3 md:contents">
                  {categories.filter(category => category.id !== 'all').map((category) => (
                    <Suspense key={category.id} fallback={null}>
                      <motion.button
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 md:px-8 py-3 font-semibold text-base transition-all duration-300 rounded-full flex-1 md:flex-initial ${
                          activeCategory === category.id
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white border-2 border-orange-400 text-orange-500 hover:bg-orange-50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category.name} ({category.count})
                      </motion.button>
                    </Suspense>
                  ))}
                </div>
              </div>
            </motion.div>
          </Suspense>

          {/* Image grid */}
          <Suspense fallback={<SectionFallback />}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <OptimizedImage 
                      src={`${image.src}?v=${image.src.includes('LP_room_%205') || image.src.includes('LP_room_%206') ? '20250109' : '3'}`} 
                      alt={optimizeAltText(image.alt, '飲食店撮影のギャラリー')}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </div>
      </section>

      {/* Enlarged modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-5xl w-full max-h-[90vh] mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-14 md:-top-16 right-2 md:right-0 z-10 w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/90 transition-all border-2 border-white/30"
                  aria-label="画像を閉じる"
                >
                  <span className="text-white text-2xl md:text-3xl font-bold">✕</span>
                </button>
                <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                  <OptimizedImage
                    src={`${selectedImage.src}?v=${selectedImage.src.includes('LP_room_%205') || selectedImage.src.includes('LP_room_%206') ? '20250109' : '3'}`}
                    alt={optimizeAltText(selectedImage.alt, '飲食店撮影の拡大表示')}
                    width={1200}
                    height={800}
                    className="relative w-full h-full object-contain z-10"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                    quality={80}
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </>
  )
})
SamplesSection.displayName = 'SamplesSection'

// Blog Section - Latest articles
const BlogSection = memo(() => {
  const latestPosts = getLatestPosts(3)
  
  return (
    <section id="blog" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <Suspense fallback={<SectionFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionTitle>最新コンテンツ</SectionTitle>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
              飲食店の売上向上に役立つ撮影ノウハウ、媒体運用のコツなど、
              プロカメラマンが実践知を発信しています。
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {latestPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Suspense fallback={<ComponentFallback />}>
                  <PostCard post={post} />
                </Suspense>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="https://foodphoto-pro.com/blog">
              <motion.button
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-lg hover:shadow-xl transform transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                すべての記事を見る
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </Suspense>
      </div>
    </section>
  )
})
BlogSection.displayName = 'BlogSection'

const FlowSection = memo(() => {
  const steps = [
    {
      number: 1,
      title: 'お申し込み',
      description: 'フォームまたはお電話でお申し込みください。'
    },
    {
      number: 2,
      title: '撮影日調整',
      description: 'ご希望の日時を調整させていただきます。'
    },
    {
      number: 3,
      title: '撮影',
      description: 'プロカメラマンがお店にお伺いして撮影します。'
    },
    {
      number: 4,
      title: '画像納品',
      description: '編集済みの画像データをお渡しします。'
    }
  ]

  return (
    <section id="flow" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
      <div className="max-w-5xl mx-auto px-4">
        <Suspense fallback={<SectionFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionTitle>納品までの流れ</SectionTitle>
            <p className="text-gray-300 text-lg">
              撮影から撮影画像納品まで最長で7営業日となります。<br />
              <span className="text-sm">場合によってはご希望に添えない可能性があります。</span>
            </p>
          </motion.div>
        </Suspense>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <FlowStep key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
})
FlowSection.displayName = 'FlowSection'

const FAQSection = memo(() => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  const faqs = [
    {
      question: "撮影料金に出張費は含まれていますか？",
      answer: "東京23区内、横浜市内、千葉（船橋）エリアは基本料金に出張費が含まれています。その他の地域についても対応可能ですので、お気軽にご相談ください。"
    },
    {
      question: "撮影した写真の著作権はどうなりますか？",
      answer: "撮影した全ての写真は著作権フリーでお渡しします。SNS、Webサイト、印刷物など、あらゆる用途で追加料金なしでご自由にお使いいただけます。"
    },
    {
      question: "撮影当日までに準備することはありますか？",
      answer: "特別な準備は不要ですが、撮影したいメニューのリストアップと、可能であれば店内の清掃をお願いしています。詳細は事前の打ち合わせでご案内いたします。"
    },
    {
      question: "悪天候の場合はどうなりますか？",
      answer: "室内撮影が中心のため、基本的に天候の影響は受けません。ただし、外観撮影をご希望の場合は、天候により日程変更をご提案する場合があります。"
    },
    {
      question: "撮影データはいつ頂けますか？",
      answer: "基本的に撮影日から１週間以内にデータ納品いたします。お急ぎの場合はフレキシブルな対応も可能です。"
    },
    {
      question: "キャンセル料はかかりますか？",
      answer: "撮影日の3日前までは無料でキャンセル可能です。それ以降のキャンセルについては、キャンセル料が発生する場合があります。"
    }
  ]

  return (
    <section id="faq" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <Suspense fallback={<SectionFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionTitle>よくあるご質問</SectionTitle>
            <p className="text-gray-400 mt-4">
              飲食店撮影に関するよくあるご質問をまとめました
            </p>
          </motion.div>
        </Suspense>
        
        {/* シンプルなアコーディオンFAQ */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <span className={`text-2xl text-orange-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  ⌄
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})
FAQSection.displayName = 'FAQSection'

// Delete old FAQ data
const __DELETE_faqs = [
    {
      question: "飲食店撮影の料金はいくらですか？",
      answer: "飲食店撮影の料金は、ライトプラン33,000円（1時間）、スタンダードプラン44,000円（2時間）、プレミアムプラン88,000円（4時間）の3プランをご用意しています。東京23区内、横浜市内、千葉（船橋）エリアは出張費込みです。"
    },
    {
      question: "撮影時間はどのくらいかかりますか？",
      answer: "プランにより1時間〜の撮影時間を設定しています。料理のボリュームや撮影内容により最適なプランをご提案いたします。追加時間のオプション（60分11,000円〜）もございます。"
    },
    {
      question: "撮影エリアはどこまで対応していますか？",
      answer: "東京23区内、横浜市内、千葉（船橋）エリアは基本料金内で出張いたします。その他の地域についても対応可能ですので、お気軽にご相談ください。"
    },
    {
      question: "どのような写真を撮影してもらえますか？",
      answer: "料理写真、店舗内観・外観、スタッフ写真など、飲食店の魅力を伝えるあらゆる写真を撮影いたします。Web・SNS用、メニュー用、看板用など用途に合わせた撮影が可能です。"
    },
    {
      question: "撮影した写真の著作権はどうなりますか？",
      answer: "撮影した写真の著作権は原則としてお客様に帰属します。商用利用、二次利用、SNS投稿など自由にご使用いただけます。"
    },
    {
      question: "撮影前の準備は必要ですか？",
      answer: "特別な準備は不要ですが、撮影したい料理のリストアップや、撮影イメージの共有があるとスムーズです。多く料理を撮影したい場合は前日からの仕込みを工夫していただけるとスムーズかと思います。また店内撮影をされる場合は不要物の掃除を事前にしていただけると助かります。"
    },
    {
      question: "納品形式と納期を教えてください",
      answer: "撮影データは高解像度のJPEG形式で、撮影日から5営業日以内にクラウドストレージ経由で納品いたします。即日納品オプションもご用意しています。"
    },
    {
      question: "キャンセル料はかかりますか？",
      answer: "撮影日2営業日前：20%、1営業日前：50%、当日：100%のキャンセル料が発生します。日程変更は可能な限り対応いたしますので、お早めにご相談ください。"
    }
  ]

const CasesSection = memo(() => {
  const cases = [
    {
      title: '売上が前年比150%アップ',
      company: 'イタリアンレストラン B.V',
      role: 'オーナーシェフ',
      name: 'Y様',
      comment: '撮影と併せて、オプションの飲食媒体の編集代行も一緒にお願いしてアクセスと予約が急増しました。'
    },
    {
      title: 'SNS運用が楽になりました',
      company: 'カフェ M.G',
      role: '店長',
      name: 'S様',
      comment: '撮影時間内で枚数重視の撮影をお願いして、アップする画像の手札が増えて運用に対しての抵抗が減りました。'
    },
    {
      title: 'デリバリー注文2倍',
      company: '中華料理 R',
      role: '経営者',
      name: 'L様',
      comment: 'プロの技術で料理の魅力が200%アップしました。'
    },
    {
      title: '客単価が15%向上しました',
      company: '和食処 S',
      role: '女将',
      name: 'S様',
      comment: 'オプションも依頼してページの変更をしてもらいブランディングアップに成功して単価がアップしました。'
    },
    // 新規追加レビュー
    {
      title: '急な依頼にも対応',
      company: 'カフェレストラン',
      role: 'オーナー',
      name: 'K.T様',
      comment: '今回は急な撮影依頼にご対応いただきありがとうございます。またの機会でもご相談させていただく際は何卒よろしくお願いいたします。'
    },
    {
      title: 'スピード感が最高',
      company: '創作和食店',
      role: '店主',
      name: 'M.S様',
      comment: '日程調整も迅速に対応いただき、当日も状況を見ながら要望に応えていただき助かりました！また、納品も翌日到着と大変早くスピード感も気に入りました。'
    },
    {
      title: 'リピート確定の品質',
      company: 'イタリアン',
      role: 'シェフ',
      name: 'A.N様',
      comment: '前回、依頼させていただいて大変すばらしかったので再度リピートさせていただきました。ストロボを使った料理写真はすばらしい仕上がりでした。質と納品の速さはトップクラスです。'
    },
    {
      title: 'プロフェッショナルな仕上がり',
      company: 'ワインビストロ',
      role: 'マネージャー',
      name: 'H.Y様',
      comment: '今回はホームページ用の写真を撮って頂きました。本当にプロフェッショナルな素晴らしい写真が撮れました。リピート確定です。知り合いにも紹介する予定です。'
    },
    {
      title: '安心感が凄い',
      company: 'フレンチレストラン',
      role: 'オーナー',
      name: 'T.M様',
      comment: '時間厳守で、仕事が早く、写真もとても綺麗に撮ってくださったり、段取りも素晴らしく進めてくださるので、安心感が凄かったです。料理や店内とても綺麗に撮って頂きました。'
    }
  ]

  return (
    <section id="cases" className="py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
      <div className="max-w-5xl mx-auto px-4">
        <Suspense fallback={<SectionFallback />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionTitle>クライアントの声</SectionTitle>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              飲食店撮影PhotoStudioでブランドイメージを一新されたお客様の声
            </p>
          </motion.div>
        </Suspense>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <Suspense key={index} fallback={<ComponentFallback />}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CaseCard {...caseItem} />
              </motion.div>
            </Suspense>
          ))}
        </div>
      </div>
    </section>
  )
})
CasesSection.displayName = 'CasesSection'

const BottomCTA = memo(({ onOpenChat }: { onOpenChat: () => void }) => (
  <section className="hidden md:block py-16" style={{ backgroundColor: 'rgb(36, 35, 35)' }}>
    <div className="max-w-5xl mx-auto px-4">
      <Suspense fallback={<SectionFallback />}>
        <motion.div
          className="rounded-3xl p-12 text-center"
          style={{ backgroundColor: 'rgb(77, 76, 76)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            webで今すぐお申し込みいただけます。
          </h2>
          <p className="text-white text-lg mb-8">
            飲食店撮影PhotoStudioで、料理の新しい表現を発見してください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/form" className="w-full sm:w-auto">
              <Button variant="primary" id="cta-faq-apply" className="w-full">今すぐ申し込む</Button>
            </Link>
            <Button variant="secondary" onClick={onOpenChat} data-chat-open className="w-full sm:w-auto">まずは問い合わせる</Button>
          </div>
        </motion.div>
      </Suspense>
    </div>
  </section>
))
BottomCTA.displayName = 'BottomCTA'

const Footer = memo(({ onOpenChat }: { onOpenChat: () => void }) => (
  <footer className="bg-gray-900 text-white py-12 pb-24 md:pb-12">
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="font-bold mb-4">飲食店撮影PhotoStudio</h3>
          <p className="text-gray-400 text-sm">
            プロフェッショナルフードフォトグラフィー
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">リンク</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                会社概要
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                個人情報保護方針
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                サービス規約
              </Link>
            </li>
            <li>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                サイトマップ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">関連サービス</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/services/movie" className="text-gray-400 hover:text-white transition-colors">
                動画制作サービス
              </Link>
            </li>
            <li>
              <button 
                onClick={onOpenChat}
                className="text-gray-400 hover:text-white transition-colors text-left"
                data-chat-open
              >
                お問い合わせ
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8">
        <p className="text-center text-gray-400 text-sm">
          © 2024 NonTurn Corporation. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
))
Footer.displayName = 'Footer'

// Main Component with optimized performance
export default function FoodPhotoClient() {
  // FAQ data for schema
  const faqData = [
    {
      question: "飲食店撮影の料金はいくらですか？",
      answer: "ライトプラン33,000円（1時間）、スタンダードプラン44,000円（2時間）、プレミアムプラン88,000円（4時間）の3プランをご用意しています。"
    },
    {
      question: "撮影エリアはどこまで対応していますか？",
      answer: "東京23区内、横浜市内、千葉（船橋）エリアは基本料金内で出張いたします。その他の地域についても対応可能です。"
    },
    {
      question: "撮影した写真の著作権はどうなりますか？",
      answer: "撮影した写真の著作権は原則としてお客様に帰属します。商用利用、二次利用、SNS投稿など自由にご使用いただけます。"
    }
  ]

  // HowTo data for schema
  const howToSteps = [
    { name: "お問い合わせ", text: "フォームまたは電話でお問い合わせください" },
    { name: "ヒアリング", text: "撮影内容・希望日時を確認します" },
    { name: "撮影当日", text: "プロカメラマンが出張撮影を行います" },
    { name: "レタッチ", text: "撮影データを編集・調整します" },
    { name: "納品", text: "5営業日以内にデータ納品します" }
  ]
  const [isLoading, setIsLoading] = useState(true)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Initialize Core Web Vitals monitoring and optimizations
  useEffect(() => {
    console.log('FoodPhotoClient mounted, isLoading:', true)

    // Clean up body and html styles that might have been set by modal or other pages
    document.body.style.overflow = ''
    document.body.style.removeProperty('overflow')
    document.body.style.backgroundColor = ''
    document.body.style.removeProperty('background-color')
    document.documentElement.style.overflow = ''
    document.documentElement.style.removeProperty('overflow')

    // Initialize web vitals tracking
    initWebVitals()

    // Preload critical resources for better LCP
    preloadCriticalResources()

    // Prevent layout shifts for better CLS
    preventLayoutShifts()

    // Initialize advanced image optimizations
    initImageOptimizations()

    // Initialize font optimizations for better performance
    initFontOptimizations()

    // Initialize accessibility enhancements
    initAccessibility()

    // Cleanup on unmount
    return () => {
      // Explicitly set background to white to override any computed CSS styles
      document.body.style.backgroundColor = 'white'
      document.body.style.overflow = ''
      document.body.style.removeProperty('overflow')
      document.documentElement.style.overflow = ''
      document.documentElement.style.removeProperty('overflow')
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  // Optimized scroll trigger for modal with useCallback
  const handleScroll = useCallback(() => {
    const pricingSection = document.getElementById('pricing')
    if (!pricingSection) return
    
    const pricingRect = pricingSection.getBoundingClientRect()
    const pricingBottom = pricingRect.bottom
    
    console.log('Pricing bottom:', pricingBottom, 'hasShownModal:', hasShownModal, 'isLoading:', isLoading)
    
    const triggerPoint = window.innerWidth < 768 ? -100 : -200
    
    if (pricingBottom < triggerPoint && !hasShownModal && !isLoading) {
      console.log('Showing modal! Pricing section scrolled past')
      setShowOfferModal(true)
      setHasShownModal(true)
      sessionStorage.setItem('foodphoto-offer-shown', 'true')
    }
  }, [hasShownModal, isLoading])

  // Scroll trigger for modal
  useEffect(() => {
    const wasShown = sessionStorage.getItem('foodphoto-offer-shown')
    console.log('Was shown in session:', wasShown)
    
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('reset') === 'true') {
        sessionStorage.removeItem('foodphoto-offer-shown')
        console.log('SessionStorage cleared')
      }
    }
    
    if (wasShown && !window.location.search.includes('reset=true')) {
      setHasShownModal(true)
    }

    const timer = setTimeout(() => {
      console.log('Adding scroll listener')
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    }, 2000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const handleLoaderComplete = useCallback(() => {
    console.log('Loader complete, setting isLoading to false')
    setIsLoading(false)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowOfferModal(false)
  }, [])

  const handleOpenModal = useCallback(() => {
    setShowOfferModal(true)
  }, [])

  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  return (
    <>
      {/* Structured Data */}
      <LocalBusinessSchema 
        aggregateRating={{ ratingValue: 4.8, reviewCount: 50 }}
      />
      <FAQSchema questions={faqData} />
      <HowToSchema 
        name="飲食店撮影の流れ"
        description="プロカメラマンによる飲食店撮影の流れ"
        steps={howToSteps}
        totalTime="PT5D"
      />
      
      {/* Accessibility Enhancements */}
      <AccessibilityEnhancer />
      
      <Suspense fallback={null}>
        <AnimatePresence>
          {isLoading && (
            <FoodPhotoLoader onComplete={handleLoaderComplete} />
          )}
        </AnimatePresence>
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
        <motion.main 
          id="main-content"
          className="min-h-screen" 
          style={{ backgroundColor: 'rgb(36, 35, 35)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          role="main"
        >
          {/* パンくずナビゲーション */}
          <Breadcrumb 
            items={[
              { label: '飲食店撮影PhotoStudio' }
            ]}
          />
          <Header onOpenChat={handleOpenChat} />
          <IntroSection />
          <NewsSection />
          <Suspense fallback={<SectionFallback />}>
            <PainPointsSection onOpenChat={handleOpenChat} />
          </Suspense>
          <FeaturesSection />
          <PricingSection onOpenModal={handleOpenModal} />
          <ParallaxSection />
          <SamplesSection />
          <BlogSection />
          <FlowSection />
          <CasesSection />
          <FAQSection />
          <BottomCTA onOpenChat={handleOpenChat} />
          <Footer onOpenChat={handleOpenChat} />
          
          {/* Special Offer Modal */}
          <Suspense fallback={null}>
            <SpecialOfferModal 
              isOpen={showOfferModal} 
              onClose={handleCloseModal} 
            />
          </Suspense>
          
          {/* Mobile Fixed Bottom CTA Bar */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden shadow-lg" style={{ backgroundColor: 'rgb(249, 115, 22)' }} role="navigation" aria-label="モバイルCTA">
            <div className="flex">
              <button 
                onClick={handleOpenChat}
                className="flex-1 text-white py-4 px-4 font-bold text-base flex items-center justify-center gap-2 border-r border-white/20 active:opacity-80 transition-opacity" 
                id="cta-mobile-chat"
                style={{ backgroundColor: 'rgb(249, 115, 22)' }}
              >
                <span>💬</span>
                <span>無料相談</span>
              </button>
              <Link href="/form" className="flex-1">
                <button className="w-full text-white py-4 px-4 font-bold text-base flex items-center justify-center gap-2 active:opacity-80 transition-opacity" id="cta-mobile-form" style={{ backgroundColor: 'rgb(239, 68, 68)' }}>
                  <span>📝</span>
                  <span>お申し込み</span>
                </button>
              </Link>
            </div>
          </nav>
        </motion.main>
      </Suspense>

      {/* PWA Installer */}
      <Suspense fallback={null}>
        <PWAInstaller />
      </Suspense>

      {/* Chat Widget - Always Mounted */}
      <Suspense fallback={null}>
        <LazyChat isOpen={isChatOpen} onClose={handleCloseChat} />
      </Suspense>
    </>
  )
}
