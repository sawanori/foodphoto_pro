/**
 * 画像プレースホルダー生成ユーティリティ
 */

/**
 * Base64エンコードされたSVGプレースホルダーを生成
 */
export function generatePlaceholder(width: number, height: number, color: string = '#f3f4f6'): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `.trim()
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Blur用のData URLを生成（簡易版）
 */
export function generateBlurDataURL(dominantColor: string = '#1a1a1a'): string {
  const svg = `
    <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
      <filter id="blur" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
      </filter>
      <rect width="8" height="8" fill="${dominantColor}" filter="url(#blur)"/>
    </svg>
  `.trim()
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * 飲食店撮影用のプレースホルダー設定
 */
export const FOODPHOTO_PLACEHOLDERS = {
  hero: generateBlurDataURL('#2a2a2a'),
  gallery: generateBlurDataURL('#f3f4f6'),
  thumbnail: generatePlaceholder(400, 300, '#e5e7eb'),
  feature: generateBlurDataURL('#fef3c7'),
}

/**
 * 画像タイプに応じたプレースホルダーを取得
 */
export function getImagePlaceholder(type: 'hero' | 'gallery' | 'thumbnail' | 'feature'): string {
  return FOODPHOTO_PLACEHOLDERS[type] || FOODPHOTO_PLACEHOLDERS.gallery
}