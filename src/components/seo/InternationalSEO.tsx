'use client'

import Head from 'next/head'
import { usePathname } from 'next/navigation'

export interface LanguageAlternate {
  hreflang: string
  href: string
  label: string
}

interface InternationalSEOProps {
  currentLocale?: string
  defaultLocale?: string
  alternates?: LanguageAlternate[]
  baseUrl?: string
}

export function InternationalSEO({
  currentLocale = 'ja',
  defaultLocale = 'ja',
  alternates = [],
  baseUrl = 'https://non-turn.com'
}: InternationalSEOProps) {
  const pathname = usePathname()

  // Default language alternates for Japanese business
  const defaultAlternates: LanguageAlternate[] = [
    {
      hreflang: 'ja',
      href: `${baseUrl}${pathname}`,
      label: '日本語'
    },
    {
      hreflang: 'ja-JP',
      href: `${baseUrl}${pathname}`,
      label: '日本語 (日本)'
    },
    {
      hreflang: 'en',
      href: `${baseUrl}/en${pathname}`,
      label: 'English'
    },
    {
      hreflang: 'en-US',
      href: `${baseUrl}/en${pathname}`,
      label: 'English (United States)'
    },
    {
      hreflang: 'zh',
      href: `${baseUrl}/zh${pathname}`,
      label: '中文'
    },
    {
      hreflang: 'zh-CN',
      href: `${baseUrl}/zh${pathname}`,
      label: '中文 (简体)'
    },
    {
      hreflang: 'ko',
      href: `${baseUrl}/ko${pathname}`,
      label: '한국어'
    },
    {
      hreflang: 'x-default',
      href: `${baseUrl}${pathname}`,
      label: 'Default'
    }
  ]

  const languageAlternates = alternates.length > 0 ? alternates : defaultAlternates

  return (
    <Head>
      {/* Hreflang tags */}
      {languageAlternates.map((alternate) => (
        <link
          key={alternate.hreflang}
          rel="alternate"
          hrefLang={alternate.hreflang}
          href={alternate.href}
        />
      ))}

      {/* Open Graph locale alternatives */}
      <meta property="og:locale" content={getOpenGraphLocale(currentLocale)} />
      {languageAlternates
        .filter(alt => alt.hreflang !== currentLocale && alt.hreflang !== 'x-default')
        .map((alternate) => (
          <meta
            key={`og-locale-${alternate.hreflang}`}
            property="og:locale:alternate"
            content={getOpenGraphLocale(alternate.hreflang)}
          />
        ))}

      {/* Language detection and geo-targeting */}
      <meta name="geo.region" content="JP-14" />
      <meta name="geo.placename" content="Yokohama, Kanagawa" />
      <meta name="geo.position" content="35.4657;139.6201" />
      <meta name="ICBM" content="35.4657, 139.6201" />
      
      {/* Language-specific content type */}
      <meta httpEquiv="content-language" content={currentLocale} />
      
      {/* Canonical with language parameter */}
      <link
        rel="canonical"
        href={`${baseUrl}${pathname}${currentLocale !== defaultLocale ? `?lang=${currentLocale}` : ''}`}
      />
    </Head>
  )
}

/**
 * Convert language code to Open Graph locale format
 */
function getOpenGraphLocale(languageCode: string): string {
  const localeMap: Record<string, string> = {
    'ja': 'ja_JP',
    'ja-JP': 'ja_JP',
    'en': 'en_US',
    'en-US': 'en_US',
    'zh': 'zh_CN',
    'zh-CN': 'zh_CN',
    'ko': 'ko_KR',
    'x-default': 'ja_JP'
  }

  return localeMap[languageCode] || 'ja_JP'
}

/**
 * Language switcher component
 */
interface LanguageSwitcherProps {
  currentLocale: string
  alternates: LanguageAlternate[]
  className?: string
}

