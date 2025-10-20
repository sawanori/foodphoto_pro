'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import Image from 'next/image'
import { MainLayout } from '@/components/layout/MainLayout'
import { HeroSection } from '@/components/ui/HeroSection'
import { PhotoGallerySection } from './PhotoGallerySection'
import { services } from '@/data/services'

export default function PhotoServicePageClient() {
 const serviceData = services.photo
 const [selectedPlan, setSelectedPlan] = useState(0)
 const [selectedCategory, setSelectedCategory] = useState(0)
 
 // Gallery images from Vercel storage
 const galleryImages = useMemo(() => [
  // Original images
  { 
   id: 2, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/2-l4gatMsuCh1slTHV3iGYszNGTlDxhx.jpg', 
   alt: 'Professional Photography Work 2' 
  },
  { 
   id: 3, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/3-TzPVHUjCuBAdIPAhFs8ZOeADYHWLKc.jpg', 
   alt: 'Professional Photography Work 3' 
  },
  { 
   id: 4, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/4-XoQ2KJrHwhwWFyCx1xhUsArWI6BuwB.jpg', 
   alt: 'Professional Photography Work 4' 
  },
  { 
   id: 5, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/5-hl4KhogTlAig2r6RUD0SCvrDL22c3i.jpg', 
   alt: 'Professional Photography Work 5' 
  },
  { 
   id: 6, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/6-lBfVjkw1GyFlaswiLfy0XVr7Y2iBjC.jpg', 
   alt: 'Professional Photography Work 6' 
  },
  { 
   id: 7, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/7-mJKwnJ1MV7rgCTVH2W7YH58O16jhJM.jpg', 
   alt: 'Professional Photography Work 7' 
  },
  { 
   id: 8, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/8-Zs2WBv7g88WxHD85HWhaQoWWExe7Xp.jpg', 
   alt: 'Professional Photography Work 8' 
  },
  { 
   id: 9, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/9-HS8CW5NXVIyjfZI7IBnbIAamIM35If.jpg', 
   alt: 'Professional Photography Work 9' 
  },
  // New images
  { 
   id: 10, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port01.jpg', 
   alt: 'Professional Photography Work 10' 
  },
  { 
   id: 11, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port02.jpg', 
   alt: 'Professional Photography Work 11' 
  },
  { 
   id: 12, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port03.jpg', 
   alt: 'Professional Photography Work 12' 
  },
  { 
   id: 13, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port04.jpg', 
   alt: 'Professional Photography Work 13' 
  },
  { 
   id: 14, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port05.jpg', 
   alt: 'Professional Photography Work 14' 
  },
  { 
   id: 15, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port06.jpg', 
   alt: 'Professional Photography Work 15' 
  },
  { 
   id: 16, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port07.jpg', 
   alt: 'Professional Photography Work 16' 
  },
  { 
   id: 17, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port08.jpg', 
   alt: 'Professional Photography Work 17' 
  },
  { 
   id: 18, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port09.jpg', 
   alt: 'Professional Photography Work 18' 
  },
  { 
   id: 19, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port10.jpg', 
   alt: 'Professional Photography Work 19' 
  },
  { 
   id: 20, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port11.jpg', 
   alt: 'Professional Photography Work 20' 
  },
  { 
   id: 21, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port12.jpg', 
   alt: 'Professional Photography Work 21' 
  },
  { 
   id: 22, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port13.jpg', 
   alt: 'Professional Photography Work 22' 
  },
  { 
   id: 23, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port14.jpg', 
   alt: 'Professional Photography Work 23' 
  },
  { 
   id: 24, 
   src: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/port15.jpg', 
   alt: 'Professional Photography Work 24' 
  }
 ], [])

 const planCardVariants = {
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
   boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
  }
 }

 const photoServiceStructuredData = {
   "@context": "https://schema.org",
   "@type": "Service",
   "name": "写真撮影",
   "description": "料理写真や商品撮影などプロによる商業撮影",
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
   "serviceType": ["写真撮影", "料理撮影", "商品撮影", "店舗撮影"],
   "offers": {
     "@type": "AggregateOffer",
     "priceCurrency": "JPY",
     "lowPrice": "30000",
     "highPrice": "100000"
   }
 }

 return (
  <MainLayout>
   {/* Structured Data */}
   <Script
     id="photo-service-structured-data"
     type="application/ld+json"
     dangerouslySetInnerHTML={{
       __html: JSON.stringify(photoServiceStructuredData)
     }}
   />
   
   <HeroSection
    title="Photography"
    subtitle="写真撮影"
    description="商品撮影、ポートレート、建築写真など高品質な写真撮影サービス"
    icon="📸"
    gradient="from-blue-400 to-purple-500"
   />
   
   {/* Service Categories - Photography Types */}
   <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
     <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12 sm:mb-16 md:mb-20"
     >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">
       撮影<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">カテゴリー</span>
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
       様々なニーズに対応する撮影サービス
      </p>
     </motion.div>
     
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {serviceData.categories.map((category, index) => (
       <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setSelectedCategory(index)}
        className="cursor-pointer relative group"
       >
        <motion.div
         className={`relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
          selectedCategory === index ? 'ring-2 sm:ring-4 ring-blue-400 ring-offset-2 sm:ring-offset-4 ring-offset-black' : ''
         }`}
         whileHover={{ scale: 1.05, y: -10 }}
         whileTap={{ scale: 0.98 }}
        >
         <div className="aspect-[16/10] sm:aspect-video relative">
          {category.image ? (
           <>
            <Image
             src={category.image}
             alt={category.name}
             fill
             className="object-cover"
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
           </>
          ) : (
           <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
            <motion.div
             className="text-5xl sm:text-6xl md:text-7xl"
             animate={{ 
              rotate: selectedCategory === index ? 360 : 0,
              scale: selectedCategory === index ? 1.2 : 1
             }}
             transition={{ duration: 0.6 }}
            >
             {category.icon}
            </motion.div>
           </div>
          )}
         </div>
         
         <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-400 transition-colors">
           {category.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-200 opacity-90">
           {category.description}
          </p>
         </div>
         
         <motion.div
          className="absolute inset-0 border-2 border-blue-400 rounded-lg sm:rounded-xl md:rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedCategory === index ? 1 : 0 }}
          transition={{ duration: 0.3 }}
         />
        </motion.div>
       </motion.div>
      ))}
     </div>
    </div>
   </section>
   
   {/* Pricing Plans */}
   <section className="py-16 sm:py-24 md:py-32 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/50"></div>
    
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
     <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16 sm:mb-20"
     >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
       料金<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">プラン</span>
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
       ニーズに合わせた柔軟なプランをご用意
      </p>
     </motion.div>
     
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
      {serviceData.plans.map((plan, index) => (
       <motion.div
        key={index}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        onClick={() => setSelectedPlan(index)}
        className="cursor-pointer group"
       >
        <motion.div
         variants={planCardVariants}
         initial="rest"
         whileHover="hover"
         animate={selectedPlan === index ? "hover" : "rest"}
         className={`relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-lg border rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full transition-all duration-300 ${
          selectedPlan === index 
           ? 'border-blue-400 shadow-2xl shadow-blue-400/30 scale-105' 
           : 'border-gray-700 hover:border-gray-600'
         }`}
         style={{ transformStyle: 'preserve-3d' }}
        >
         {/* Plan Header */}
         <div className="text-center mb-6 sm:mb-8">
          <motion.h3 
           className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-4 transition-colors duration-300 ${
            selectedPlan === index ? 'text-blue-400' : 'text-white group-hover:text-gray-200'
           }`}
           animate={selectedPlan === index ? { scale: [1, 1.05, 1] } : {}}
           transition={{ duration: 0.5 }}
          >
           {plan.name}
          </motion.h3>
          
          <motion.div 
           className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
            selectedPlan === index ? 'text-blue-400' : 'text-gray-300'
           }`}
           whileHover={{ scale: 1.1 }}
          >
           ¥{plan.basePrice.toLocaleString()}〜
          </motion.div>
          
          <p className="text-gray-400 text-sm">{plan.duration}</p>
         </div>
         
         <p className={`text-center mb-6 transition-colors duration-300 ${
          selectedPlan === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
         }`}>
          {plan.description}
         </p>
         
         {/* Includes List */}
         <div className="space-y-3 mb-8">
          <h4 className={`font-semibold transition-colors duration-300 ${
           selectedPlan === index ? 'text-blue-400' : 'text-gray-300'
          }`}>
           プランに含まれるもの:
          </h4>
          <ul className="space-y-2">
           {plan.includes.map((item, itemIndex) => (
            <motion.li
             key={itemIndex}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: itemIndex * 0.1 }}
             className={`flex items-center text-sm transition-colors duration-300 ${
              selectedPlan === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
             }`}
            >
             <motion.span 
              className="w-2 h-2 bg-blue-400 rounded-full mr-3"
              animate={selectedPlan === index ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
             />
             {item}
            </motion.li>
           ))}
          </ul>
         </div>
         
         {/* Additional Hour Price */}
         <div className={`text-center p-4 rounded-lg border transition-all duration-300 ${
          selectedPlan === index 
           ? 'bg-blue-400/10 border-blue-400/30' 
           : 'bg-gray-800/50 border-gray-700/50'
         }`}>
          <p className="text-sm text-gray-400">追加1時間</p>
          <p className={`font-bold transition-colors duration-300 ${
           selectedPlan === index ? 'text-blue-400' : 'text-gray-300'
          }`}>
           ¥{plan.additionalHour.toLocaleString()}
          </p>
         </div>
         
         {/* Glowing Border Effect */}
         {selectedPlan === index && (
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-transparent to-purple-500/20 animate-pulse"></div>
         )}
        </motion.div>
       </motion.div>
      ))}
     </div>

     {/* Food Photography Link */}
     <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12 text-center bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400/50 rounded-2xl p-10 hover:border-orange-400 transition-all duration-300"
     >
      <h3 className="text-2xl font-bold text-white mb-3">
       🍽️ 飲食店撮影PhotoStudio
      </h3>
      <p className="text-gray-200 mb-6 text-lg">
       飲食店専門のプロカメラマンによる料理・店舗撮影サービス
      </p>
      <p className="text-gray-300 mb-2">
       東京・横浜・千葉エリア出張無料 | 撮影実績500店舗以上
      </p>
      <Link href="/services/photo/foodphoto">
       <motion.button
        className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-500 hover:to-red-600 transition-all duration-300 mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        飲食店撮影の詳細を見る
        <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
       </motion.button>
      </Link>
     </motion.div>
    </div>
   </section>

   {/* Process Timeline */}
   <section className="py-16 sm:py-24 md:py-32 bg-gray-900 relative">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
     <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-20"
     >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
       撮影<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">フロー</span>
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
       スピーディーで確実な3ステップ
      </p>
     </motion.div>

     {/* Mobile Layout - Compact Cards */}
     <div className="block md:hidden space-y-6">
      {serviceData.process.map((step, index) => (
       <motion.div
        key={step.step}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative"
       >
        <motion.div
         className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl hover:border-blue-400/50 transition-all duration-500 group"
         whileHover={{ scale: 1.02 }}
        >
         <div className="flex items-start gap-4">
          <motion.div
           className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
           whileHover={{ rotate: 360 }}
           transition={{ duration: 0.6 }}
          >
           {step.icon || step.step}
          </motion.div>
          <div className="flex-1">
           <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
            {step.title}
           </h3>
           <p className="text-blue-400 font-semibold text-sm mb-2">{step.duration}</p>
           <p className="text-gray-300 text-sm mb-3">{step.description}</p>
           {step.price && <p className="text-yellow-400 font-semibold text-sm">{step.price}</p>}
          </div>
         </div>
        </motion.div>
        
        {/* Connecting Line (not on last item) */}
        {index < serviceData.process.length - 1 && (
         <div className="absolute left-7 top-20 h-6 w-0.5 bg-gradient-to-b from-blue-400 to-purple-500 opacity-50"></div>
        )}
       </motion.div>
      ))}
     </div>

     {/* Desktop Layout - Original Timeline */}
     <div className="hidden md:block relative">
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 opacity-30"></div>
      
      {serviceData.process.map((step, index) => (
       <motion.div
        key={step.step}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        className={`relative flex items-center mb-16 ${
         index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
        }`}
       >
        {/* Content */}
        <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
         <motion.div
          className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl hover:border-blue-400/50 transition-all duration-500 group"
          whileHover={{ scale: 1.02, y: -5 }}
         >
          <div className="flex items-center mb-4">
           <motion.div
            className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
           >
            {step.icon || step.step}
           </motion.div>
           <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {step.title}
           </h3>
          </div>
          
          <p className="text-blue-400 font-semibold mb-3">{step.duration}</p>
          <p className="text-gray-300 mb-4">{step.description}</p>
          {step.price && <p className="text-yellow-400 font-semibold text-lg">{step.price}</p>}
         </motion.div>
        </div>
        
        {/* Center Circle */}
        <motion.div
         className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-gray-900 z-10"
         whileHover={{ scale: 1.5 }}
        />
        
        {/* Empty Space */}
        <div className="w-5/12" />
       </motion.div>
      ))}
     </div>
    </div>
   </section>

   {/* Gallery Section - Moved after Process Timeline */}
   <PhotoGallerySection images={galleryImages} categories={serviceData.categories} />

   {/* CTA Section */}
   <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
    <div className="max-w-4xl mx-auto px-4 text-center">
     <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold text-white mb-8"
     >
      プロの撮影で<br />
      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
       ビジネスを加速
      </span>
     </motion.h2>
     
     <motion.p
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-xl text-gray-300 mb-12"
     >
      まずはお気軽にご相談ください
     </motion.p>
     
     <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
     >
      <Link href="/contact">
       <motion.button
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        お問い合わせ
       </motion.button>
      </Link>
      
      <Link href="/portfolio">
       <motion.button
        className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        実績を見る
       </motion.button>
      </Link>
     </motion.div>
    </div>
   </section>
  </MainLayout>
 )
}