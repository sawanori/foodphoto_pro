'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { reviews, reviewStats } from '@/data/foodphoto-reviews'

export default function ReviewSection() {
  const [showAll, setShowAll] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  // フィルタリングされたレビュー
  const filteredReviews = useMemo(() => {
    if (selectedRating === null) {
      return showAll ? reviews : reviews.slice(0, 3)
    }
    const filtered = reviews.filter(r => r.rating === selectedRating)
    return showAll ? filtered : filtered.slice(0, 3)
  }, [selectedRating, showAll])

  // 星の表示コンポーネント
  const StarRating = ({ rating, size = 'normal' }: { rating: number; size?: 'small' | 'normal' | 'large' }) => {
    const sizeClasses = {
      small: 'text-sm',
      normal: 'text-lg',
      large: 'text-2xl',
    }
    
    return (
      <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* セクションタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            お客様の声
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            実際にご利用いただいた飲食店様からの評価とレビュー
          </p>
        </motion.div>

        {/* 評価サマリー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左側：総合評価 */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="text-5xl font-bold text-gray-800">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={reviewStats.averageRating} size="large" />
                  <p className="text-sm text-gray-500 mt-1">
                    {reviewStats.totalReviews}件のレビュー
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <span>✓</span>
                <span>すべて実際のお客様からの声</span>
              </div>
            </div>

            {/* 右側：評価分布 */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                    selectedRating === rating ? 'bg-yellow-50 border border-yellow-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] / reviewStats.totalReviews) * 100}%` 
                      }}
                      transition={{ duration: 0.8, delay: 0.2 + (5 - rating) * 0.1 }}
                      className="h-full bg-yellow-400"
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}件
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* レビュー一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {review.author}様
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.authorType}
                    </p>
                  </div>
                  {review.verified && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                      確認済み
                    </span>
                  )}
                </div>

                <StarRating rating={review.rating} size="small" />
                
                <p className="text-gray-700 mt-3 text-sm leading-relaxed line-clamp-6">
                  {review.content}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {review.date}
                  </span>
                  {review.helpful && (
                    <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <span>👍</span>
                      <span>役立った ({review.helpful})</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* もっと見るボタン */}
        {(selectedRating === null ? reviews.length : reviews.filter(r => r.rating === selectedRating).length) > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition-colors"
            >
              {showAll ? (
                <>
                  <span>レビューを閉じる</span>
                  <span className="text-lg">↑</span>
                </>
              ) : (
                <>
                  <span>すべてのレビューを見る</span>
                  <span className="text-lg">↓</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            お客様の期待を超える撮影を
          </h3>
          <p className="text-gray-600 mb-6">
            多くの飲食店様から高評価をいただいています
          </p>
          <a
            id="cta-review-apply"
            href="/services/photo/foodphoto/form"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            無料相談・お見積もり
          </a>
        </motion.div>
      </div>
    </section>
  )
}