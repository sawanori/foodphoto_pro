'use client'

import { motion } from 'framer-motion'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { companyInfo } from '@/data/company'

const Scene3D = dynamic(() => import('@/components/3d/Scene3D').then(mod => mod.Scene3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
})

const ContactForm = dynamic(() => import('@/components/contact/ContactForm').then(mod => mod.ContactForm), {
  ssr: false
})

export function ContactClient() {
  // FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "東京・横浜エリアでの企業向け動画制作料金はどのくらいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "東京・横浜エリアの企業様向けに、高品質な動画制作を提供しています。基本プランは5万円から、縦型動画制作は4万円からご利用いただけます。お客様のご予算に合わせた最適なプランをご提案いたします。"
        }
      },
      {
        "@type": "Question",
        "name": "縦型動画の制作は対応していますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、TikTokやInstagram、YouTube Shortsなどに最適な縦型動画制作を専門的に行っています。企業のブランディングに効果的な縦型動画を高品質に制作いたします。"
        }
      },
      {
        "@type": "Question",
        "name": "東京と横浜以外の地域でも対応可能ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "東京・横浜を拠点としていますが、全国対応可能です。特に関東圏内の企業様には、追加料金なしで対応いたします。遠方の場合は交通費のみご相談させていただきます。"
        }
      },
      {
        "@type": "Question",
        "name": "企業向け動画制作の制作期間はどのくらいですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "企業向け動画制作は通常1-2ヶ月、縦型動画は1-2週間が目安です。お急ぎの場合は特急プランもご用意しており、迅速な対応が可能です。"
        }
      },
      {
        "@type": "Question",
        "name": "なぜ高品質な動画制作ができるのですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "東京・横浜のみなとみらいを拠点とし、効率的な制作フローを実現しています。企業様のニーズに特化したサービス提供により、コストパフォーマンスの高い動画制作をお届けしています。"
        }
      }
    ]
  }

  return (
    <>
      {/* FAQ Structured Data */}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Scene3D className="absolute inset-0 z-0 opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-wider uppercase"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent eng-only">
                CONTACT
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              プロジェクトについて、お気軽にご相談ください
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-white">
                <span lang="en" className="eng-only">Get In</span> <span className="text-yellow-400 eng-only" lang="en">Touch</span>
              </h2>
              
              <div className="space-y-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-gray-300">{companyInfo.contact.email}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Office</h3>
                    <p className="text-gray-300">{companyInfo.address.postal}</p>
                    <p className="text-gray-300">{companyInfo.address.full}</p>
                    <p className="text-yellow-400 text-sm mt-1">{companyInfo.address.access}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Response Time</h3>
                    <p className="text-gray-300">24時間以内にご返信いたします</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-white font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <motion.a
                    href={`https://www.instagram.com/${companyInfo.contact.socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-bold">I</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="text-yellow-400 eng-only">FAQ</span>
            </h2>
            <p className="text-xl text-gray-300">
              よくあるご質問
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: '東京・横浜エリアでの企業向け動画制作料金はどのくらいですか？',
                answer: '東京・横浜エリアの企業様向けに、高品質な動画制作を提供しています。基本プランは5万円から、縦型動画制作は4万円からご利用いただけます。お客様のご予算に合わせた最適なプランをご提案いたします。'
              },
              {
                question: '縦型動画の制作は対応していますか？',
                answer: 'はい、<span class="eng-only">TikTok</span>や<span class="eng-only">Instagram</span>、<span class="eng-only">YouTube Shorts</span>などに最適な縦型動画制作を専門的に行っています。企業のブランディングに効果的な縦型動画を高品質に制作いたします。'
              },
              {
                question: '東京と横浜以外の地域でも対応可能ですか？',
                answer: '東京・横浜を拠点としていますが、全国対応可能です。特に関東圏内の企業様には、追加料金なしで対応いたします。遠方の場合は交通費のみご相談させていただきます。'
              },
              {
                question: '企業向け動画制作の制作期間はどのくらいですか？',
                answer: '企業向け動画制作は通常1-2ヶ月、縦型動画は1-2週間が目安です。お急ぎの場合は特急プランもご用意しており、迅速な対応が可能です。'
              },
              {
                question: 'なぜ高品質な動画制作ができるのですか？',
                answer: '東京・横浜のみなとみらいを拠点とし、効率的な制作フローを実現しています。企業様のニーズに特化したサービス提供により、コストパフォーマンスの高い動画制作をお届けしています。'
              },
              {
                question: 'お問い合わせから返信までどのくらいかかりますか？',
                answer: '通常24時間以内にご返信いたします。東京・横浜エリアの企業様には、より迅速な対応を心がけております。お急ぎの場合は、メールにその旨をご記載ください。'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-yellow-400/20 rounded-lg p-6 hover:border-yellow-400/40 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Q. {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: `A. ${item.answer}` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
