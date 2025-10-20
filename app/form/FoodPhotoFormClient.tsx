'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { formSchema, ORDER_TYPES, calcTotalJPY } from '@/lib/foodOrderSchema'
import type { FoodOrder } from '@/lib/foodOrderSchema'
import { LiveRegionAnnouncer, enhanceFormAccessibility } from '../accessibility'

// Prefecture list
const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

// Store prefecture list (limited to service area)
const STORE_PREFECTURES = [
  '東京都', '神奈川県', '千葉県'
]

export function FoodPhotoFormClient() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [backHref, setBackHref] = useState('/')
  const formRef = useRef<HTMLFormElement>(null)
  const announcerRef = useRef<LiveRegionAnnouncer | null>(null)

  // Initialize accessibility features
  useEffect(() => {
    announcerRef.current = new LiveRegionAnnouncer()
    if (formRef.current) {
      enhanceFormAccessibility(formRef.current)
    }

    // Detect domain and set appropriate back link
    const isFoodPhotoDomain = window.location.hostname.includes('foodphoto-pro.com')
    setBackHref(isFoodPhotoDomain ? '/' : '/')
  }, [])
  
  // Announce errors to screen readers
  useEffect(() => {
    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0 && announcerRef.current) {
      announcerRef.current.announce(
        `フォームに${errorCount}個のエラーがあります。修正してください。`,
        'assertive'
      )
    }
  }, [validationErrors])
  
  // Form state
  const [formData, setFormData] = useState<Partial<FoodOrder>>({
    plan: 'standard',
    extraMinutes: '0',
    billingTo: 'store',
    billingName: '', // Initialize billingName
    store: {
      name: '',
      address: { postal: '', prefecture: '', city: '', address1: '' },
      phone: '',
      managerName: '',
      managerKana: '',
      coordinator: 'storeManager',
      attendees: ['storeManager'],
      email: ''
    },
    cuts: { food: 0, interior: 0, exterior: 0, people: 0 },
    media: {},
    agree: false
  })

  // Calculate total price
  const { total, breakdown } = calcTotalJPY(formData as FoodOrder)

  // Handle form field updates
  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.')
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user agreed to terms first
    if (!formData.agree) {
      setSubmitResult({
        success: false,
        message: '利用規約への同意が必要です'
      })
      return
    }
    
    // Validate form
    try {
      const validatedData = formSchema.parse(formData)
      
      setIsSubmitting(true)
      setSubmitResult(null)
      
      const response = await fetch('/api/foodphoto-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      })
      
      const result = await response.json()
      
      if (result.ok) {
        setSubmitResult({ success: true, message: 'お申し込みを受け付けました。確認メールをお送りしました。' })
        // Keep button disabled after success
        // Don't set isSubmitting to false on success
        // Redirect to thank you page
        setTimeout(() => {
          // For foodphoto-pro.com domain, use short path
          const thankYouUrl = window.location.hostname.includes('foodphoto-pro.com')
            ? '/form/thank-you'
            : '/form/thank-you'
          window.location.href = thankYouUrl
        }, 1000)
        // Important: Don't set isSubmitting to false here, leave it true
        return
      } else {
        setSubmitResult({ success: false, message: result.message || '送信に失敗しました' })
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error('Submission error:', error)
      console.error('Form data at submission:', formData)
      
      // Check if it's a network error (CORS, fetch failed, etc)
      if (error.message && error.message.includes('fetch')) {
        setSubmitResult({ 
          success: false, 
          message: '送信エラーが発生しました。しばらく待ってから再度お試しください。' 
        })
      } else if (error.errors) {
        // Validation error
        console.error('Validation errors detail:', error.errors)
        const message = 'フォームの入力内容に不備があります。前のステップに戻って確認してください。'
        setSubmitResult({ success: false, message })
      } else {
        // Other errors
        setSubmitResult({ 
          success: false, 
          message: 'エラーが発生しました。もう一度お試しください。' 
        })
      }
      setIsSubmitting(false)
    }
  }

  // Validation patterns
  const jpZip = /^〒?\d{3}-\d{4}$/  // 〒記号はオプション
  const phone = /^\d{10,11}$/  // 10-11桁の数字のみ（ハイフンなし）
  const katakana = /^[ァ-ヶー]+$/
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Validation for each step with detailed error messages
  // Step 1 is removed - no applicant information

  const validateStep2 = () => {
    const errors: Record<string, string> = {}
    
    // 店舗名 (スペース許容のため trim() のみ)
    if (!formData.store?.name?.trim()) {
      errors['store.name'] = '店舗名を入力してください'
    }
    
    // 店舗住所
    if (!formData.store?.address?.postal) {
      errors['store.address.postal'] = '郵便番号を入力してください'
    } else if (!jpZip.test(formData.store.address.postal)) {
      errors['store.address.postal'] = '郵便番号は123-4567または〒123-4567の形式で入力してください'
    }
    
    if (!formData.store?.address?.prefecture) {
      errors['store.address.prefecture'] = '都道府県を選択してください'
    }
    
    if (!formData.store?.address?.city) {
      errors['store.address.city'] = '市区町村を入力してください'
    }
    
    // 番地 (スペース許容のため trim() のみ)
    if (!formData.store?.address?.address1?.trim()) {
      errors['store.address.address1'] = '番地・建物名を入力してください'
    }
    
    // 店舗電話番号
    if (!formData.store?.phone) {
      errors['store.phone'] = '店舗電話番号を入力してください'
    } else if (!phone.test(formData.store.phone)) {
      errors['store.phone'] = '電話番号は10-11桁の数字で入力してください（ハイフン不要）'
    }
    
    // 責任者 (スペース許容のため trim() のみ)
    if (!formData.store?.managerName?.trim()) {
      errors['store.managerName'] = '店舗責任者名を入力してください'
    }
    
    // フリガナ (スペース許容、カタカナとスペースのみ)
    if (!formData.store?.managerKana?.trim()) {
      errors['store.managerKana'] = '店舗責任者フリガナを入力してください'
    } else if (!/^[ァ-ヶー\s]+$/.test(formData.store.managerKana)) {
      errors['store.managerKana'] = 'フリガナはカタカナで入力してください'
    }
    
    // 撮影同席者
    if (!formData.store?.attendees || formData.store.attendees.length === 0) {
      errors['store.attendees'] = '撮影同席者を1名以上選択してください'
    }
    
    // メールアドレス
    if (!formData.store?.email) {
      errors['store.email'] = 'メールアドレスを入力してください'
    } else if (!email.test(formData.store.email)) {
      errors['store.email'] = '正しいメールアドレスを入力してください'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep4 = () => {
    const errors: Record<string, string> = {}
    
    // 希望撮影日時
    if (!formData.wish1?.date) {
      errors['wish1.date'] = '第1希望の日付を入力してください'
    }
    if (!formData.wish1?.time) {
      errors['wish1.time'] = '第1希望の時間を入力してください'
    }
    
    if (!formData.wish2?.date) {
      errors['wish2.date'] = '第2希望の日付を入力してください'
    }
    if (!formData.wish2?.time) {
      errors['wish2.time'] = '第2希望の時間を入力してください'
    }
    
    if (!formData.wish3?.date) {
      errors['wish3.date'] = '第3希望の日付を入力してください'
    }
    if (!formData.wish3?.time) {
      errors['wish3.time'] = '第3希望の時間を入力してください'
    }
    
    // 画像利用媒体
    if (!formData.media?.web && !formData.media?.print && !formData.media?.signage) {
      errors.media = '画像利用媒体を1つ以上選択してください'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep5 = () => {
    const errors: Record<string, string> = {}
    
    // 請求先宛名のバリデーション
    if (!formData.billingName?.trim()) {
      errors['billingName'] = '請求先宛名を入力してください'
    }
    
    if (formData.billingTo === 'separate') {
      if (!formData.billingAddress?.postal) {
        errors['billingAddress.postal'] = '請求先郵便番号を入力してください'
      } else if (!jpZip.test(formData.billingAddress.postal)) {
        errors['billingAddress.postal'] = '郵便番号は123-4567の形式で入力してください'
      }
      
      if (!formData.billingAddress?.prefecture) {
        errors['billingAddress.prefecture'] = '請求先都道府県を選択してください'
      }
      if (!formData.billingAddress?.city) {
        errors['billingAddress.city'] = '請求先市区町村を入力してください'
      }
      if (!formData.billingAddress?.address1) {
        errors['billingAddress.address1'] = '請求先番地を入力してください'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Step navigation
  const nextStep = () => {
    let isValid = true
    
    // Validate current step before proceeding
    if (currentStep === 1) {
      isValid = validateStep2() // Step 1 is now store info
    } else if (currentStep === 3) {
      isValid = validateStep4() // Step 3 is now shooting wishes
    } else if (currentStep === 4) {
      isValid = validateStep5() // Step 4 is now billing
    } else {
      // For steps without validation, clear errors
      setValidationErrors({})
    }
    
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1)
      setValidationErrors({}) // Clear errors when moving to next step
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setValidationErrors({}) // Clear errors when going back
    }
  }

  const steps = [
    { number: 1, title: '店舗情報' },
    { number: 2, title: 'プラン選択' },
    { number: 3, title: '撮影希望' },
    { number: 4, title: '請求先' },
    { number: 5, title: '確認' }
  ]

  return (
    <div className="min-h-screen bg-[rgb(36,35,35)]">
      {/* Header */}
      <div className="bg-[rgb(77,76,76)] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={backHref} className="inline-flex items-center text-gray-300 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </Link>
          <h1 className="text-2xl font-bold text-white">飲食店撮影PhotoStudio 撮影お申し込み</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[rgb(77,76,76)] px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step.number
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-600 text-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  {step.number < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.number ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-2">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">





            {/* Step 1: Store Information */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">撮影店舗情報</h2>
                
                {/* Error Summary */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-red-400 font-semibold">入力内容にエラーがあります。赤く表示された項目を確認してください。</p>
                  </div>
                )}
                
                {/* Store Name */}
                <div>
                  <label className="block text-gray-300 mb-2">店舗名 *</label>
                  <input
                    type="text"
                    value={formData.store?.name || ''}
                    onChange={(e) => updateField('store.name', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                      validationErrors['store.name'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                    }`}
                    placeholder="レストラン〇〇"
                  />
                  {validationErrors['store.name'] && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors['store.name']}</p>
                  )}
                </div>

                {/* Store Address */}
                <div>
                  <label className="block text-gray-300 mb-2">店舗住所 *</label>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={formData.store?.address?.postal || ''}
                        onChange={(e) => updateField('store.address.postal', e.target.value)}
                        className={`w-full md:w-48 px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                          validationErrors['store.address.postal'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                        }`}
                        placeholder="〒123-4567"
                      />
                      {validationErrors['store.address.postal'] && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors['store.address.postal']}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <select
                          value={formData.store?.address?.prefecture || ''}
                          onChange={(e) => updateField('store.address.prefecture', e.target.value)}
                          className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                            validationErrors['store.address.prefecture'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                          }`}
                        >
                          <option value="">都道府県を選択</option>
                          {STORE_PREFECTURES.map(pref => (
                            <option key={pref} value={pref}>{pref}</option>
                          ))}
                        </select>
                        {validationErrors['store.address.prefecture'] && (
                          <p className="text-red-400 text-sm mt-1">{validationErrors['store.address.prefecture']}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.store?.address?.city || ''}
                          onChange={(e) => updateField('store.address.city', e.target.value)}
                          className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                            validationErrors['store.address.city'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                          }`}
                          placeholder="市区町村"
                        />
                        {validationErrors['store.address.city'] && (
                          <p className="text-red-400 text-sm mt-1">{validationErrors['store.address.city']}</p>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.store?.address?.address1 || ''}
                      onChange={(e) => updateField('store.address.address1', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                        validationErrors['store.address.address1'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                      }`}
                      placeholder="番地・建物名"
                    />
                    {validationErrors['store.address.address1'] && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors['store.address.address1']}</p>
                    )}
                  </div>
                </div>

                {/* Store Contact */}
                <div>
                  <label className="block text-gray-300 mb-2">店舗電話番号 *</label>
                  <input
                    type="tel"
                    value={formData.store?.phone || ''}
                    onChange={(e) => updateField('store.phone', e.target.value)}
                    className={`w-full md:w-1/2 px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                      validationErrors['store.phone'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                    }`}
                    placeholder="0312345678 (ハイフンなし)"
                  />
                  {validationErrors['store.phone'] && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors['store.phone']}</p>
                  )}
                </div>

                {/* Store Manager */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">店舗責任者名 *</label>
                    <input
                      type="text"
                      value={formData.store?.managerName || ''}
                      onChange={(e) => updateField('store.managerName', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                        validationErrors['store.managerName'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                      }`}
                      placeholder="鈴木花子"
                    />
                    {validationErrors['store.managerName'] && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors['store.managerName']}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">フリガナ *</label>
                    <input
                      type="text"
                      value={formData.store?.managerKana || ''}
                      onChange={(e) => updateField('store.managerKana', e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                        validationErrors['store.managerKana'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                      }`}
                      placeholder="スズキハナコ"
                    />
                    {validationErrors['store.managerKana'] && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors['store.managerKana']}</p>
                    )}
                  </div>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-gray-300 mb-2">連絡先メールアドレス *</label>
                  <input
                    type="email"
                    value={formData.store?.email || ''}
                    onChange={(e) => updateField('store.email', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                      validationErrors['store.email'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                    }`}
                    placeholder="info@restaurant.com"
                  />
                  {validationErrors['store.email'] && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors['store.email']}</p>
                  )}
                </div>

                {/* Coordinator */}
                <div>
                  <label className="block text-gray-300 mb-2">撮影日調整窓口 *</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="coordinator"
                        value="storeManager"
                        checked={formData.store?.coordinator === 'storeManager'}
                        onChange={(e) => updateField('store.coordinator', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">店舗責任者</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="coordinator"
                        value="other"
                        checked={formData.store?.coordinator === 'other'}
                        onChange={(e) => updateField('store.coordinator', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">その他</span>
                    </label>
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <label className="block text-gray-300 mb-2">撮影同席者 * (複数選択可)</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="storeManager"
                        checked={formData.store?.attendees?.includes('storeManager')}
                        onChange={(e) => {
                          const attendees = formData.store?.attendees || []
                          if (e.target.checked) {
                            updateField('store.attendees', [...attendees, 'storeManager'])
                          } else {
                            updateField('store.attendees', attendees.filter(a => a !== 'storeManager'))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-white">店舗責任者</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="staff"
                        checked={formData.store?.attendees?.includes('staff')}
                        onChange={(e) => {
                          const attendees = formData.store?.attendees || []
                          if (e.target.checked) {
                            updateField('store.attendees', [...attendees, 'staff'])
                          } else {
                            updateField('store.attendees', attendees.filter(a => a !== 'staff'))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-white">店舗スタッフ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="other"
                        checked={formData.store?.attendees?.includes('other')}
                        onChange={(e) => {
                          const attendees = formData.store?.attendees || []
                          if (e.target.checked) {
                            updateField('store.attendees', [...attendees, 'other'])
                          } else {
                            updateField('store.attendees', attendees.filter(a => a !== 'other'))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-white">その他</span>
                    </label>
                  </div>
                </div>
                
                {validationErrors['store.attendees'] && (
                  <p className="text-red-400 text-sm -mt-4">{validationErrors['store.attendees']}</p>
                )}
              </motion.div>
            )}

            {/* Step 2: Plan Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">プラン・オプション選択</h2>
                
                {/* Plan Selection */}
                <div>
                  <label className="block text-gray-300 mb-4">撮影プラン *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.plan === 'light'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => updateField('plan', 'light')}
                    >
                      <h3 className="text-white font-semibold mb-2">ライトプラン</h3>
                      <p className="text-2xl font-bold text-orange-400 mb-2">¥33,000</p>
                      <p className="text-gray-300 text-sm">1時間撮影</p>
                      <p className="text-gray-300 text-sm">3-5カット納品</p>
                    </div>
                    
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.plan === 'standard'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => updateField('plan', 'standard')}
                    >
                      <h3 className="text-white font-semibold mb-2">スタンダードプラン</h3>
                      <p className="text-2xl font-bold text-orange-400 mb-2">¥44,000</p>
                      <p className="text-gray-300 text-sm">2時間撮影</p>
                      <p className="text-gray-300 text-sm">10-15カット納品目安</p>
                    </div>
                    
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.plan === 'premium'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => updateField('plan', 'premium')}
                    >
                      <h3 className="text-white font-semibold mb-2">プレミアムプラン</h3>
                      <p className="text-2xl font-bold text-orange-400 mb-2">¥88,000</p>
                      <p className="text-gray-300 text-sm">4時間撮影</p>
                      <p className="text-gray-300 text-sm">30-40カット納品目安</p>
                    </div>
                  </div>
                </div>

                {/* Extra Time */}
                <div>
                  <label className="block text-gray-300 mb-2">追加撮影時間</label>
                  <select
                    value={formData.extraMinutes || '0'}
                    onChange={(e) => updateField('extraMinutes', e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="0">なし</option>
                    <option value="60">60分 (+¥11,000)</option>
                    <option value="90">90分 (+¥16,500)</option>
                    <option value="120">120分 (+¥22,000)</option>
                  </select>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-gray-300 mb-4">オプション</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.locationScout || false}
                        onChange={(e) => updateField('locationScout', e.target.checked)}
                        className="mr-3"
                      />
                      <div>
                        <span className="text-white">ロケハン (+¥11,000)</span>
                        <p className="text-gray-400 text-sm">事前に店舗を訪問して撮影計画を立案</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.siteImprovement || false}
                        onChange={(e) => updateField('siteImprovement', e.target.checked)}
                        className="mr-3"
                      />
                      <div>
                        <span className="text-white">販促サイトページブラッシュアップ代行 (+¥100,000)</span>
                        <p className="text-gray-400 text-sm">食べログ・ぐるなび・ホットペッパー等の掲載ページを最適化</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">料金内訳</h3>
                  <div className="space-y-2 text-gray-300">
                    {breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.split(':')[0]}:</span>
                        <span>{item.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-600 mt-3 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">合計</span>
                      <span className="text-orange-400">¥{total.toLocaleString()}（税込）</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Shooting Details */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">撮影希望内容</h2>
                
                {/* Error Summary */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-red-400 font-semibold">入力内容にエラーがあります。赤く表示された項目を確認してください。</p>
                  </div>
                )}
                
                {/* Preferred Dates */}
                <div>
                  <label className="block text-gray-300 mb-4">希望撮影日時 * (第1〜第3希望すべて必須)</label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">第1希望 *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            value={formData.wish1?.date || ''}
                            onChange={(e) => updateField('wish1.date', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['wish1.date'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          />
                          {validationErrors['wish1.date'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['wish1.date']}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="time"
                            value={formData.wish1?.time || ''}
                            onChange={(e) => updateField('wish1.time', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['wish1.time'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          />
                          {validationErrors['wish1.time'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['wish1.time']}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">第2希望 *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            value={formData.wish2?.date || ''}
                            onChange={(e) => updateField('wish2.date', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['wish2.date'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          />
                          {validationErrors['wish2.date'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['wish2.date']}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="time"
                            value={formData.wish2?.time || ''}
                            onChange={(e) => updateField('wish2.time', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['wish2.time'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          />
                          {validationErrors['wish2.time'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['wish2.time']}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">第3希望 *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            value={formData.wish3?.date || ''}
                            onChange={(e) => updateField('wish3.date', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['wish3.date'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          />
                          {validationErrors['wish3.date'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['wish3.date']}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="time"
                            value={formData.wish3?.time || ''}
                            onChange={(e) => updateField('wish3.time', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['wish3.time'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          />
                          {validationErrors['wish3.time'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['wish3.time']}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shot Details */}
                <div>
                  <label className="block text-gray-300 mb-4">撮影希望カット数</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">料理</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.cuts?.food || 0}
                        onChange={(e) => updateField('cuts.food', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">内観</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.cuts?.interior || 0}
                        onChange={(e) => updateField('cuts.interior', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">外観</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.cuts?.exterior || 0}
                        onChange={(e) => updateField('cuts.exterior', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">人物</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.cuts?.people || 0}
                        onChange={(e) => updateField('cuts.people', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-400 text-sm mb-2">撮影に関する要望・備考</label>
                    <textarea
                      value={formData.cuts?.note || ''}
                      onChange={(e) => updateField('cuts.note', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                      placeholder="特に撮影してほしいメニューや、撮影のイメージなど"
                    />
                  </div>
                </div>

                {/* Media Usage */}
                <div>
                  <label className="block text-gray-300 mb-4">画像利用媒体 * (複数選択可)</label>
                  {validationErrors.media && (
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-3">
                      <p className="text-red-400 text-sm">{validationErrors.media}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.media?.web || false}
                        onChange={(e) => updateField('media.web', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-white">Web・SNS</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.media?.print || false}
                        onChange={(e) => updateField('media.print', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-white">紙媒体（チラシ・パンフレット等）</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.media?.signage || false}
                        onChange={(e) => updateField('media.signage', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-white">デジタルサイネージ</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Billing */}
            {currentStep === 4 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">請求先情報</h2>
                
                {/* Error Summary */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-red-400 font-semibold">入力内容にエラーがあります。赤く表示された項目を確認してください。</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-300 mb-4">請求先 *</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="billingTo"
                        value="store"
                        checked={formData.billingTo === 'store'}
                        onChange={(e) => updateField('billingTo', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">店舗と同じ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="billingTo"
                        value="separate"
                        checked={formData.billingTo === 'separate'}
                        onChange={(e) => updateField('billingTo', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-white">別途入力</span>
                    </label>
                  </div>
                </div>

                {/* 請求先宛名 */}
                <div>
                  <label className="block text-gray-300 mb-2">請求先宛名 *</label>
                  <input
                    type="text"
                    value={formData.billingName || ''}
                    onChange={(e) => updateField('billingName', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                      validationErrors['billingName'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                    }`}
                    placeholder="株式会社〇〇 御中"
                  />
                  {validationErrors['billingName'] && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors['billingName']}</p>
                  )}
                </div>

                {formData.billingTo === 'separate' && (
                  <div className="border-t border-gray-700 pt-6">
                    <label className="block text-gray-300 mb-4">請求先住所</label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={formData.billingAddress?.postal || ''}
                          onChange={(e) => updateField('billingAddress.postal', e.target.value)}
                          className={`w-full md:w-48 px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                            validationErrors['billingAddress.postal'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                          }`}
                          placeholder="〒123-4567"
                        />
                        {validationErrors['billingAddress.postal'] && (
                          <p className="text-red-400 text-sm mt-1">{validationErrors['billingAddress.postal']}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <select
                            value={formData.billingAddress?.prefecture || ''}
                            onChange={(e) => updateField('billingAddress.prefecture', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['billingAddress.prefecture'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                          >
                            <option value="">都道府県を選択</option>
                          {PREFECTURES.map(pref => (
                            <option key={pref} value={pref}>{pref}</option>
                          ))}
                          </select>
                          {validationErrors['billingAddress.prefecture'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['billingAddress.prefecture']}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            value={formData.billingAddress?.city || ''}
                            onChange={(e) => updateField('billingAddress.city', e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                              validationErrors['billingAddress.city'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                            }`}
                            placeholder="市区町村"
                          />
                          {validationErrors['billingAddress.city'] && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors['billingAddress.city']}</p>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={formData.billingAddress?.address1 || ''}
                        onChange={(e) => updateField('billingAddress.address1', e.target.value)}
                        className={`w-full px-4 py-2 bg-gray-800 border rounded text-white focus:outline-none ${
                          validationErrors['billingAddress.address1'] ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
                        }`}
                        placeholder="番地・建物名"
                      />
                      {validationErrors['billingAddress.address1'] && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors['billingAddress.address1']}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Honeypot field (hidden) */}
                <input
                  type="text"
                  name="website"
                  value={formData.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">入力内容確認</h2>
                
                <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                  {/* Summary sections */}
                  <div>
                    <h3 className="text-orange-400 font-semibold mb-3">店舗情報</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><dt className="text-gray-400">店舗名:</dt><dd className="text-white">{formData.store?.name}</dd></div>
                      <div><dt className="text-gray-400">責任者:</dt><dd className="text-white">{formData.store?.managerName}</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-orange-400 font-semibold mb-3">請求先情報</h3>
                    <dl className="text-sm">
                      <div><dt className="text-gray-400">請求先宛名:</dt><dd className="text-white">{formData.billingName}</dd></div>
                      <div><dt className="text-gray-400">請求先:</dt><dd className="text-white">{formData.billingTo === 'store' ? '店舗と同じ' : '別途入力'}</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-orange-400 font-semibold mb-3">プラン・料金</h3>
                    <dl className="text-sm">
                      <div><dt className="text-gray-400">プラン:</dt><dd className="text-white">{formData.plan === 'light' ? 'ライト' : formData.plan === 'standard' ? 'スタンダード' : 'プレミアム'}</dd></div>
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <dt className="text-gray-400">合計金額:</dt>
                        <dd className="text-2xl font-bold text-orange-400">¥{total.toLocaleString()}（税込）</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Agreement */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.agree || false}
                      onChange={(e) => updateField('agree', e.target.checked)}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <span className="text-white">利用規約に同意する *</span>
                      <p className="text-gray-400 text-sm mt-1">
                        <a href="/terms" target="_blank" className="text-orange-400 hover:text-orange-300 underline">利用規約</a>および
                        <a href="/privacy" target="_blank" className="text-orange-400 hover:text-orange-300 underline">プライバシーポリシー</a>に同意の上、お申し込みください。
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Result */}
                {submitResult && (
                  <div className={`p-4 rounded-lg ${submitResult.success ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
                    <p className={submitResult.success ? 'text-green-400' : 'text-red-400'}>
                      {submitResult.message}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              前へ
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-all"
              >
                次へ
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !formData.agree}
                className={`px-8 py-3 rounded font-medium transition-all flex items-center justify-center min-w-[120px] ${
                  isSubmitting 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
                    : !formData.agree
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    送信中...
                  </>
                ) : '申し込む'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}