'use client'

import { useEffect } from 'react'

export function AsyncStylesheets() {
  useEffect(() => {
    // Next.jsのビルド時に生成されるCSSファイルを非同期で読み込む
    // これによりレンダリングブロックを回避
    const loadStylesheet = (href: string) => {
      // 既に存在するかチェック
      const existing = document.querySelector(`link[href="${href}"]`)
      if (existing) return

      // preloadリンクを作成
      const preload = document.createElement('link')
      preload.rel = 'preload'
      preload.as = 'style'
      preload.href = href

      // stylesheetリンクを作成（media="print"でブロックを回避）
      const stylesheet = document.createElement('link')
      stylesheet.rel = 'stylesheet'
      stylesheet.href = href
      stylesheet.media = 'print'

      // 読み込み完了後にmediaを'all'に変更
      stylesheet.onload = function() {
        stylesheet.media = 'all'
      }

      // noscript用のフォールバック
      const noscript = document.createElement('noscript')
      const fallback = document.createElement('link')
      fallback.rel = 'stylesheet'
      fallback.href = href
      noscript.appendChild(fallback)

      // DOMに追加
      document.head.appendChild(preload)
      document.head.appendChild(stylesheet)
      document.head.appendChild(noscript)
    }

    // Next.jsの_next/static/cssディレクトリのCSSを検出して非同期化
    // 本番環境でのみ動作
    if (process.env.NODE_ENV === 'production') {
      // 既存のstylesheetリンクを取得
      const existingStylesheets = document.querySelectorAll('link[rel="stylesheet"]')
      existingStylesheets.forEach((link) => {
        const href = link.getAttribute('href')
        if (href && href.includes('/_next/static/css/')) {
          // 既存のブロッキングリンクを削除
          link.remove()
          // 非同期で再読み込み
          loadStylesheet(href)
        }
      })
    }
  }, [])

  return null
}