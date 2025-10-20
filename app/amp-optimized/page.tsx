import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "飲食店撮影 | プロカメラマンによる料理・店舗撮影 - PhotoStudio (高速版)",
  description: "飲食店専門の撮影サービス。料理写真、店舗内観・外観撮影まで対応。東京・横浜・千葉エリア出張無料。",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "飲食店撮影PhotoStudio | 高速モバイル版",
    description: "飲食店専門の撮影サービス。モバイルに最適化された高速ページ。",
    type: "website",
  },
  other: {
    "amp-link": "/services/photo/foodphoto/amp",
  },
}

// Minimal CSS for maximum performance
const minimalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 20px;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    margin-bottom: 16px;
  }
  .hero p {
    font-size: clamp(1rem, 3vw, 1.2rem);
    margin-bottom: 24px;
  }
  .btn {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    transition: transform 0.2s;
  }
  .btn:hover {
    transform: translateY(-2px);
  }
  .section {
    padding: 40px 20px;
  }
  .section-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    text-align: center;
    margin-bottom: 32px;
  }
  .grid {
    display: grid;
    gap: 20px;
  }
  @media (min-width: 768px) {
    .grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }
    .grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .card h3 {
    font-size: 1.25rem;
    margin-bottom: 12px;
  }
  .price {
    font-size: 2rem;
    font-weight: bold;
    color: #ff6b6b;
    margin: 16px 0;
  }
  .popular {
    border: 2px solid #ff6b6b;
    position: relative;
  }
  .popular::before {
    content: '人気No.1';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff6b6b;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
  }
  .bg-gray {
    background: #f8f9fa;
  }
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
  .faq {
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 0;
  }
  .faq:last-child {
    border-bottom: none;
  }
  .faq h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  .text-center {
    text-align: center;
  }
  .mt-4 { margin-top: 32px; }
  .mb-4 { margin-bottom: 32px; }
`

export default function FoodPhotoAMPOptimizedPage() {
  const plans = [
    {
      name: 'ライトプラン',
      price: '33,000',
      time: '1時間',
      cuts: '3-5カット',
      popular: false,
    },
    {
      name: 'スタンダードプラン',
      price: '44,000',
      time: '2時間',
      cuts: '10-15カット',
      popular: true,
    },
    {
      name: 'プレミアムプラン',
      price: '88,000',
      time: '4時間',
      cuts: '30-40カット',
      popular: false,
    },
  ]

  const features = [
    { icon: '📸', title: '協会認定プロ', desc: '日本フードフォトグラファー協会認定' },
    { icon: '✨', title: '著作権フリー', desc: 'SNS・Web・印刷物自由利用可' },
    { icon: '🚀', title: '最短1週間', desc: '撮影から納品まで迅速対応' },
    { icon: '🎯', title: '飲食店専門', desc: '500店舗以上の豊富な実績' },
    { icon: '💰', title: '明朗会計', desc: '月額費用なし・追加料金なし' },
    { icon: '📍', title: '出張撮影', desc: '東京・横浜・千葉は出張費込み' },
  ]

  const faqs = [
    {
      q: '料金はいくらですか？',
      a: '33,000円〜88,000円の3プランをご用意しています。',
    },
    {
      q: '撮影時間は？',
      a: 'プランにより1〜4時間の撮影時間です。',
    },
    {
      q: 'エリアは？',
      a: '東京23区、横浜市、千葉（船橋）は出張費込みです。',
    },
    {
      q: '納期は？',
      a: '撮影から5営業日以内に納品いたします。',
    },
  ]

  const sampleImages = [
    'LP_food_%201.jpg',
    'LP_food_%202.jpg',
    'LP_food_%203.jpg',
    'LP_food_%204.jpg',
    'LP_food_%205.jpg',
    'LP_food_%206.jpg',
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: minimalStyles }} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>飲食店撮影PhotoStudio</h1>
          <p>プロカメラマンによる飲食店専門の撮影サービス</p>
          <p>料理の美味しさを最大限に引き出す写真で集客力アップ</p>
          <Link href="/services/photo/foodphoto/form" className="btn" id="cta-ampopt-apply1">
            無料相談・お見積もり
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">サービスの特徴</h2>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <h3>{feature.icon} {feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-gray">
        <div className="container">
          <h2 className="section-title">料金プラン</h2>
          <div className="grid grid-3">
            {plans.map((plan, index) => (
              <div key={index} className={`card text-center ${plan.popular ? 'popular' : ''}`}>
                <h3>{plan.name}</h3>
                <div className="price">¥{plan.price}</div>
                <p>{plan.time}撮影</p>
                <p>{plan.cuts}納品</p>
                <Link href="/services/photo/foodphoto/form" className="btn mt-4" id="cta-ampopt-apply2">
                  申し込む
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">撮影事例</h2>
          <div className="image-grid">
            {sampleImages.map((image, index) => (
              <Image
                key={index}
                src={`https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/${image}`}
                alt={`飲食店撮影事例${index + 1}`}
                width={300}
                height={300}
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-gray">
        <div className="container">
          <h2 className="section-title">よくあるご質問</h2>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="faq">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="container">
          <h2 className="section-title">今すぐお問い合わせください</h2>
          <p className="mb-4">プロの撮影で飲食店の魅力を最大限に引き出します</p>
          <Link href="/services/photo/foodphoto/form" className="btn" id="cta-ampopt-apply3">
            無料相談・お見積もり
          </Link>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "飲食店撮影PhotoStudio",
            "description": "飲食店専門の撮影サービス",
            "provider": {
              "@type": "Organization",
              "name": "NonTurn合同会社"
            },
            "areaServed": ["東京", "横浜", "千葉"],
            "priceRange": "¥33,000-¥88,000"
          })
        }}
      />
    </>
  )
}