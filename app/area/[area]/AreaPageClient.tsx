'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { AreaData } from '@/data/area-data'
import { Check, Star, Clock, Camera, Award, Users, TrendingUp, MapPin, Phone, Mail, ChevronRight, Sparkles } from 'lucide-react'

interface AreaPageClientProps {
  areaData: AreaData
}

export default function AreaPageClient({ areaData }: AreaPageClientProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* パンくずリスト */}
      <Breadcrumb 
        items={[
          { label: '飲食店撮影PhotoStudio', href: '/services/photo/foodphoto' },
          { label: `${areaData.name}エリア` }
        ]}
      />

      {/* ヒーローセクション - 大幅改善 */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* 背景画像 */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <Image
            src={areaData.images.hero}
            alt={`${areaData.name}エリアのプロフェッショナルな料理撮影`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </motion.div>

        {/* コンテンツ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* バッジ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-100 text-sm font-medium">
                {areaData.name}エリア実績No.1
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {areaData.name}の
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                飲食店撮影専門
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              {areaData.description}
            </p>

            {/* 実績バッジ */}
            <div className="flex flex-wrap gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/20"
              >
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">
                  撮影実績 {areaData.shootingStats.totalShops}店舗
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/20"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">満足度 98%</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/20"
              >
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">
                  半径{areaData.serviceRadius}km対応
                </span>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  id="cta-area-hero-apply"
                  href="/services/photo/foodphoto/form"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all"
                >
                  申し込む
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/services/photo/foodphoto/contact"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  問い合わせる
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* スクロールインジケーター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* なぜ選ばれるのか - 改善版 */}
      <section className="py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-500 font-bold text-sm uppercase tracking-wider mb-4"
              >
                Why Choose Us
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {areaData.name}エリアで
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  選ばれる理由
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                地域の特性を熟知したプロカメラマンが、お店の魅力を最大限に引き出します
              </p>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              {[
                { icon: Camera, title: '専門性', desc: areaData.features[0], color: 'from-blue-500 to-blue-600' },
                { icon: TrendingUp, title: '実績', desc: areaData.features[1], color: 'from-green-500 to-green-600' },
                { icon: Clock, title: 'スピード', desc: areaData.features[2] || '最短翌日納品', color: 'from-purple-500 to-purple-600' },
                { icon: Star, title: '品質', desc: areaData.features[3] || 'プロ品質保証', color: 'from-orange-500 to-orange-600' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* グラデーション背景 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  
                  {/* アイコン */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} mb-6`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  
                  {/* ホバー時のアクセント */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ポートフォリオギャラリー - 新規追加 */}
      <section id="portfolio" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-500 font-bold text-sm uppercase tracking-wider mb-4"
              >
                Portfolio
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {areaData.name}エリアの
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  撮影実績
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                実際にお撮りした料理写真の一部をご紹介します
              </p>
            </div>

            {/* 統計カード - リデザイン */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-2xl text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-5xl font-black mb-2">
                    {areaData.shootingStats.totalShops}
                  </div>
                  <p className="text-orange-100 font-medium">撮影実績店舗</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-3xl font-black mb-2">98%</div>
                  <p className="text-purple-100 font-medium">顧客満足度</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-2xl font-black mb-2">
                    {areaData.shootingStats.popularPlan}
                  </div>
                  <p className="text-blue-100 font-medium">人気No.1プラン</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-2xl font-black mb-2">
                    {areaData.shootingStats.bestTime}
                  </div>
                  <p className="text-green-100 font-medium">推奨撮影時間</p>
                </div>
              </motion.div>
            </div>

            {/* フォトギャラリー */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {areaData.images.gallery.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <Image
                    src={src}
                    alt={`${areaData.name}エリアの料理撮影例${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold">プロ撮影</p>
                      <p className="text-sm opacity-90">{areaData.name}エリア</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 人気ジャンル */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                {areaData.name}で人気の撮影ジャンル
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {areaData.popularCuisines.map((cuisine, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-5 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    {cuisine}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 料金プラン - 新規追加 */}
      <section className="py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-500 font-bold text-sm uppercase tracking-wider mb-4"
              >
                Pricing
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                明確な
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  料金プラン
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {areaData.name}エリアの撮影ニーズに合わせた3つのプランをご用意
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'ライトプラン',
                  originalPrice: '44,000',
                  price: '33,000',
                  description: '短時間でサクッと撮影',
                  features: [
                    '撮影時間 1時間',
                    '3〜5カット撮影',
                    '即日データ納品',
                    '商用利用可能',
                    '基本レタッチ込み',
                  ],
                  badge: null,
                  color: 'from-gray-50 to-gray-100',
                  buttonColor: 'bg-gray-600 hover:bg-gray-700',
                },
                {
                  name: 'スタンダードプラン',
                  originalPrice: '55,000',
                  price: '44,000',
                  description: 'メニュー・Web用の本格撮影',
                  features: [
                    '撮影時間 2時間',
                    '時間内撮り放題',
                    '10〜15カット程度',
                    '即日データ納品',
                    '商用利用可能',
                    '標準レタッチ込み',
                  ],
                  badge: '人気No.1',
                  color: 'from-orange-50 to-orange-100',
                  buttonColor: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
                },
                {
                  name: 'プレミアムプラン',
                  originalPrice: '99,000',
                  price: '88,000',
                  description: '広告・ブランディング撮影',
                  features: [
                    '撮影時間 4時間',
                    '時間内撮り放題',
                    '30〜40カット程度',
                    '即日データ納品',
                    '商用利用可能',
                    '標準レタッチ込み',
                    '撮影ディレクション付き',
                  ],
                  badge: 'おすすめ',
                  color: 'from-purple-50 to-purple-100',
                  buttonColor: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br ${plan.color} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    plan.badge === '人気No.1' ? 'ring-2 ring-orange-500 transform scale-105' : ''
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    {plan.originalPrice && (
                      <div className="mb-2">
                        <span className="text-xl text-gray-400 line-through">¥{plan.originalPrice}</span>
                        <span className="ml-2 text-sm text-red-500 font-bold">キャンペーン価格</span>
                      </div>
                    )}
                    <span className="text-4xl font-black text-orange-600">¥{plan.price}</span>
                    <span className="text-gray-500 ml-2">/ 回</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/services/photo/foodphoto/form"
                    className={`block text-center py-3 px-6 rounded-full font-bold text-white transition-all ${plan.buttonColor}`}
                  >
                    申し込む
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="bg-orange-50 rounded-xl p-6 max-w-2xl mx-auto">
                <p className="text-orange-600 font-bold mb-2">🎉 全プラン共通特典</p>
                <p className="text-gray-700 text-sm">
                  東京23区・横浜市・千葉（船橋）エリア内は出張費無料！<br />
                  商用利用可能・即日データ納品
                </p>
              </div>
              <Link
                href="/services/photo/foodphoto/contact"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold mt-6"
              >
                問い合わせる
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 成功事例・お客様の声 - 改善版 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-500 font-bold text-sm uppercase tracking-wider mb-4"
              >
                Success Stories
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {areaData.name}エリアの
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  成功事例
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                実際にご利用いただいたお客様の声をご紹介
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {areaData.cases.map((caseItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* 画像エリア */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-500">
                    <Image
                      src={`https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%20${index + 1}.jpg`}
                      alt={`${caseItem.shopType}の成功事例`}
                      fill
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 text-white">
                      <h3 className="text-xl font-bold">{caseItem.shopType}</h3>
                      <p className="text-sm opacity-90">{caseItem.area}</p>
                    </div>
                  </div>

                  {/* コンテンツエリア */}
                  <div className="p-6">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                      <TrendingUp className="w-4 h-4" />
                      {caseItem.result}
                    </div>
                    
                    <blockquote className="text-gray-700 leading-relaxed mb-4">
                      「{caseItem.comment}」
                    </blockquote>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 追加の信頼性指標 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl p-8 text-white text-center"
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-black mb-2">98%</div>
                  <p className="text-orange-100">顧客満足度</p>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">85%</div>
                  <p className="text-orange-100">リピート率</p>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">120%</div>
                  <p className="text-orange-100">平均売上向上率</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* エリア情報セクション - 改善版 */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {areaData.name}エリアの対応範囲
          </h2>
          
          {/* 他のエリアへのリンク */}
          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-4">他のエリアもご覧ください：</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {areaData.id !== 'shibuya' && (
                <Link href="/services/photo/foodphoto/area/shibuya" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  渋谷エリア
                </Link>
              )}
              {areaData.id !== 'shinjuku' && (
                <Link href="/services/photo/foodphoto/area/shinjuku" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  新宿エリア
                </Link>
              )}
              {areaData.id !== 'yokohama' && (
                <Link href="/services/photo/foodphoto/area/yokohama" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  横浜エリア
                </Link>
              )}
              {areaData.id !== 'ikebukuro' && (
                <Link href="/services/photo/foodphoto/area/ikebukuro" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  池袋エリア
                </Link>
              )}
              {areaData.id !== 'shinagawa' && (
                <Link href="/services/photo/foodphoto/area/shinagawa" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  品川エリア
                </Link>
              )}
              {areaData.id !== 'ginza' && (
                <Link href="/services/photo/foodphoto/area/ginza" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  銀座エリア
                </Link>
              )}
              {areaData.id !== 'roppongi' && (
                <Link href="/services/photo/foodphoto/area/roppongi" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  六本木エリア
                </Link>
              )}
              <Link href="/services/photo/foodphoto" className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition-colors">
                全エリア対応サービス
              </Link>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 対応エリア */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">📍 対応エリア</h3>
              <div className="space-y-2">
                {areaData.coveredAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* アクセス情報 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">🚃 最寄り駅</h3>
              <div className="space-y-2">
                {areaData.nearbyStations.map((station, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-blue-500">🚉</span>
                    <span>{station}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ローカル情報 */}
          <div className="mt-8 bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">ℹ️ {areaData.name}エリアの撮影について</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">アクセス</h4>
                <p className="text-gray-600">{areaData.localInfo.access}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">駐車場</h4>
                <p className="text-gray-600">{areaData.localInfo.parking}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">特記事項</h4>
                <p className="text-gray-600">{areaData.localInfo.specialNotes}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {areaData.name}エリアのよくある質問
          </h2>
          <p className="text-center text-gray-600 mb-12">
            <Link href="/services/photo/foodphoto#faq" className="text-orange-500 hover:text-orange-600 font-medium">
              全般的なFAQ
            </Link>
            もご覧ください
          </p>
          <div className="space-y-4">
            {areaData.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                  <span className={`text-2xl transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ⌄
                  </span>
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 最終CTAセクション - 大幅改善 */}
      <section className="relative py-32 overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400" />
        
        {/* パターン */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* メインコピー */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
            >
              {areaData.name}エリアの
              <span className="block mt-2">
                飲食店撮影なら
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              地域の特性を熟知したプロカメラマンが
              <br className="hidden md:block" />
              お店の魅力を最大限に引き出します
            </motion.p>

            {/* 特典バッジ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                <Clock className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-bold">最短翌日撮影可能</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-bold">満足保証付き</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                <Camera className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-bold">プロカメラマン撮影</span>
              </div>
            </motion.div>

            {/* CTAボタン */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  id="cta-area-bottom-apply"
                  href="/services/photo/foodphoto/form"
                  className="group inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
                >
                  申し込む
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/services/photo/foodphoto/contact"
                  className="group inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all"
                >
                  <Phone className="w-6 h-6" />
                  問い合わせる
                </Link>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  )
}