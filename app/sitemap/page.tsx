import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mock'

export const metadata: Metadata = {
  title: 'サイトマップ | 飲食店撮影PhotoStudio',
  description: 'foodphoto-pro.comの全ページ一覧。飲食店撮影サービスの各ページへのリンク集です。',
  robots: {
    index: true,
    follow: true,
  },
}

export default function FoodPhotoSitemap() {
  const posts = getAllPosts()
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            サイトマップ
          </h1>
          <p className="text-gray-600">
            飲食店撮影PhotoStudioの全ページ一覧
          </p>
        </header>

        {/* メインページセクション */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-orange-400 pb-2">
            メインページ
          </h2>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="text-blue-600 hover:text-orange-500 text-lg">
                🏠 トップページ - 飲食店撮影サービス
              </Link>
            </li>
          </ul>
        </section>

        {/* サービスページセクション */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-orange-400 pb-2">
            サービス関連
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">申し込み・お問い合わせ</h3>
              <ul className="space-y-2 ml-4">
                <li>
                  <Link href="/form" className="text-blue-600 hover:text-orange-500">
                    📝 撮影申し込みフォーム
                  </Link>
                </li>
                <li>
                  <Link href="/checkform" className="text-blue-600 hover:text-orange-500">
                    ✅ 事前チェックフォーム
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">料金・プラン</h3>
              <ul className="space-y-2 ml-4">
                <li>
                  <Link href="/#pricing" className="text-blue-600 hover:text-orange-500">
                    💰 料金プラン一覧
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="text-blue-600 hover:text-orange-500">
                    ⭐ サービスの特徴
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ブログ記事セクション - 新規追加 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-orange-400 pb-2">
            ブログ・お役立ち記事
          </h2>
          <div className="mb-4">
            <Link href="/blog" className="text-blue-600 hover:text-orange-500 font-semibold">
              📚 ブログトップページ
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">撮影ノウハウ</h3>
              <ul className="space-y-2 ml-4">
                {posts.filter(p => p.category?.slug === 'howto').map(post => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-orange-500 text-sm">
                      • {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">媒体運用</h3>
              <ul className="space-y-2 ml-4">
                {posts.filter(p => p.category?.slug === 'media').map(post => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-orange-500 text-sm">
                      • {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* エリアページセクション */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-orange-400 pb-2">
            対応エリア
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { area: 'shibuya', name: '渋谷', description: 'トレンド発信地' },
              { area: 'shinjuku', name: '新宿', description: '日本最大の繁華街' },
              { area: 'yokohama', name: '横浜', description: '港町の多様な食文化' },
              { area: 'ikebukuro', name: '池袋', description: 'ラーメン激戦区' },
              { area: 'shinagawa', name: '品川', description: 'ビジネス街' },
              { area: 'ginza', name: '銀座', description: '高級飲食店街' },
              { area: 'roppongi', name: '六本木', description: '国際色豊かなエリア' }
            ].map((item) => (
              <div key={item.area} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href={`/area/${item.area}`} className="block">
                  <h3 className="font-bold text-gray-800 mb-1">📍 {item.name}エリア</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* その他のページ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-orange-400 pb-2">
            その他のページ
          </h2>
          <ul className="space-y-3">
            <li>
              <Link href="/#samples" className="text-blue-600 hover:text-orange-500">
                📸 撮影事例・ポートフォリオ
              </Link>
            </li>
            <li>
              <Link href="/#flow" className="text-blue-600 hover:text-orange-500">
                🔄 撮影の流れ
              </Link>
            </li>
            <li>
              <Link href="/#cases" className="text-blue-600 hover:text-orange-500">
                💬 お客様の声・導入事例
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="text-blue-600 hover:text-orange-500">
                ❓ よくあるご質問
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-blue-600 hover:text-orange-500">
                📋 利用規約
              </Link>
            </li>
          </ul>
        </section>

        {/* フッター情報 */}
        <footer className="mt-16 pt-8 border-t-2 border-gray-200">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              飲食店撮影PhotoStudio - プロカメラマンによる料理・店舗撮影サービス
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/" className="hover:text-orange-500">
                トップページに戻る
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/form" className="hover:text-orange-500">
                今すぐ申し込む
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}