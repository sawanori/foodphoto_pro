'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { contactFormSchema } from '@/lib/validation'
import { z } from 'zod'
import { useCSRFToken } from '@/hooks/useCSRFToken'

interface ContactFormProps {
  onSuccess?: () => void
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    service: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { csrfToken, refreshToken } = useCSRFToken()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })
    setFieldErrors({})
    
    // Client-side validation
    try {
      contactFormSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach(err => {
          const field = err.path[0] as string
          errors[field] = err.message
        })
        setFieldErrors(errors)
        setSubmitStatus({
          type: 'error',
          message: '入力内容をご確認ください'
        })
        setIsSubmitting(false)
        return
      }
    }
    
    // Check CSRF token
    if (!csrfToken) {
      setSubmitStatus({
        type: 'error',
        message: 'セキュリティトークンの取得に失敗しました。ページを更新してください。'
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'お問い合わせありがとうございます。24時間以内にご連絡差し上げます。'
        })
        // フォームをリセット
        setFormData({
          name: '',
          company: '',
          email: '',
          service: '',
          budget: '',
          message: ''
        })
        onSuccess?.()
      } else {
        // If CSRF token is invalid, try to refresh it
        if (response.status === 403 && data.error?.includes('セキュリティトークン')) {
          const newToken = await refreshToken()
          if (newToken) {
            setSubmitStatus({
              type: 'error',
              message: 'セキュリティトークンを更新しました。もう一度送信してください。'
            })
          } else {
            setSubmitStatus({
              type: 'error',
              message: data.error
            })
          }
        } else {
          setSubmitStatus({
            type: 'error',
            message: data.error || 'エラーが発生しました。もう一度お試しください。'
          })
        }
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'ネットワークエラーが発生しました。もう一度お試しください。'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-yellow-400/20 p-8 rounded-lg relative overflow-hidden">
      {/* Form Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-yellow-400 mb-6">お問い合わせフォーム</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-yellow-400 mb-2 uppercase tracking-wider">
              お名前 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-black/50 border ${fieldErrors.name ? 'border-red-400' : 'border-yellow-400/30'} focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 transition-all duration-300 rounded`}
              placeholder="田中太郎"
            />
            {fieldErrors.name && (
              <p className="text-red-400 text-sm mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-yellow-400 mb-2 uppercase tracking-wider">
              会社名
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-black/50 border ${fieldErrors.company ? 'border-red-400' : 'border-yellow-400/30'} focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 transition-all duration-300 rounded`}
              placeholder="株式会社サンプル"
            />
            {fieldErrors.company && (
              <p className="text-red-400 text-sm mt-1">
                {fieldErrors.company}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-yellow-400 mb-2 uppercase tracking-wider">
              メールアドレス <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-black/50 border ${fieldErrors.email ? 'border-red-400' : 'border-yellow-400/30'} focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 transition-all duration-300 rounded`}
              placeholder="sample@example.com"
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-sm mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-yellow-400 mb-2 uppercase tracking-wider">
              ご希望サービス
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/50 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300 rounded"
            >
              <option value="" className="bg-black">選択してください</option>
              <option value="movie" className="bg-black">映像制作</option>
              <option value="photo" className="bg-black">写真撮影</option>
              <option value="web" className="bg-black">Web制作</option>
              <option value="other" className="bg-black">その他</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="budget" className="block text-sm font-medium text-yellow-400 mb-2 uppercase tracking-wider">
            ご予算
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/50 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300 rounded"
          >
            <option value="" className="bg-black">選択してください</option>
            <option value="under-100k" className="bg-black">10万円未満</option>
            <option value="100k-300k" className="bg-black">10万円〜30万円</option>
            <option value="300k-500k" className="bg-black">30万円〜50万円</option>
            <option value="500k-1m" className="bg-black">50万円〜100万円</option>
            <option value="over-1m" className="bg-black">100万円以上</option>
            <option value="undecided" className="bg-black">未定</option>
          </select>
        </div>
        
        <div className="mb-8">
          <label htmlFor="message" className="block text-sm font-medium text-yellow-400 mb-2 uppercase tracking-wider">
            メッセージ <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-black/50 border ${fieldErrors.message ? 'border-red-400' : 'border-yellow-400/30'} focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 transition-all duration-300 resize-none rounded`}
            placeholder="プロジェクトの詳細、ご予算、スケジュールなどをお聞かせください"
          />
          {fieldErrors.message && (
            <p className="text-red-400 text-sm mt-1">
              {fieldErrors.message}
            </p>
          )}
        </div>
        
        {/* Status Messages */}
        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-4 rounded text-center ${
              submitStatus.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                : 'bg-red-500/20 text-red-400 border border-red-400/30'
            }`}
          >
            {submitStatus.message}
          </motion.div>
        )}
        
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-4 font-medium text-lg uppercase tracking-wider transition-all duration-300 relative overflow-hidden group rounded ${
              isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-yellow-500 hover:to-yellow-600'
            }`}
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  送信中...
                </span>
              ) : (
                'メッセージを送信'
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </form>
  )
}