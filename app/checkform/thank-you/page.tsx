import React from 'react'
import { Metadata } from 'next'
import ThankYouClient from './ThankYouClient'

export const metadata: Metadata = {
  title: 'お申し込み完了｜飲食店撮影PhotoStudio',
  description: '無料撮影サンプルのお申し込みを受け付けました。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ThankYouPage() {
  return <ThankYouClient />
}