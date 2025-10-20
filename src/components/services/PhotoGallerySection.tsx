'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface GalleryImage {
  id: number
  src: string
  alt: string
  category?: string
}

interface Category {
  name: string
  description: string
  examples?: string[]
  icon?: string
  image?: string
}

interface PhotoGallerySectionProps {
  images: GalleryImage[]
  categories?: Category[]
}

export function PhotoGallerySection({ images, categories = [] }: PhotoGallerySectionProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Categorized images with tags
  const categorizedImages = images.map((img, index) => ({
    ...img,
    category: img.src.includes('port') || img.src.includes('7-mJKwnJ1MV7rgCTVH2W7YH58O16jhJM') ? 'ポートレート' : 
              '料理撮影'
  }))

  const filteredImages = selectedCategory === 'all' 
    ? categorizedImages 
    : categorizedImages.filter(img => img.category === selectedCategory)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const handleNext = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length
    setSelectedImage(filteredImages[nextIndex])
    setCurrentImageIndex(nextIndex)
  }

  const handlePrev = () => {
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[prevIndex])
    setCurrentImageIndex(prevIndex)
  }

  if (!mounted) {
    return (
      <section className="py-16 sm:py-24 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              作品<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ギャラリー</span>
            </h2>
            <p className="text-lg text-gray-300">プロフェッショナルな撮影実績をご覧ください</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
            作品<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ギャラリー</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            プロフェッショナルな撮影実績をご覧ください
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            すべて
          </button>
          {['料理撮影', 'ポートレート'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Photography Link for Food Category */}
        {selectedCategory === '料理撮影' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <a
              href="https://foodphoto-pro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-xl mr-2">🍽️</span>
              飲食店撮影PhotoStudio
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-gray-400 text-sm mt-2">
              飲食店専門の撮影サービスサイトはこちら
            </p>
          </motion.div>
        )}

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.id}-${selectedCategory}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handleImageClick(image, index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs font-medium bg-black/50 inline-block px-2 py-1 rounded">
                    {image.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-7xl max-h-[90vh] mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-contain rounded-lg"
                  quality={90}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white text-sm font-medium">{selectedImage.category}</p>
                  <p className="text-gray-300 text-xs mt-1">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </p>
                </div>
              </motion.div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}