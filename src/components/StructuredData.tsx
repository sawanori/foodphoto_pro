import Script from 'next/script'

interface LocalBusinessProps {
  name?: string
  description?: string
  url?: string
  telephone?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
  priceRange?: string
  image?: string[]
  openingHours?: string[]
}

export function LocalBusinessSchema({
  name = '飲食店撮影PhotoStudio',
  description = '東京・横浜の飲食店専門撮影サービス。プロカメラマンが料理・店舗の魅力を最大限に引き出します。',
  url = 'https://foodphoto-pro.com',
  telephone = '',
  address = {
    addressLocality: '渋谷区',
    addressRegion: '東京都',
    postalCode: '',
    addressCountry: 'JP'
  },
  geo = {
    latitude: 35.6580,
    longitude: 139.7016
  },
  aggregateRating = {
    ratingValue: 4.8,
    reviewCount: 50
  },
  priceRange = '¥¥',
  image = [
    'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg'
  ],
  openingHours = ['Mo-Fr 09:00-21:00', 'Sa-Su 10:00-20:00']
}: LocalBusinessProps = {}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#business`,
    name,
    description,
    url,
    telephone,
    address: {
      '@type': 'PostalAddress',
      ...address
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...geo
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ...aggregateRating
    },
    priceRange,
    image,
    openingHoursSpecification: openingHours.map(hours => {
      const [days, time] = hours.split(' ')
      const [open, close] = time.split('-')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split('-').map(d => {
          const dayMap: Record<string, string> = {
            'Mo': 'Monday', 'Tu': 'Tuesday', 'We': 'Wednesday',
            'Th': 'Thursday', 'Fr': 'Friday', 'Sa': 'Saturday', 'Su': 'Sunday'
          }
          return dayMap[d] || d
        }),
        opens: open,
        closes: close
      }
    })
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description: string
  price: number
  priceCurrency?: string
  image?: string
  brand?: string
  offers?: {
    availability?: string
    priceValidUntil?: string
  }
}

export function ProductSchema({
  name,
  description,
  price,
  priceCurrency = 'JPY',
  image,
  brand = '飲食店撮影PhotoStudio',
  offers = {
    availability: 'https://schema.org/InStock',
    priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  }
}: ProductSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: offers.availability,
      priceValidUntil: offers.priceValidUntil,
      url: 'https://foodphoto-pro.com/pricing'
    }
  }

  return (
    <Script
      id={`product-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: Array<{
    name: string
    text: string
    image?: string
  }>
  totalTime?: string
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime = 'PT1H'
}: HowToSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image
    }))
  }

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface AggregateRatingSchemaProps {
  itemReviewed: {
    type: string
    name: string
  }
  ratingValue: number
  bestRating?: number
  worstRating?: number
  ratingCount: number
  reviewCount?: number
}

export function AggregateRatingSchema({
  itemReviewed,
  ratingValue,
  bestRating = 5,
  worstRating = 1,
  ratingCount,
  reviewCount
}: AggregateRatingSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': itemReviewed.type,
      name: itemReviewed.name
    },
    ratingValue,
    bestRating,
    worstRating,
    ratingCount,
    reviewCount: reviewCount || ratingCount
  }

  return (
    <Script
      id="aggregate-rating-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}