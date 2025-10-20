'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
// import { useRouter } from 'next/navigation'  // Commented out - not needed as we use window.location.href

// Form data type
interface CheckFormData {
  name: string
  email: string
  company: string
  check1: boolean
  check2: boolean
}

export default function CheckFormClient() {
  // const router = useRouter()  // Not needed - using window.location.href
  const [formData, setFormData] = useState<CheckFormData>({
    name: '',
    email: '',
    company: '',
    check1: false,
    check2: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    // Get CSRF token
    fetch('/api/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token))
      .catch(console.error)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください / Please enter your name'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください / Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください / Please enter a valid email'
    }
    
    if (!formData.company.trim()) {
      newErrors.company = '会社名を入力してください / Please enter your company name'
    }
    
    if (!formData.check1) {
      newErrors.check1 = '「データは2枚のみ」にチェックしてください / Please check "Only 2 photos"'
    }
    
    if (!formData.check2) {
      newErrors.check2 = '「宣材利用許可」にチェックしてください / Please check "Promotional use permission"'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  const handleEdit = () => {
    setShowConfirmation(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch('/api/checkform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _csrf: csrfToken,
        }),
      })

      const result = await response.json()

      if (result.ok) {
        setSubmitResult({ success: true, message: 'お申し込みを受け付けました。確認メールをお送りしました。 / Application received. Confirmation email sent.' })
        // Redirect to thank you page
        const thankYouUrl = window.location.hostname.includes('foodphoto-pro.com')
          ? '/checkform/thank-you'
          : '/checkform/thank-you'
        window.location.href = thankYouUrl
        return // Don't set isSubmitting to false
      } else {
        setSubmitResult({ success: false, message: result.error || '送信に失敗しました。再度お試しください。 / Failed to send. Please try again.' })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitResult({ success: false, message: 'ネットワークエラーが発生しました。再度お試しください。 / Network error. Please try again.' })
      setIsSubmitting(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-2 text-center text-white">入力内容の確認</h2>
            <p className="text-lg text-center text-gray-400 mb-8">Confirmation</p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">お名前 / Name</label>
                <p className="text-white text-lg">{formData.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">メールアドレス / Email</label>
                <p className="text-white text-lg">{formData.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">会社名 / Company</label>
                <p className="text-white text-lg">{formData.company}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">確認事項 / Confirmation</label>
                <div className="space-y-2">
                  <div className="text-white flex items-start">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <div>
                      <div>データは2枚のみ</div>
                      <div className="text-sm text-gray-400">Only 2 photos will be provided</div>
                    </div>
                  </div>
                  <div className="text-white flex items-start">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <div>
                      <div>当社NonTurn合同会社の宣材としてデータを利用する可能性がある</div>
                      <div className="text-sm text-gray-400">Photos may be used for NonTurn LLC&apos;s promotional materials</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {submitResult && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitResult.success ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <p className="text-white">{submitResult.message}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleEdit}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                修正する / Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    送信中... / Sending...
                  </>
                ) : (
                  '送信する / Submit'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/cameralogo.svg"
                alt="飲食店撮影PhotoStudio"
                width={80}
                height={80}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center text-white">無料撮影サンプル申し込み</h1>
          <p className="text-lg text-center text-gray-400 mb-8">Free Photography Sample Application</p>
          
          <form onSubmit={handleConfirm} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                お名前 / Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="山田 太郎 / Taro Yamada"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                メールアドレス / Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="sample@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-300 mb-2">
                会社名 / Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="株式会社〇〇 / Company Name"
              />
              {errors.company && (
                <p className="mt-2 text-sm text-red-400">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-4">
                確認事項 / Confirmation <span className="text-red-400">*</span>
              </label>
              <div className="space-y-3">
                <div>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="check1"
                      checked={formData.check1}
                      onChange={handleChange}
                      className="mt-1 mr-3 w-5 h-5 text-orange-400 bg-gray-700 border-gray-600 rounded focus:ring-orange-400"
                    />
                    <div className="text-gray-300">
                      <div>データは2枚のみ</div>
                      <div className="text-sm text-gray-400">Only 2 photos will be provided</div>
                    </div>
                  </label>
                  {errors.check1 && (
                    <p className="mt-1 ml-8 text-sm text-red-400">{errors.check1}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="check2"
                      checked={formData.check2}
                      onChange={handleChange}
                      className="mt-1 mr-3 w-5 h-5 text-orange-400 bg-gray-700 border-gray-600 rounded focus:ring-orange-400"
                    />
                    <div className="text-gray-300">
                      <div>当社NonTurn合同会社の宣材としてデータを利用する可能性がある</div>
                      <div className="text-sm text-gray-400">Photos may be used for NonTurn LLC&apos;s promotional materials</div>
                    </div>
                  </label>
                  {errors.check2 && (
                    <p className="mt-1 ml-8 text-sm text-red-400">{errors.check2}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-400 to-red-500 text-white text-lg font-semibold rounded-lg hover:from-red-500 hover:to-pink-500 transition-all"
            >
              確認画面へ / Proceed to Confirmation
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}