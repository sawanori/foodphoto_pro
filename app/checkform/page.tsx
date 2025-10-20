import React from 'react'
import { Metadata } from 'next'
import CheckFormClient from './CheckFormClient'

export const metadata: Metadata = {
  title: '無料撮影サンプル申し込み｜飲食店撮影PhotoStudio',
  description: '飲食店撮影PhotoStudioの無料撮影サンプル申し込みフォーム。プロカメラマンによる撮影サンプルを2枚無料でご提供します。',
  openGraph: {
    title: '無料撮影サンプル申し込み｜飲食店撮影PhotoStudio',
    description: '飲食店撮影PhotoStudioの無料撮影サンプル申し込みフォーム',
    type: 'website',
    url: 'https://foodphoto-pro.com/checkform',
    siteName: '飲食店撮影PhotoStudio',
  },
  twitter: {
    card: 'summary_large_image',
    title: '無料撮影サンプル申し込み｜飲食店撮影PhotoStudio',
    description: '飲食店撮影PhotoStudioの無料撮影サンプル申し込みフォーム',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckFormPage() {
  return <CheckFormClient />
}