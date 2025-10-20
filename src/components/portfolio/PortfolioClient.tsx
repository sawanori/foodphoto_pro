'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DynamicScene3D } from '@/components/3d/DynamicScene3D'
import { portfolioProjects, portfolioCategories } from '@/data/portfolio'
import Image from 'next/image'

export function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const filteredProjects = activeCategory === 'all' 
    ? portfolioProjects 
    : portfolioProjects.filter(project => project.category === activeCategory)

  const selectedProjectData = selectedProject 
    ? portfolioProjects.find(p => p.id === selectedProject)
    : null

  return (
    <>
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
                PORTFOLIO
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              これまでに手がけたプロジェクトの一部をご紹介します
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Filter */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {portfolioCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 font-medium text-sm uppercase tracking-wider transition-all duration-300  relative overflow-hidden ${
                  activeCategory === category.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">
                  {category.name} ({category.count})
                </span>
                {activeCategory !== category.id && (
                  <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="group scale-in bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-yellow-400/20 overflow-hidden hover:border-yellow-400/50 transition-all duration-500  relative rounded-lg"
                  initial={{ opacity: 0, y: 50, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(251, 191, 36, 0.3)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    {project.category === 'photo' ? (
                      // Photography projects - show image directly
                      <div className="relative w-full h-full">
                        <Image
                          src={project.thumbnailUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Video projects - show play button with gradient
                      <div className={`w-full h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                        <motion.div 
                          className="text-center relative z-10"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <motion.div 
                            className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-black/50 transition-all duration-300"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7"/>
                            </svg>
                          </motion.div>
                          <p className="text-white font-medium text-sm opacity-90">WATCH DEMO</p>
                        </motion.div>
                        
                        {/* Animated Particles */}
                        <div className="absolute inset-0 opacity-20">
                          {Array.from({ length: 5 }, (_, i) => {
                            const leftPos = ((Math.sin(i * 2.5) + 1) / 2) * 100
                            const topPos = ((Math.cos(i * 3.2) + 1) / 2) * 100
                            return (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                  left: `${leftPos}%`,
                                  top: `${topPos}%`
                                }}
                                animate={{
                                  y: [0, -20, 0],
                                  opacity: [0, 1, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  delay: i * 0.4,
                                  repeat: Infinity
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-white tracking-wider uppercase group-hover:text-yellow-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <h4 className="text-yellow-400 mb-3 font-medium">{project.subtitle}</h4>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        {project.tags.slice(0, 2).map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            className="bg-yellow-400/20 text-yellow-400 px-2 py-1 text-xs font-medium uppercase tracking-wider border border-yellow-400/30 "
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(251, 191, 36, 0.3)" }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">{project.year}</span>
                    </div>
                  </div>
                  
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && selectedProjectData && (
          <>
            {selectedProjectData.category === 'photo' ? (
              // Photography Modal - Full size image display
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-7xl w-full max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Main Image */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={selectedProjectData.thumbnailUrl}
                      alt={selectedProjectData.title}
                      fill
                      className="object-contain rounded-lg shadow-2xl"
                      sizes="(max-width: 1200px) 100vw, 80vw"
                    />
                  </div>

                  {/* Image Info Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 rounded-b-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{selectedProjectData.title}</h2>
                        <h3 className="text-xl text-yellow-400 mb-2">{selectedProjectData.subtitle}</h3>
                        <p className="text-gray-300 text-sm mb-3">{selectedProjectData.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProjectData.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-yellow-400/20 text-yellow-400 px-2 py-1 text-xs font-medium uppercase tracking-wider border border-yellow-400/30 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-sm">{selectedProjectData.year}</div>
                        <div className="text-gray-400 text-sm">{selectedProjectData.client}</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              // Video Modal - Detailed project information
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-8">
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-yellow-400/20 hover:bg-yellow-400/40 rounded-full flex items-center justify-center text-yellow-400 transition-all duration-300"
                    >
                      ×
                    </button>

                    {/* Project Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${selectedProjectData.gradient} rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-bold">{selectedProjectData.industry[0]}</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-1">{selectedProjectData.title}</h2>
                          <h3 className="text-xl text-yellow-400">{selectedProjectData.subtitle}</h3>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedProjectData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-yellow-400/20 text-yellow-400 px-3 py-1 text-sm font-medium uppercase tracking-wider border border-yellow-400/30 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="text-lg font-semibold text-yellow-400 mb-4">プロジェクト概要</h4>
                        <p className="text-gray-300 leading-relaxed mb-6">
                          {selectedProjectData.detailedDescription}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">クライアント</span>
                            <span className="text-white font-medium">{selectedProjectData.client}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">業界</span>
                            <span className="text-white font-medium">{selectedProjectData.industry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">制作年</span>
                            <span className="text-white font-medium">{selectedProjectData.year}</span>
                          </div>
                          {selectedProjectData.duration && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">動画時間</span>
                              <span className="text-white font-medium">{selectedProjectData.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-yellow-400 mb-4">使用技術・手法</h4>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {selectedProjectData.technologies.map((tech, index) => (
                            <div key={index} className="bg-gray-800/50 rounded-lg p-2 text-center text-sm text-gray-300">
                              {tech}
                            </div>
                          ))}
                        </div>

                        <h4 className="text-lg font-semibold text-yellow-400 mb-4">成果・効果</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedProjectData.results).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key}</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Client Testimonial */}
                    {selectedProjectData.testimonial && (
                      <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-6 mb-8">
                        <h4 className="text-lg font-semibold text-yellow-400 mb-4">お客様の声</h4>
                        <blockquote className="text-gray-300 italic mb-4">
                          &ldquo;{selectedProjectData.testimonial.text}&rdquo;
                        </blockquote>
                        <cite className="text-yellow-400 text-sm">
                          — {selectedProjectData.testimonial.author}
                        </cite>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {selectedProjectData.videoUrl && (
                        <a
                          href={selectedProjectData.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 text-center font-medium uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 rounded"
                        >
                          動画を視聴
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="flex-1 bg-transparent border border-yellow-400 text-yellow-400 px-6 py-3 font-medium uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all duration-300 rounded"
                      >
                        閉じる
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  )
}