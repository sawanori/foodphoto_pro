import { Metadata } from 'next'
import ThankYouClient from './ThankYouClient'

export const metadata: Metadata = {
  title: '送信完了 | 飲食店撮影PhotoStudio',
  description: 'お申し込みありがとうございます。担当者より2営業日以内にご連絡いたします。',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return <ThankYouClient />
}