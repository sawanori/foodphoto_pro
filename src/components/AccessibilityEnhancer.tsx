'use client'

import { useEffect } from 'react'

/**
 * アクセシビリティ改善コンポーネント
 * SEOとユーザビリティの向上を目的とした改善を実装
 */
export default function AccessibilityEnhancer() {
  useEffect(() => {
    // 画像のalt属性を確認・改善
    const enhanceImageAlt = () => {
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        // alt属性が空または未設定の場合
        if (!img.alt || img.alt.trim() === '') {
          // src属性からファイル名を取得して仮のalt属性を設定
          const src = img.src
          const filename = src.split('/').pop()?.split('.')[0] || ''
          
          // 特定のパターンに基づいてalt属性を生成
          if (src.includes('food') || src.includes('LP_food')) {
            img.alt = '飲食店料理撮影サンプル'
          } else if (src.includes('logo')) {
            img.alt = '飲食店撮影PhotoStudioロゴ'
          } else if (src.includes('staff')) {
            img.alt = 'スタッフ写真'
          } else {
            img.alt = `画像: ${filename.replace(/[-_]/g, ' ')}`
          }
        }
        
        // decorative属性がある場合は空のaltにする
        if (img.getAttribute('data-decorative') === 'true') {
          img.alt = ''
          img.setAttribute('role', 'presentation')
        }
      })
    }

    // ボタンとリンクのアクセシビリティ改善
    const enhanceInteractiveElements = () => {
      // ボタンにaria-labelを追加
      const buttons = document.querySelectorAll('button')
      buttons.forEach((button) => {
        if (!button.getAttribute('aria-label') && !button.textContent?.trim()) {
          // アイコンのみのボタンの場合
          const icon = button.querySelector('svg')
          if (icon) {
            const iconClass = icon.getAttribute('class') || ''
            if (iconClass.includes('menu')) {
              button.setAttribute('aria-label', 'メニューを開く')
            } else if (iconClass.includes('close')) {
              button.setAttribute('aria-label', '閉じる')
            } else if (iconClass.includes('arrow')) {
              button.setAttribute('aria-label', '次へ')
            }
          }
        }
      })

      // リンクの改善
      const links = document.querySelectorAll('a')
      links.forEach((link) => {
        // 外部リンクの識別
        if (link.hostname && link.hostname !== window.location.hostname) {
          if (!link.getAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer')
          }
          if (!link.getAttribute('aria-label')?.includes('新しいウィンドウ')) {
            const currentLabel = link.getAttribute('aria-label') || link.textContent || ''
            link.setAttribute('aria-label', `${currentLabel} (新しいウィンドウで開きます)`)
          }
        }
        
        // 電話番号リンクの改善
        if (link.href.startsWith('tel:')) {
          if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', `電話をかける: ${link.textContent}`)
          }
        }
      })
    }

    // 見出し階層の確認
    const validateHeadingHierarchy = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let lastLevel = 0
      const issues: string[] = []

      headings.forEach((heading) => {
        const level = parseInt(heading.tagName[1])
        if (lastLevel > 0 && level > lastLevel + 1) {
          issues.push(`見出しレベルがスキップされています: h${lastLevel} → h${level}`)
        }
        lastLevel = level
      })

      if (issues.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('アクセシビリティ: 見出し階層の問題', issues)
      }
    }

    // フォームのアクセシビリティ改善
    const enhanceForms = () => {
      // ラベルのない入力フィールドにaria-labelを追加
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input) => {
        const htmlInput = input as HTMLInputElement
        if (!input.getAttribute('aria-label') && !input.id) {
          const placeholder = htmlInput.placeholder
          const name = htmlInput.name
          const type = htmlInput.type
          
          if (placeholder) {
            input.setAttribute('aria-label', placeholder)
          } else if (name) {
            input.setAttribute('aria-label', name.replace(/[-_]/g, ' '))
          } else if (type) {
            input.setAttribute('aria-label', `${type}入力`)
          }
        }
        
        // 必須フィールドのマーキング
        if (htmlInput.required && !input.getAttribute('aria-required')) {
          input.setAttribute('aria-required', 'true')
        }
      })
    }

    // スキップリンクの追加（まだ存在しない場合）
    const addSkipLink = () => {
      if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a')
        skipLink.href = '#main'
        skipLink.className = 'skip-link sr-only focus:not-sr-only'
        skipLink.textContent = 'メインコンテンツへスキップ'
        skipLink.style.cssText = `
          position: absolute;
          top: -40px;
          left: 0;
          background: #000;
          color: #fff;
          padding: 8px;
          z-index: 100;
          text-decoration: none;
        `
        skipLink.addEventListener('focus', () => {
          skipLink.style.top = '0'
        })
        skipLink.addEventListener('blur', () => {
          skipLink.style.top = '-40px'
        })
        
        document.body.insertBefore(skipLink, document.body.firstChild)
      }

      // main要素にidを追加
      const main = document.querySelector('main')
      if (main && !main.id) {
        main.id = 'main'
      }
    }

    // ランドマークロールの追加
    const addLandmarkRoles = () => {
      // ナビゲーション
      const nav = document.querySelector('nav')
      if (nav && !nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation')
      }

      // ヘッダー
      const header = document.querySelector('header')
      if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner')
      }

      // フッター
      const footer = document.querySelector('footer')
      if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo')
      }

      // メインコンテンツ
      const main = document.querySelector('main')
      if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main')
      }
    }

    // 言語属性の確認
    const checkLanguageAttributes = () => {
      const html = document.documentElement
      if (!html.lang) {
        html.lang = 'ja'
      }
    }

    // フォーカス可視性の改善
    const enhanceFocusVisibility = () => {
      // キーボードナビゲーション時のみフォーカスリングを表示
      document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse')
      })
      
      document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.remove('using-mouse')
        }
      })
    }

    // 実行
    enhanceImageAlt()
    enhanceInteractiveElements()
    validateHeadingHierarchy()
    enhanceForms()
    addSkipLink()
    addLandmarkRoles()
    checkLanguageAttributes()
    enhanceFocusVisibility()

    // MutationObserverで動的に追加される要素も処理
    const observer = new MutationObserver(() => {
      enhanceImageAlt()
      enhanceInteractiveElements()
      enhanceForms()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'alt', 'aria-label']
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // スタイルをheadに追加
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* フォーカススタイルの改善 */
      *:focus {
        outline: 2px solid #fb923c;
        outline-offset: 2px;
      }
      
      .using-mouse *:focus {
        outline: none;
      }
      
      /* スキップリンク用のスタイル */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }
      
      /* 高コントラストモード対応 */
      @media (prefers-contrast: high) {
        button, a {
          border: 1px solid currentColor;
        }
      }
      
      /* 動きを減らす設定への対応 */
      @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}