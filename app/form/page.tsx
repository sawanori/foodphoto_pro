import { Metadata } from 'next'
import FormPageClient from './FormPageClient'

export const metadata: Metadata = {
  title: '撮影お申し込み | 飲食店撮影PhotoStudio',
  description: '飲食店撮影PhotoStudioの撮影サービスお申し込みフォーム。プロフェッショナルな料理写真撮影のご予約はこちらから。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function FoodPhotoFormPage() {
  return <FormPageClient />
}