export function LanguageSwitcher({
  currentLocale,
  alternates,
  className = ''
}: LanguageSwitcherProps) {
  if (alternates.length <= 1) return null

  return (
    <div className={`language-switcher ${className}`}>
      <label htmlFor="language-select" className="sr-only">
        言語を選択
      </label>
      <select
        id="language-select"
        value={currentLocale}
        onChange={(e) => {
          const selectedLang = e.target.value
          const targetAlternate = alternates.find(alt => alt.hreflang === selectedLang)
          if (targetAlternate) {
            window.location.href = targetAlternate.href
          }
        }}
        className="bg-transparent border border-yellow-400/30 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {alternates
          .filter(alt => alt.hreflang !== 'x-default')
          .map((alternate) => (
            <option
              key={alternate.hreflang}
              value={alternate.hreflang}
              className="bg-black text-white"
            >
              {alternate.label}
            </option>
          ))}
      </select>
    </div>
  )
}

/**
 * Generate structured data for international content
 */
export function generateInternationalStructuredData(
  content: Record<string, unknown>,
  alternates: LanguageAlternate[]
) {
  return {
    ...content,
    inLanguage: alternates
      .filter(alt => alt.hreflang !== 'x-default')
      .map(alt => ({
        '@type': 'Language',
        name: alt.label,
        alternateName: alt.hreflang
      })),
    translationOfWork: alternates
      .filter(alt => alt.hreflang !== 'x-default')
      .map(alt => ({
        '@type': 'CreativeWork',
        url: alt.href,
        inLanguage: alt.hreflang
      }))
  }
}

/**
 * Geographic and language targeting utilities
 */
export const geoTargeting = {
  japan: {
    country: 'JP',
    region: 'JP-14', // Kanagawa Prefecture
    city: 'Yokohama',
    coordinates: {
      latitude: 35.4657,
      longitude: 139.6201
    },
    timezone: 'Asia/Tokyo',
    currency: 'JPY',
    languages: ['ja', 'ja-JP']
  },
  
  global: {
    languages: ['ja', 'en', 'zh', 'ko'],
    primaryMarkets: ['JP', 'US', 'CN', 'KR'],
    serviceAreas: [
      'Japan',
      'Asia-Pacific',
      'Global'
    ]
  }
}

/**
 * Language detection and redirect utility
 */
export function detectUserLanguage(
  availableLanguages: string[] = ['ja', 'en'],
  defaultLanguage: string = 'ja'
): string {
  if (typeof window === 'undefined') return defaultLanguage

  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search)
  const langParam = urlParams.get('lang')
  if (langParam && availableLanguages.includes(langParam)) {
    return langParam
  }

  // Check localStorage
  const savedLang = localStorage.getItem('preferred-language')
  if (savedLang && availableLanguages.includes(savedLang)) {
    return savedLang
  }

  // Check browser language
  const browserLangs = navigator.languages || [navigator.language]
  for (const browserLang of browserLangs) {
    const lang = browserLang.split('-')[0]
    if (availableLanguages.includes(lang)) {
      return lang
    }
    if (availableLanguages.includes(browserLang)) {
      return browserLang
    }
  }

  return defaultLanguage
}

/**
 * Hook for international SEO management
 */
export function useInternationalSEO(
  baseUrl: string = 'https://non-turn.com',
  availableLanguages: string[] = ['ja', 'en']
) {
  const pathname = usePathname()
  const currentLocale = detectUserLanguage(availableLanguages)

  const generateAlternates = (): LanguageAlternate[] => {
    const alternates: LanguageAlternate[] = []

    // Add specific language variants
    availableLanguages.forEach(lang => {
      const langPath = lang === 'ja' ? pathname : `/${lang}${pathname}`
      alternates.push({
        hreflang: lang,
        href: `${baseUrl}${langPath}`,
        label: getLanguageLabel(lang)
      })

      // Add region-specific variants
      if (lang === 'ja') {
        alternates.push({
          hreflang: 'ja-JP',
          href: `${baseUrl}${langPath}`,
          label: '日本語 (日本)'
        })
      } else if (lang === 'en') {
        alternates.push({
          hreflang: 'en-US',
          href: `${baseUrl}${langPath}`,
          label: 'English (United States)'
        })
      }
    })

    // Add x-default
    alternates.push({
      hreflang: 'x-default',
      href: `${baseUrl}${pathname}`,
      label: 'Default'
    })

    return alternates
  }

  return {
    currentLocale,
    alternates: generateAlternates(),
    pathname,
    baseUrl
  }
}

function getLanguageLabel(langCode: string): string {
  const labels: Record<string, string> = {
    'ja': '日本語',
    'en': 'English',
    'zh': '中文',
    'ko': '한국어'
  }
  return labels[langCode] || langCode
}