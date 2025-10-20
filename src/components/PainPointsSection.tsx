"use client";

import { motion } from "framer-motion";
import { AlertCircle, Camera, Zap, TrendingDown, Ban } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

type Item = {
  icon: React.ReactNode;
  title: string;
  highlight: string;
  impact: string;
  color: string;
};

const items: Item[] = [
  {
    icon: <AlertCircle aria-hidden className="w-6 h-6" />,
    title: "信頼できるカメラマンを依頼したくても、どこから依頼していいかわからない。",
    highlight: "探す時間",
    impact: "平均20時間のロス",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: <Camera aria-hidden className="w-6 h-6" />,
    title: "飲食媒体から派遣されるカメラマンのスキルが微妙",
    highlight: "集客力",
    impact: "30%向上の可能性",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <TrendingDown aria-hidden className="w-6 h-6" />,
    title: "予約や来店に繋がるアイデアがない",
    highlight: "競争力",
    impact: "差別化の決定打",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Zap aria-hidden className="w-6 h-6" />,
    title: "カメラマンに頼んでも撮るだけ撮って何も提案してくれない。",
    highlight: "提案力",
    impact: "売上直結のアドバイス",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Ban aria-hidden className="w-6 h-6" />,
    title: "ちょっとした皿の汚れなどを修正してくれない。",
    highlight: "完成度",
    impact: "100%の満足度",
    color: "from-amber-500 to-yellow-500"
  }
];

interface PainPointsSectionProps {
  onOpenChat?: () => void;
}

export default function PainPointsSection({ onOpenChat }: PainPointsSectionProps = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      
      {/* アニメーション背景パーティクル */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%"
            }}
            animate={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%"
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* セクションタイトル - 強烈なインパクト */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider uppercase">
              撮影の悩み、放置していませんか？
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500"
            >
              <span className="block md:hidden">こんな悩みや不満</span>
              <span className="block md:hidden">ありませんか？</span>
              <span className="hidden md:block">こんな悩みや不満ありませんか？</span>
            </motion.span>
          </h2>
          
        </motion.div>

        {/* お悩みカード - インパクト重視のデザイン */}
        <div className="grid gap-6 mb-16 max-w-3xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              {/* 背景グロウエフェクト */}
              <motion.div
                className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30 group-hover:opacity-75`}
                animate={{
                  opacity: hoveredIndex === index ? 0.75 : 0.3
                }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-500 transition-all duration-300">
                {/* 上部：アイコンとインパクト指標 */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}
                    animate={{
                      rotate: hoveredIndex === index ? 360 : 0,
                      scale: hoveredIndex === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-right"
                  >
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                      {item.highlight}
                    </div>
                    <div className={`text-base md:text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.impact}
                    </div>
                  </motion.div>
                </div>
                
                {/* メインコンテンツ */}
                <h3 className="text-white font-bold text-xl md:text-2xl leading-relaxed mb-3">
                  {item.title}
                </h3>
                
                {/* ホバー時のアクションプロンプト */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    height: hoveredIndex === index ? "auto" : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`text-base md:text-lg font-medium bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    → この問題を今すぐ解決する
                  </div>
                </motion.div>
                
                {/* プログレスバー風の装飾 */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: hoveredIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ originX: 0 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            実は<span className="text-white font-bold">80%以上の飲食店</span>が同じ悩みを抱えています。
            <br />
            もしかしたら、<span className="text-orange-400 font-bold">集客パフォーマンスに影響</span>しているかもしれません。
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              id="cta-painpoints-apply"
              href="https://foodphoto-pro.com/form"
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-red-500 hover:to-pink-500"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              申し込み
            </motion.a>
            
            <motion.button
              id="cta-painpoints-inquiry"
              onClick={onOpenChat}
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-chat-open
            >
              問い合わせる
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}