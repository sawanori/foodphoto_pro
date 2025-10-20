'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, MapPin, Clock, Camera, Sparkles, Users, ArrowRight, Star, Award, TrendingUp, Zap, Home, ChevronRight } from 'lucide-react'
import Script from 'next/script'
import { ProductSchema } from '@/components/StructuredData'

const plans = [
  {
    id: 'light',
    name: 'ライト',
    time: '1h',
    price: '¥33,000',
    features: [
      '時間内撮影枚数無制限（目安3–5）',
      '現像（色/明るさ調整）',
      '出張費（基本エリア込み）',
      '納品：最短1週間'
    ],
    image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2023.jpg',
    imageAlt: '単品料理の撮影例',
    popular: false,
    gradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'standard',
    name: 'スタンダード',
    time: '2h',
    price: '¥44,000',
    features: [
      '時間内無制限（目安10–20）',
      '標準レタッチ（軽微修整）',
      '間接照明持参',
      '出張費（基本エリア込み）',
      '納品：最短1週間'
    ],
    image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2024.jpg',
    imageAlt: '料理と内観の撮影例',
    popular: true,
    badge: '人気No.1',
    gradient: 'from-red-50 to-pink-50',
    borderColor: 'border-red-500',
    iconBg: 'bg-red-100',
    iconColor: 'text-orange-500'
  },
  {
    id: 'premium',
    name: 'プレミアム',
    time: '4h',
    price: '¥88,000',
    features: [
      '時間内無制限（目安20–40）',
      '標準レタッチ＋ディレクション',
      '間接照明持参',
      '出張費（基本エリア込み）',
      '納品：最短1週間'
    ],
    image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2022.jpg',
    imageAlt: 'コース料理と内観・外観の撮影例',
    popular: false,
    gradient: 'from-orange-50 to-red-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 'custom',
    name: '拡張プラン',
    subtitle: '（複数店舗/一括撮影）',
    time: 'カスタム',
    price: '要見積',
    features: [
      'ボリュームに応じて設計',
      '複数店舗一括割引',
      'カスタマイズ可能',
      '専任ディレクター'
    ],
    image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2021.jpg',
    imageAlt: '複数メニューのフラットレイ撮影例',
    popular: false,
    gradient: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-300',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  }
]

const options = [
  {
    name: 'ロケハン',
    price: '+¥11,000',
    desc: '事前に店舗を訪問し、撮影計画を立案（導線/光源/盛り付け順/背景を設計）',
    icon: MapPin,
    recommended: true
  },
  {
    name: '販促サイトページブラッシュアップ代行',
    price: '+¥100,000',
    desc: '食べログ・ぐるなび・ホットペッパー等の掲載ページ最適化（写真差し替え/説明文/掲載順/CTR導線）',
    icon: TrendingUp,
    recommended: true
  },
  {
    name: '延長（+30分）',
    price: '+¥8,800',
    desc: '撮影時間を30分延長',
    icon: Clock
  }
]

const faqs = [
  {
    q: 'ロケハンは必須ですか？',
    a: '必須ではありませんが、撮影効率と仕上がりの安定性が向上します。特に初回のお客様にはおすすめしています。'
  },
  {
    q: '何カットくらい撮れますか？',
    a: '被写体や演出有無で変動します。スタンダードプラン（2時間）では、料理10〜20カット、内観3〜5カット程度が目安です。'
  },
  {
    q: 'レタッチの範囲は？',
    a: '標準は色味/明るさ/軽微な汚れ修整まで。高度なレタッチ（合成、大幅な修正）はオプション対応です。'
  },
  {
    q: '納品形式は？',
    a: 'JPEG（sRGB）での納品が基本です。媒体別最適サイズの書き出しにも対応します。RAWデータの納品は別途ご相談ください。'
  },
  {
    q: '支払い方法は？',
    a: '請求書後払い、クレジットカード決済（VISA/Master/JCB/AMEX）に対応しています。'
  },
  {
    q: '撮影できない日はありますか？',
    a: '基本的に年中無休で対応していますが、年末年始やお盆期間は予約が混み合います。お早めにご相談ください。'
  },
  {
    q: '撮影時の服装や準備は？',
    a: 'スタッフの皆様は通常の制服で構いません。料理は撮影直前の盛り付けが理想ですが、当日ご相談しながら進めます。'
  }
]

const comparisonTable = {
  headers: ['プラン', '価格', '目安時間', '目安カット数', 'レタッチ', '照明', 'ディレクション', '出張費', '納品'],
  rows: [
    ['ライト', '¥33,000', '1h', '3–5', '現像', 'なし', 'なし', '○', '最短1週間'],
    ['スタンダード', '¥44,000', '2h', '時間内無制限（10–20）', '標準', '間接照明持参', 'あり（軽）', '○', '最短1週間'],
    ['プレミアム', '¥88,000', '4h', '時間内無制限（20–40）', '標準', '間接照明持参', 'あり', '○', '最短1週間'],
    ['拡張', '要見積', 'カスタム', 'カスタム', '相談', '相談', '相談', '相談', '相談']
  ]
}

const flowSteps = [
  { step: 1, title: 'お申込み', desc: 'フォームまたはお電話でご連絡', icon: '📝' },
  { step: 2, title: '事前ヒアリング', desc: '用途やメニューを確認', icon: '💬' },
  { step: 3, title: 'ロケハン（オプション）', desc: '撮影環境の事前確認', icon: '👀' },
  { step: 4, title: '撮影当日', desc: 'プロカメラマンが撮影', icon: '📸' },
  { step: 5, title: '納品', desc: '最短1週間でデータ納品', icon: '✨' },
  { step: 6, title: '媒体最適化（オプション）', desc: '各種媒体への掲載支援', icon: '🚀' }
]

export default function PricingClient() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://foodphoto-pro.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': '料金・プラン', 'item': 'https://foodphoto-pro.com/pricing' }
        ]
      },
      {
        '@type': 'Service',
        'name': '飲食店向け出張撮影',
        'provider': { '@type': 'Organization', 'name': 'FoodPhoto Pro' },
        'areaServed': ['東京都23区', '横浜市', '千葉（船橋）'],
        'offers': {
          '@type': 'OfferCatalog',
          'name': '撮影プランとオプション',
          'itemListElement': [
            { '@type': 'Offer', 'name': 'ライト（1h）', 'priceCurrency': 'JPY', 'price': '33000' },
            { '@type': 'Offer', 'name': 'スタンダード（2h）', 'priceCurrency': 'JPY', 'price': '44000' },
            { '@type': 'Offer', 'name': 'プレミアム（4h）', 'priceCurrency': 'JPY', 'price': '88000' },
            { '@type': 'Offer', 'name': 'ロケハン', 'priceCurrency': 'JPY', 'price': '11000' },
            { '@type': 'Offer', 'name': '販促ページ最適化代行', 'priceCurrency': 'JPY', 'price': '100000' }
          ]
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a
          }
        }))
      }
    ]
  }

  return (
    <>
      <Script
        id="pricing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Product Schema for each plan */}
      <ProductSchema 
        name="ライトプラン"
        description="1時間の飲食店撮影プラン。メニュー撮引20カットまで、基本レタッチ付き。"
        price={33000}
        image="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2019.jpg"
      />
      <ProductSchema 
        name="スタンダードプラン"
        description="2時間の飲食店撮影プラン。時間内撮影枚数無制限、基本レタッチ付き。"
        price={44000}
        image="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2019.jpg"
      />
      <ProductSchema 
        name="プレミアムプラン"
        description="4時間の飲食店撮影プラン。時間内撮影枚数無制限、間接照明持参、スタッフ撮影対応。"
        price={88000}
        image="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2019.jpg"
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <motion.ol 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 text-sm"
          >
            <li>
              <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                <span>ホーム</span>
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              <span className="text-gray-900 font-medium">料金・プラン</span>
            </li>
          </motion.ol>
        </div>
      </nav>

      {/* Hero Section with background image */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2019.jpg"
            alt="料理と店舗内観の撮影イメージ"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30"
            >
              <Sparkles className="h-4 w-4" />
              <span>飲食店専門の撮影サービス</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                料金・プラン
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg">
              メニュー・内観・外観まで、時間内無制限で撮影
              <br className="hidden sm:block" />
              最短1週間で納品いたします
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10"
          >
            {[
              { icon: Camera, text: '飲食店専門カメラマンが提案型で撮る' },
              { icon: Zap, text: '時間内無制限で必要カットを取り切る' },
              { icon: Award, text: '媒体別に使い回しやすいデータを納品' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-sm border border-white/20"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm text-white/90">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              id="cta-hero-primary"
              href="/form"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-medium text-lg"
            >
              申し込む
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/50 text-white rounded-full hover:bg-white/30 transition-all duration-300 font-medium text-lg"
            >
              問い合わせる
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Plan Cards with enhanced design */}
      <section className="relative py-20 lg:py-28 bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                撮影プラン
              </span>
            </h2>
            <p className="text-gray-600">お店の規模やニーズに合わせて選べる4つのプラン</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <motion.article 
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setSelectedPlan(plan.id)}
                onHoverEnd={() => setSelectedPlan(null)}
                className={`relative rounded-3xl bg-gradient-to-br ${plan.gradient} p-1 ${
                  plan.popular ? 'shadow-2xl scale-105' : 'shadow-lg'
                }`}
              >
                <div className="h-full bg-white rounded-3xl p-6">
                  {plan.badge && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute -top-3 -right-3 z-10"
                    >
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
                        {plan.badge}
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={plan.image}
                      alt={plan.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700"
                      style={{ transform: selectedPlan === plan.id ? 'scale(1.1)' : 'scale(1)' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                        {plan.subtitle && (
                          <span className="block text-sm font-normal text-gray-500 mt-1">
                            {plan.subtitle}
                          </span>
                        )}
                      </h3>
                      
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        <span className="text-sm text-gray-500">/ {plan.time}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full ${plan.iconBg} flex items-center justify-center mt-0.5`}>
                            <Check className={`h-3 w-3 ${plan.iconColor}`} />
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Link
                      href={`/contact?plan=${plan.id}&src=pricing`}
                      className={`cta-plan block text-center rounded-full py-3 px-6 font-medium transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-lg transform hover:scale-105' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                      data-plan-id={plan.id}
                    >
                      {plan.id === 'custom' ? '相談して見積もる' : 'このプランで見積もる'}
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm"
          >
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500">※</span>
                <span>価格は税込表記です。撮影時間は到着〜撤収を含みます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">※</span>
                <span>カット数は目安で被写体の難易度により変動します。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">※</span>
                <span>出張費込みエリア：東京23区・横浜市・千葉（船橋）など。詳細は下部「エリア・交通費」をご確認ください。</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Variations Gallery with enhanced design */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">撮影バリエーション</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              同じ料理でも添え物・角度・寄り引きで情報伝達が変わります
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
                添え物による印象の変化
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {['Before', 'After'].map((label, idx) => (
                  <motion.div 
                    key={label}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={`https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%20${20 + idx}.jpg`}
                        alt={`添え物${label === 'Before' ? '追加前' : '追加後'}の料理写真`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          label === 'Before' ? 'bg-gray-800' : 'bg-gradient-to-r from-orange-400 to-red-500'
                        }`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-300 to-orange-500 rounded-full"></div>
                角度とズームの違い
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {['俯瞰', '斜め45°', 'アイレベル'].map((angle, idx) => (
                  <motion.div 
                    key={angle}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className="relative"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={`https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%20${22 + idx}.jpg`}
                        alt={`${angle}撮影`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-medium">{angle}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Options with enhanced design */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">オプション</h2>
            <p className="text-gray-600">撮影をより効果的にするオプションサービス</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((option, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative"
              >
                <div className={`h-full bg-white rounded-2xl p-6 shadow-lg border ${
                  option.recommended ? 'border-red-200' : 'border-gray-100'
                }`}>
                  {option.recommended && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        おすすめ
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                        <option.icon className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{option.name}</h3>
                        <span className="text-xl font-bold text-orange-500 whitespace-nowrap ml-2">
                          {option.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{option.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow with enhanced design */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">撮影の流れ</h2>
            <p className="text-gray-600">お申し込みから納品まで、スムーズに対応いたします</p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {flowSteps.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="text-center">
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      className="inline-block"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                        {item.icon}
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-6 h-6 flex items-center justify-center">
                        {item.step}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  
                  {idx < flowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full">
                      <div className="flex items-center justify-center -ml-10">
                        <ArrowRight className="h-5 w-5 text-gray-300" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table with enhanced design */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">料金比較表</h2>
            <p className="text-gray-600">各プランの詳細な比較</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl shadow-xl bg-white"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    {comparisonTable.headers.map((header, idx) => (
                      <th key={idx} className="p-4 text-left font-bold text-gray-900 border-b-2 border-gray-200">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.rows.map((row, rowIdx) => (
                    <motion.tr 
                      key={rowIdx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: rowIdx * 0.1 }}
                      className={`${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50 transition-colors`}
                    >
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`p-4 border-b border-gray-100 ${
                          cellIdx === 0 ? 'font-bold text-gray-900' : 'text-gray-600'
                        }`}>
                          {cell}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ with enhanced design */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">よくある質問</h2>
            <p className="text-gray-600">お客様からよくいただくご質問をまとめました</p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Area Map with enhanced design */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">エリア・交通費</h2>
            <p className="text-gray-600">出張費込みエリアと対応地域</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">出張費込みエリア</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {['東京23区', '横浜市', '千葉（船橋）'].map((area) => (
                      <div key={area} className="bg-white rounded-xl px-4 py-2 text-center shadow-sm">
                        <span className="font-medium text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t-2 border-white/50 pt-6">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500">※</span>
                  <span>上記以外のエリアは実費または距離別で別途見積もりいたします。お気軽にご相談ください。</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cancel Policy with enhanced design */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">キャンセルポリシー</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl"
          >
            <div className="space-y-4">
              {[
                { timing: '当日', rate: '100％', color: 'from-orange-400 to-red-500' },
                { timing: '1営業日前', rate: '50％', color: 'from-orange-500 to-amber-500' },
                { timing: '2営業日前', rate: '20％', color: 'from-yellow-500 to-lime-500' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {item.rate}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.timing}</h3>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: item.rate }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ※荒天/交通障害など不可抗力時は都度協議いたします
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Works Teaser with enhanced design */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-1"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1"
                >
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      撮影サンプルを見る
                    </span>
                  </h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    実際の撮影事例をご覧いただけます。
                    料理の魅力を最大限に引き出す撮影技術をご確認ください。
                  </p>
                  <Link
                    href="/"
                    className="group inline-flex items-center text-orange-500 hover:text-orange-600 font-bold text-lg"
                  >
                    撮影実績を見る
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-3 gap-3"
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className="relative h-28 w-28 rounded-xl overflow-hidden shadow-lg"
                    >
                      <Image
                        src={`https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%20${19 + i}.jpg`}
                        alt={`撮影実績サンプル${i}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="112px"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA with enhanced design */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-pink-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            今すぐお見積もり
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            見積もりは3分で完了。希望日時とメニューをお知らせください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                id="cta-final-primary"
                href="/form"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white text-orange-500 rounded-full hover:shadow-2xl font-bold text-lg transition-all duration-300"
              >
                申し込む
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white/30 font-bold text-lg transition-all duration-300"
              >
                問い合わせる
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center gap-8"
          >
            {[
              { icon: Star, text: '満足度98%' },
              { icon: Award, text: '撮影実績1000件以上' },
              { icon: Clock, text: '最短1週間納品' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/80">
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky Mobile CTA Bar with enhanced design */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-400 to-red-500 p-4 md:hidden z-50 shadow-2xl"
      >
        <Link
          href="/form"
          className="block w-full text-center bg-white text-orange-500 py-4 rounded-full font-bold text-lg"
        >
          申し込む
        </Link>
      </motion.div>
    </>
  )
}