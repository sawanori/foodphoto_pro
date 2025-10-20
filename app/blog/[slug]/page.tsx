import { getPostBySlug, getAllPosts, getLatestPosts } from '@/lib/mock'
import RichProse from '@/components/RichProse'
import PostCard from '@/components/PostCard'
import Badge from '@/components/Badge'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { calculateReadingTime } from '@/utils/reading-time'
import { extractHeadings, addIdsToHeadings } from '@/utils/extract-headings'
import TableOfContents from '@/components/TableOfContents'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const post = getPostBySlug(resolvedParams.slug)
  const base = 'https://foodphoto-pro.com'
  const url = `${base}/blog/${resolvedParams.slug}`
  
  if (!post) {
    return {
      title: '記事が見つかりません｜飲食店撮影PhotoStudio',
    }
  }

  const title = `${post.title}｜飲食店撮影PhotoStudio`
  const description = post.excerpt || '飲食店撮影の実践知を発信'
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      authors: [post.author_name || 'PhotoStudio'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// JSON-LD用ユーティリティ関数（nullを出さない安全整形）
function articleJsonLd(post: any, url: string) {
  const obj: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: [{ 
      "@type": "Person", 
      name: post.author_name || "PhotoStudio" 
    }],
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "飲食店撮影PhotoStudio",
      logo: {
        "@type": "ImageObject",
        url: "https://foodphoto-pro.com/logo.png"
      }
    }
  }
  if (post.cover_image_url) {
    obj.image = [post.cover_image_url]
  }
  if (post.category?.name) {
    obj.articleSection = post.category.name
  }
  if (post.excerpt) {
    obj.description = post.excerpt
  }
  return obj
}

function breadcrumbJsonLd(post: any, url: string, base: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { 
        "@type": "ListItem", 
        position: 1, 
        name: "ホーム", 
        item: base 
      },
      { 
        "@type": "ListItem", 
        position: 2, 
        name: "ブログ", 
        item: `${base}/blog` 
      },
      { 
        "@type": "ListItem", 
        position: 3, 
        name: post.title, 
        item: url 
      }
    ]
  }
}

export default async function BlogDetail({ params }: Props) {
  const resolvedParams = await Promise.resolve(params)
  const post = getPostBySlug(resolvedParams.slug)
  const base = 'https://foodphoto-pro.com'
  const url = `${base}/blog/${resolvedParams.slug}`
  
  if (!post) {
    notFound()
  }

  // 読了時間を計算
  const readingTime = calculateReadingTime(post.content_html)
  
  // 見出しを抽出し、コンテンツにIDを追加
  const headings = extractHeadings(post.content_html)
  const contentWithIds = addIdsToHeadings(post.content_html)
  
  // Get related posts (latest 3 posts excluding current)
  const relatedPosts = getLatestPosts(4).filter(p => p.id !== post.id).slice(0, 3)
  
  // 同じカテゴリの記事を取得（文中に表示用）
  const sameCategoryPost = getAllPosts()
    .filter(p => p.id !== post.id && p.category?.slug === post.category?.slug)
    .slice(0, 1)[0]

  return (
    <article className="min-h-screen bg-white">
      {/* 構造化データ：Article */}
      <Script 
        id="ld-article" 
        type="application/ld+json" 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(post, url))
        }}
      />
      {/* 構造化データ：BreadcrumbList */}
      <Script 
        id="ld-breadcrumb" 
        type="application/ld+json" 
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(post, url, base))
        }}
      />
      {/* Header with breadcrumb */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center text-sm mb-4 opacity-90">
            <Link href="https://foodphoto-pro.com" className="hover:underline">
              飲食店撮影PhotoStudio
            </Link>
            <span className="mx-2">/</span>
            <Link href="https://foodphoto-pro.com/blog" className="hover:underline">
              ブログ
            </Link>
            <span className="mx-2">/</span>
            <span className="line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Article */}
          <div className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {post.category && (
                  <Link 
                    href={`https://foodphoto-pro.com/blog/category/${post.category.slug}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {post.category.name}
                  </Link>
                )}
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("ja-JP", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>・</span>
                <span>{readingTime}分で読めます</span>
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image_url && (
              <div className="relative aspect-[16/9] w-full mb-8 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}

            {/* モバイル用目次 */}
            <TableOfContents headings={headings} />

            {/* 冒頭CTA */}
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
              <p className="text-sm text-gray-700 mb-3">
                飲食店撮影のプロが、あなたのお店の魅力を最大限に引き出します
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  id="cta-blogsidebar-apply"
                  href="https://foodphoto-pro.com/form"
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-center text-sm"
                >
                  無料相談を申し込む
                </Link>
                <Link 
                  href="https://foodphoto-pro.com#pricing"
                  className="inline-block px-5 py-2.5 bg-white border border-orange-500 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors text-center text-sm"
                >
                  料金プランを見る
                </Link>
              </div>
            </div>

            {/* Article Body with inline related article */}
            <div className="mb-16">
              <RichProse html={contentWithIds.slice(0, contentWithIds.length / 2)} />
              
              {/* 文中の関連記事カード */}
              {sameCategoryPost && (
                <aside className="my-10 p-6 border border-gray-200 rounded-2xl bg-gray-50">
                  <div className="text-xs text-gray-500 mb-2 font-medium">あわせて読みたい</div>
                  <Link 
                    href={`https://foodphoto-pro.com/blog/${sameCategoryPost.slug}`}
                    className="block group"
                  >
                    <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                      {sameCategoryPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {sameCategoryPost.excerpt}
                    </p>
                  </Link>
                </aside>
              )}
              
              <RichProse html={contentWithIds.slice(contentWithIds.length / 2)} />
            </div>

            {/* 著者プロフィールと更新日 */}
            <div className="mt-12 p-6 border border-gray-200 rounded-2xl bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">PS</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {post.author_name || "PhotoStudio編集部"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    飲食店専門フォトグラファー
                  </p>
                  <p className="text-sm text-gray-600">
                    東京・横浜・千葉エリアで1000店舗以上の撮影実績。料理写真から店舗撮影まで、飲食店の魅力を最大限に引き出す撮影技術をご提供します。
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    最終更新：{new Date(post.updated_at || post.published_at).toLocaleDateString("ja-JP", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="border-t border-b border-gray-200 py-6 my-12">
              <p className="text-sm text-gray-600 mb-3 font-medium">この記事をシェア</p>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://foodphoto-pro.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  X (Twitter)
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://foodphoto-pro.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Facebook
                </a>
                <a
                  href={`https://line.me/R/msg/text/?${encodeURIComponent(post.title + ' https://foodphoto-pro.com/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  LINE
                </a>
              </div>
            </div>

            {/* 強CTA Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold mb-4">
                撮影で売上を変える、第一歩を
              </h3>
              <p className="mb-6 opacity-95">
                プロの撮影で、あなたのお店の魅力を120%引き出します。<br />
                まずは無料相談で、具体的な撮影プランをご提案させてください。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  id="cta-blogbottom-apply"
                  href="https://foodphoto-pro.com/form"
                  className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                >
                  無料相談を申し込む
                </Link>
                <Link
                  href="https://foodphoto-pro.com#pricing"
                  className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-orange-600 transition-all duration-200 text-center"
                >
                  料金プランを確認する
                </Link>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">関連記事</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {relatedPosts.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
                {post.category && (
                  <div className="text-center">
                    <Link
                      href={`https://foodphoto-pro.com/blog/category/${post.category.slug}`}
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                    >
                      {post.category.name}の記事をもっと見る
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </article>
  )
}