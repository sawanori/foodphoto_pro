import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: '飲食店撮影の料金・プラン｜FoodPhoto Pro（メニュー・店舗撮影）',
  description: '飲食店専門の出張撮影サービスの料金とプラン。時間内撮影枚数無制限、最短1週間納品。ロケハンや媒体ページ最適化などのオプションも。',
  openGraph: {
    title: '飲食店撮影の料金・プラン｜FoodPhoto Pro',
    description: '飲食店専門の出張撮影サービスの料金とプラン。時間内撮影枚数無制限、最短1週間納品。',
    images: ['/assets/og/og-pricing.jpg'],
    type: 'website',
  },
}

export default function PricingPage() {
  return <PricingClient />
}