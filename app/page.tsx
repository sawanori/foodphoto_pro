import FoodPhotoClient from './FoodPhotoClient'
import Script from 'next/script'
import { getAllStructuredData } from './structured-data'
import { AsyncStylesheets } from '@/components/AsyncStylesheets'
import fs from 'fs'
import path from 'path'
export { metadata, viewport } from './metadata'

// Enable static generation with hourly revalidation
export const dynamic = 'force-static'
export const revalidate = 3600

// Read critical CSS at build time
const criticalCSS = fs.readFileSync(
  path.join(process.cwd(), 'app/critical.css'),
  'utf8'
)

export default function FoodPhotoPage() {
  const structuredData = getAllStructuredData()

  return (
    <>
      {/* Inline Critical CSS for faster first paint */}
      <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      
      {/* Resource Hints for Performance Optimization */}
      <link rel="dns-prefetch" href="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com" />
      <link rel="preconnect" href="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preload critical fonts for faster text rendering */}
      <link 
        rel="preload" 
        as="font" 
        type="font/woff2" 
        href="https://fonts.gstatic.com/s/notoserifjp/v28/xn77YHs72GKoTvER4Gn3b5eMZBaPRkgfU8fEwb0.woff2" 
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* Preload critical hero images for faster LCP with high priority */}
      <link
        rel="preload"
        as="image"
        href="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg"
        imageSrcSet="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg 640w, https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg 1024w"
        media="(max-width: 1023px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg"
        imageSrcSet="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg 1920w"
        media="(min-width: 1024px)"
        fetchPriority="high"
      />
      
      <Script
        id="foodphoto-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* CSS非同期読み込みコンポーネント */}
      <AsyncStylesheets />

      <FoodPhotoClient />
    </>
  )
}