import { getAllPosts } from '@/lib/mock'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ブログ｜飲食店撮影PhotoStudio',
  description: '飲食店の売上向上に役立つ撮影ノウハウ、媒体運用、エリア別の撮影テクニックなど、プロのカメラマンが実践知を発信しています。',
  openGraph: {
    title: 'ブログ｜飲食店撮影PhotoStudio',
    description: '飲食店の売上向上に役立つ撮影ノウハウ、媒体運用、エリア別の撮影テクニックなど、プロのカメラマンが実践知を発信しています。',
    type: 'website',
    url: 'https://foodphoto-pro.com/blog',
  },
}

export default function BlogList() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center text-sm mb-4">
            <Link href="https://foodphoto-pro.com" className="hover:underline">
              飲食店撮影PhotoStudio
            </Link>
            <span className="mx-2">/</span>
            <span>ブログ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ブログ</h1>
          <p className="text-lg opacity-90 max-w-3xl">
            飲食店の売上向上に役立つ撮影ノウハウ、媒体運用のコツ、エリア別の撮影テクニックなど、
            実践的な情報を発信しています。
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button className="px-5 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
            すべて
          </button>
          <button className="px-5 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition-all">
            撮影ノウハウ
          </button>
          <button className="px-5 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition-all">
            媒体運用
          </button>
          <button className="px-5 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition-all">
            エリア運用
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>

        {/* Load More Button */}
        {posts.length >= 6 && (
          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              もっと見る
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-10 text-center border border-orange-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            撮影のご相談はお気軽に
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            東京・横浜・千葉エリアで飲食店撮影をお考えの方は、まずは無料相談からお気軽にご連絡ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              id="cta-bloglist-apply"
              href="https://foodphoto-pro.com/form"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              無料相談を申し込む
            </Link>
            <Link
              href="https://foodphoto-pro.com#pricing"
              className="inline-block px-8 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors"
            >
              料金プランを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}