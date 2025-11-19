// Structured Data for foodphoto-pro.com
// Schema.org JSON-LD implementation for SEO

import { generateVoiceSearchSchema, generateSpeakableSchema } from './voice-search-faq'
import { generateReviewSchema, generateIndividualReviewSchema } from '@/data/foodphoto-reviews'

export const getStructuredData = () => {
  const domain = 'https://foodphoto-pro.com'
  
  // 1. LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${domain}#organization`,
    name: '飲食店撮影PhotoStudio',
    alternateName: 'NonTurn合同会社',
    url: domain,
    logo: `${domain}/logo.png`,
    image: [
      'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg',
      'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2021.jpg',
      'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2022.jpg'
    ],
    description: 'プロカメラマンによる飲食店専門の料理・店舗撮影サービス。メニュー撮影、店内撮影、フードフォトなど、飲食店の集客に特化した出張撮影を提供。東京・横浜エリア対応。',
    email: 'info@non-turn.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '東久留米市前沢',
      addressLocality: '東久留米市',
      addressRegion: '東京都',
      postalCode: '203-0032',
      addressCountry: 'JP'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.7520,
      longitude: 139.5267
    },
    areaServed: [
      {
        '@type': 'City',
        name: '東京都23区'
      },
      {
        '@type': 'City',
        name: '横浜市'
      },
      {
        '@type': 'City',
        name: '船橋市'
      }
    ],
    priceRange: '¥33,000-¥88,000',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '18:00'
      }
    ],
    sameAs: [
      'https://www.instagram.com/nonturn_llc/',
      'https://non-turn.com'
    ]
  }

  // 2. Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: '飲食店撮影サービス',
    provider: {
      '@id': `${domain}#organization`
    },
    name: '飲食店専門出張撮影サービス',
    description: '飲食店のメニュー撮影、料理撮影、店内撮影を専門とする出張撮影サービス。プロカメラマンが貴店まで伺い、集客力のある写真を撮影します。',
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 35.6762,
        longitude: 139.6503
      },
      geoRadius: '50000'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '撮影プラン',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ライトプラン',
            description: '1時間の撮影、3-5カット納品'
          },
          price: '33000',
          priceCurrency: 'JPY'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'スタンダードプラン',
            description: '2時間の撮影、10-15カット納品'
          },
          price: '44000',
          priceCurrency: 'JPY'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'プレミアムプラン',
            description: '4時間の撮影、30-40カット納品'
          },
          price: '88000',
          priceCurrency: 'JPY'
        }
      ]
    }
  }

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '撮影にはどのくらい時間がかかりますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'プランにより異なりますが、ライトプラン1時間、スタンダードプラン2時間、プレミアムプラン4時間となっています。準備や片付けの時間も含まれています。'
        }
      },
      {
        '@type': 'Question',
        name: '撮影データはいつもらえますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '基本的には撮影後3営業日以内にオンラインでダウンロードリンクをお送りします。お急ぎの場合は即日納品も可能です（要事前相談）。'
        }
      },
      {
        '@type': 'Question',
        name: '撮影場所に制限はありますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '東京23区内、横浜市内、千葉県船橋市は出張費込みです。その他の地域も対応可能ですが、別途出張費をいただく場合があります。'
        }
      },
      {
        '@type': 'Question',
        name: 'キャンセルは可能ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '撮影日の3日前までは無料でキャンセル可能です。2日前〜前日は料金の50%、当日は100%のキャンセル料が発生します。'
        }
      },
      {
        '@type': 'Question',
        name: '撮影した写真の著作権はどうなりますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '撮影した写真の著作権は譲渡され、お客様のものとなります。商用利用も自由に行っていただけます。'
        }
      },
      {
        '@type': 'Question',
        name: '料理以外も撮影してもらえますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい、店内の雰囲気、外観、スタッフの方々など、飲食店に関わる撮影全般に対応しています。'
        }
      },
      {
        '@type': 'Question',
        name: '撮影の事前準備は必要ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '特別な準備は不要ですが、撮影したい料理や場所を事前にリストアップいただけるとスムーズです。撮影当日は通常営業中でも対応可能です。'
        }
      },
      {
        '@type': 'Question',
        name: '支払い方法は何がありますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '銀行振込、クレジットカード決済に対応しています。撮影後、請求書を発行させていただきます。'
        }
      }
    ]
  }

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: domain
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '飲食店撮影サービス',
        item: `${domain}/`
      }
    ]
  }

  // 5. WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: domain,
    name: '飲食店撮影PhotoStudio',
    description: 'プロカメラマンによる飲食店専門の出張撮影サービス',
    publisher: {
      '@id': `${domain}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${domain}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // 6. ImageObject Schema for portfolio
  const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: '飲食店撮影ポートフォリオ',
    description: '飲食店撮影PhotoStudioの撮影実績',
    image: [
      {
        '@type': 'ImageObject',
        contentUrl: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%209.jpg',
        name: '料理撮影例1',
        description: '飲食店の料理撮影サンプル'
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%206.jpg',
        name: '料理撮影例2',
        description: 'メニュー用料理写真'
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%205.jpg',
        name: '料理撮影例3',
        description: 'プロによる料理撮影'
      }
    ]
  }

  // 7. Special Offer Schema (November Campaign)
  const specialOfferSchema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: '11月撮影特典キャンペーン',
    description: '飲食店サイトのTOP画像やサムネイルで使用しやすい編集画像を1枚無料プレゼント',
    url: domain,
    priceCurrency: 'JPY',
    price: '0',
    priceValidUntil: '2024-11-30',
    itemCondition: 'https://schema.org/NewCondition',
    availability: 'https://schema.org/InStock',
    seller: {
      '@id': `${domain}#organization`
    },
    validFrom: '2024-11-01',
    validThrough: '2024-11-30',
    eligibleCustomerType: 'Business',
    eligibleTransactionVolume: {
      '@type': 'PriceSpecification',
      price: '44000',
      priceCurrency: 'JPY',
      name: 'スタンダードプラン以上'
    }
  }

  // 8. Voice Search FAQs Schema
  const voiceSearchSchema = generateVoiceSearchSchema()
  
  // 9. Speakable Schema for voice assistants
  const speakableSchema = generateSpeakableSchema()

  // 10. AggregateRating Schema for reviews
  const aggregateRatingSchema = generateReviewSchema()

  // 11. Individual Review Schemas
  const individualReviewSchemas = generateIndividualReviewSchema()

  return [
    localBusinessSchema,
    serviceSchema,
    faqSchema,
    breadcrumbSchema,
    websiteSchema,
    imageObjectSchema,
    specialOfferSchema,
    voiceSearchSchema,
    speakableSchema,
    aggregateRatingSchema,
    ...individualReviewSchemas
  ]
}

// Generate all structured data as a single Graph
export const getAllStructuredData = () => {
  const structuredDataArray = getStructuredData()
  
  return {
    '@context': 'https://schema.org',
    '@graph': structuredDataArray
  }
}