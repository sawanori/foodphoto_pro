'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PricingCalculatorInputs, ServiceNavigation } from '@/types'
import { usePricingCalculator } from '@/hooks/usePricingCalculator'
import { GradientButton } from '@/components/ui/GradientButton'

interface PricingCalculatorProps {
  isOpen: boolean
  onClose: () => void
  serviceNav: ServiceNavigation[]
}

export function PricingCalculator({ isOpen, onClose, serviceNav }: PricingCalculatorProps) {
  const [selectedService, setSelectedService] = useState<ServiceNavigation['id']>('movie')
  const [calculatorInputs, setCalculatorInputs] = useState<PricingCalculatorInputs>({
    workingTime: 'fullDay',
    videoDuration: 'under5',
    locations: 1,
    locationScouting: false,
    cameraCount: 1,
    lighting: false,
    audio: false,
    editing: 'basic',
    rush: false
  })

  const { estimatedPrice } = usePricingCalculator(selectedService, calculatorInputs)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-emerald-400/30 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              ✕
            </button>

            <div className="overflow-y-auto max-h-[85vh] p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-6">料金シミュレーター</h3>
              
              <div className="space-y-4 md:space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">サービス選択</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {serviceNav.map((service) => (
                      <motion.button
                        key={service.id}
                        className={`p-3 rounded-lg text-center transition-all duration-300 ${
                          selectedService === service.id
                            ? 'bg-emerald-400 text-black font-semibold'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="text-xl sm:text-2xl mb-1">{service.icon}</div>
                        <div className="text-xs sm:text-sm">{service.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {selectedService === 'movie' && (
                  <>
                    {/* Working Time */}
                    <div>
                      <label className="block text-white font-medium mb-3">拘束時間（準備撤収含む）</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'halfDay', label: '半日(6H)', desc: '基本プラン' },
                          { value: 'fullDay', label: '1Day(10H)', desc: '標準プラン' },
                          { value: 'multiDay', label: '複数日', desc: '大規模プロジェクト' }
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-3 rounded-lg transition-all duration-300 text-center ${
                              calculatorInputs.workingTime === option.value
                                ? 'bg-emerald-400 text-black font-semibold'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCalculatorInputs(prev => ({...prev, workingTime: option.value as PricingCalculatorInputs['workingTime']}))}
                          >
                            <div className="font-medium text-sm sm:text-base">{option.label}</div>
                            <div className="text-xs opacity-80">{option.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Video Duration */}
                    <div>
                      <label className="block text-white font-medium mb-3">動画時間</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'under5', label: '5分以下', desc: '標準料金' },
                          { value: 'over5', label: '5分以上', desc: '+30%' }
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-3 rounded-lg transition-all duration-300 text-center ${
                              calculatorInputs.videoDuration === option.value
                                ? 'bg-emerald-400 text-black font-semibold'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCalculatorInputs(prev => ({...prev, videoDuration: option.value as PricingCalculatorInputs['videoDuration']}))}
                          >
                            <div className="font-medium text-sm sm:text-base">{option.label}</div>
                            <div className="text-xs opacity-80">{option.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Location Scouting */}
                    <div>
                      <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <span className="text-white font-medium">ロケハン</span>
                          <div className="text-xs text-gray-400">事前下見・場所確認</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={calculatorInputs.locationScouting}
                          onChange={(e) => setCalculatorInputs(prev => ({...prev, locationScouting: e.target.checked}))}
                          className="scale-125"
                        />
                      </label>
                      {calculatorInputs.locationScouting && (
                        <div className="text-sm text-emerald-400 mt-2">+¥55,000</div>
                      )}
                    </div>

                    {/* Camera Count */}
                    <div>
                      <label className="block text-white font-medium mb-3">カメラ台数</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 1, label: '1台', desc: '基本' },
                          { value: 2, label: '2台', desc: '+¥50,000' },
                          { value: 3, label: '3台以上', desc: '+¥100,000' }
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            className={`p-3 rounded-lg transition-all duration-300 text-center ${
                              calculatorInputs.cameraCount === option.value
                                ? 'bg-emerald-400 text-black font-semibold'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCalculatorInputs(prev => ({...prev, cameraCount: option.value}))}
                          >
                            <div className="font-medium text-sm sm:text-base">{option.label}</div>
                            <div className="text-xs opacity-80">{option.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Lighting */}
                    <div>
                      <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <span className="text-white font-medium">照明機材</span>
                          <div className="text-xs text-gray-400">プロ照明セット</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={calculatorInputs.lighting}
                          onChange={(e) => setCalculatorInputs(prev => ({...prev, lighting: e.target.checked}))}
                          className="scale-125"
                        />
                      </label>
                      {calculatorInputs.lighting && (
                        <div className="text-sm text-emerald-400 mt-2">+¥30,000</div>
                      )}
                    </div>

                    {/* Audio */}
                    <div>
                      <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <span className="text-white font-medium">音声収録</span>
                          <div className="text-xs text-gray-400">インタビュー・ナレーション</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={calculatorInputs.audio}
                          onChange={(e) => setCalculatorInputs(prev => ({...prev, audio: e.target.checked}))}
                          className="scale-125"
                        />
                      </label>
                      {calculatorInputs.audio && (
                        <div className="text-sm text-emerald-400 mt-2">+¥20,000</div>
                      )}
                    </div>

                    {/* Editing Level */}
                    <div>
                      <label className="block text-white font-medium mb-3">編集レベル</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['basic', 'advanced'].map((level) => (
                          <motion.button
                            key={level}
                            className={`p-3 rounded-lg transition-all duration-300 text-center ${
                              calculatorInputs.editing === level
                                ? 'bg-emerald-400 text-black font-semibold'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCalculatorInputs(prev => ({...prev, editing: level as PricingCalculatorInputs['editing']}))}
                          >
                            <div className="font-medium text-sm sm:text-base">
                              {level === 'basic' ? 'ベーシック' : 'アドバンス'}
                            </div>
                            <div className="text-xs opacity-80">
                              {level === 'basic' 
                                ? 'カット編集・基本効果' 
                                : '3D・モーショングラフィックス'
                              }
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Rush Option */}
                    <div>
                      <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <span className="text-white font-medium">お急ぎ対応</span>
                          <div className="text-xs text-gray-400">通常期間の半分で納品</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={calculatorInputs.rush}
                          onChange={(e) => setCalculatorInputs(prev => ({...prev, rush: e.target.checked}))}
                          className="scale-125"
                        />
                      </label>
                      {calculatorInputs.rush && (
                        <div className="text-sm text-emerald-400 mt-2">+30%</div>
                      )}
                    </div>
                  </>
                )}

                {/* Estimated Price */}
                <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-sm text-gray-400 mb-2">概算料金</div>
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400"
                    key={estimatedPrice}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ¥{estimatedPrice.toLocaleString()}〜
                  </motion.div>
                  <div className="text-sm text-gray-400 mt-2">※詳細はお見積もりにて</div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/contact" className="flex-1">
                  <GradientButton variant="secondary" fullWidth>
                    正式見積もり依頼
                  </GradientButton>
                </Link>
                <GradientButton variant="outline" onClick={onClose}>
                  閉じる
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}