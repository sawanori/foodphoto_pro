import { notFound } from 'next/navigation'
import { getAreaData, getAreaList } from '@/data/area-data'
import AreaPageClient from './AreaPageClient'
import Script from 'next/script'
import type { Metadata } from 'next'

// 静的パラメータの生成
export async function generateStaticParams() {
  const areas = getAreaList()
  return areas.map((area) => ({
    area: area.id,
  }))
}

// メタデータの生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>
}): Promise<Metadata> {
  const { area } = await params
  const areaData = getAreaData(area)
  
  if (!areaData) {
    return {
      title: '404 - ページが見つかりません',
    }
  }

  const canonicalUrl = `https://foodphoto-pro.com/area/${areaData.id}`

  return {
    title: `${areaData.title} | 飲食店撮影PhotoStudio`,
    description: areaData.metaDescription,
    keywords: areaData.seoKeywords.join(', '),
    openGraph: {
      title: `${areaData.title} | 飲食店撮影PhotoStudio`,
      description: areaData.metaDescription,
      url: canonicalUrl,
      siteName: '飲食店撮影PhotoStudio',
      locale: 'ja_JP',
      type: 'website',
      images: [
        {
          url: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg',
          width: 1200,
          height: 630,
          alt: `${areaData.name}エリアの飲食店撮影サービス`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${areaData.title} | 飲食店撮影PhotoStudio`,
      description: areaData.metaDescription,
      images: ['https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

// 構造化データの生成
function generateStructuredData(areaData: any) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `https://foodphoto-pro.com/area/${areaData.id}#service`,
        name: areaData.title,
        description: areaData.description,
        provider: {
          '@type': 'Organization',
          name: '飲食店撮影PhotoStudio',
          url: 'https://foodphoto-pro.com',
        },
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: areaData.coordinates.latitude,
            longitude: areaData.coordinates.longitude,
          },
          geoRadius: `${areaData.serviceRadius}000`, // km to meters
        },
        serviceType: '飲食店撮影サービス',
      },
      {
        '@type': 'LocalBusiness',
        '@id': `https://foodphoto-pro.com/services/photo/foodphoto/area/${areaData.id}#localbusiness`,
        name: `飲食店撮影PhotoStudio ${areaData.name}`,
        description: areaData.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: areaData.name,
          addressRegion: areaData.name === '横浜' ? '神奈川県' : '東京都',
          addressCountry: 'JP',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: areaData.coordinates.latitude,
          longitude: areaData.coordinates.longitude,
        },
        url: `https://foodphoto-pro.com/area/${areaData.id}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: areaData.faqs.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: 'https://foodphoto-pro.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '飲食店撮影サービス',
            item: 'https://foodphoto-pro.com/services/photo/foodphoto',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${areaData.name}エリア`,
            item: `https://foodphoto-pro.com/services/photo/foodphoto/area/${areaData.id}`,
          },
        ],
      },
    ],
  }
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>
}) {
  const { area } = await params
  const areaData = getAreaData(area)

  if (!areaData) {
    notFound()
  }

  const structuredData = generateStructuredData(areaData)

  return (
    <>
      <Script
        id={`area-${areaData.id}-structured-data`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AreaPageClient areaData={areaData} />
    </>
  )
}