'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Portfolio } from '@/types'
import Image from 'next/image'

interface VideoThumbnailProps {
  project: Portfolio
  index: number
}

export function VideoThumbnail({ project, index }: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black">
        {/* Thumbnail Image */}
        <div className="aspect-video bg-gray-800 relative">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
              <svg
                className="w-8 h-8 text-black ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 text-sm font-medium rounded-full border border-yellow-400/20">
              {project.category}
            </span>
            <span className="text-gray-400 text-sm">{project.year}</span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-medium text-sm">
              {project.clientName}
            </span>
            
            {project.featured && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded">
                FEATURED
              </span>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}