// 画像最適化のユーティリティ関数

/**
 * 画像のalt属性を最適化
 * SEOに効果的なalt属性を生成
 */
export function optimizeAltText(imageName: string, context?: string): string {
  // ファイル名から基本的な説明を生成
  const baseName = imageName
    .replace(/\.[^/.]+$/, '') // 拡張子を削除
    .replace(/[-_]/g, ' ') // ハイフンとアンダースコアをスペースに
    .replace(/\d+/g, '') // 数字を削除
    .trim()

  // コンテキストに基づいてalt属性を最適化
  const contextMap: Record<string, string> = {
    'LP_food': '飲食店撮影PhotoStudioの',
    'food': '料理撮影の',
    'restaurant': 'レストラン撮影の',
    'menu': 'メニュー撮影の',
    'interior': '店内撮影の',
    'exterior': '外観撮影の',
    'chef': 'シェフ撮影の',
    'staff': 'スタッフ撮影の',
  }

  // マッチするコンテキストを探す
  let prefix = ''
  for (const [key, value] of Object.entries(contextMap)) {
    if (imageName.toLowerCase().includes(key.toLowerCase())) {
      prefix = value
      break
    }
  }

  // デフォルトのコンテキストを追加
  if (!prefix && context) {
    prefix = context + 'の'
  }

  return `${prefix}撮影事例${baseName ? ': ' + baseName : ''}`
}

/**
 * 画像サイズの最適化設定を取得
 */
export function getOptimizedSizes(type: 'hero' | 'gallery' | 'thumbnail' | 'full'): string {
  const sizesMap = {
    hero: '100vw',
    gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 640px) 50vw, 25vw',
    full: '(max-width: 1280px) 100vw, 1280px',
  }
  return sizesMap[type] || sizesMap.gallery
}

/**
 * 画像のプリロード設定を取得
 */
export function shouldPreloadImage(index: number, section: string): boolean {
  // ヒーローセクションと最初の3枚の画像をプリロード
  if (section === 'hero') return true
  if (section === 'gallery' && index < 3) return true
  return false
}

/**
 * レスポンシブ画像のソースセットを生成
 */
export function generateSrcSet(baseUrl: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]): string {
  // Vercel Blob Storageの画像は既に最適化されているため、そのまま使用
  if (baseUrl.includes('blob.vercel-storage.com')) {
    return ''
  }
  
  // 他の画像の場合はNext.jsの画像最適化を利用
  return widths
    .map(width => `/_next/image?url=${encodeURIComponent(baseUrl)}&w=${width}&q=75 ${width}w`)
    .join(', ')
}

/**
 * 画像の遅延読み込み設定
 */
export interface LazyLoadConfig {
  rootMargin: string
  threshold: number
  loading: 'lazy' | 'eager'
}

export function getLazyLoadConfig(priority: boolean = false): LazyLoadConfig {
  if (priority) {
    return {
      rootMargin: '0px',
      threshold: 0,
      loading: 'eager',
    }
  }
  
  return {
    rootMargin: '50px',
    threshold: 0.01,
    loading: 'lazy',
  }
}

/**
 * 画像のメタデータ
 */
export interface ImageMetadata {
  src: string
  alt: string
  width: number
  height: number
  title?: string
  caption?: string
}

/**
 * 飲食店撮影の画像メタデータを生成
 */
export function generateFoodPhotoMetadata(imageUrl: string, index: number): ImageMetadata {
  const imageName = imageUrl.split('/').pop() || ''
  const categories = [
    '料理撮影',
    'メニュー撮影',
    '店内撮影',
    '外観撮影',
    'スタッフ撮影',
    'イベント撮影',
  ]
  
  const category = categories[index % categories.length]
  
  return {
    src: imageUrl,
    alt: optimizeAltText(imageName, category),
    width: 800,
    height: 600,
    title: `${category}事例 ${index + 1}`,
    caption: `飲食店撮影PhotoStudioによる${category}の実例`,
  }
}