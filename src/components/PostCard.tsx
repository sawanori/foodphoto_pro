'use client'

import Link from 'next/link'
import Image from 'next/image'
import Badge from './Badge'
import { motion } from 'framer-motion'

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  category?: { slug: string; name: string };
  published_at: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-gray-300"
        aria-label={post.title}
      >
        {post.cover_image_url && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            {post.category && (
              <Badge>{post.category.name}</Badge>
            )}
            <time className="text-xs text-gray-500 font-medium">
              {new Date(post.published_at).toLocaleDateString("ja-JP", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2 mb-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center text-orange-600 font-semibold text-sm">
            <span className="group-hover:mr-2 transition-all duration-200">続きを読む</span>
            <svg 
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}