import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "飲食店撮影 | プロカメラマンによる料理・店舗撮影 - PhotoStudio",
  description: "飲食店専門の撮影サービス。料理写真、店舗内観・外観撮影まで対応。東京・横浜・千葉エリア出張無料。",
}

export default function FoodPhotoAMPPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        .cta-button {
          background: #ff6b6b;
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          display: inline-block;
          font-weight: bold;
        }
        .section {
          padding: 60px 20px;
        }
        .section-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 40px;
          color: #333;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #333;
        }
        .feature-card p {
          color: #666;
          line-height: 1.6;
        }
        .pricing {
          background: #f8f9fa;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        .pricing-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .pricing-card.popular {
          border: 3px solid #ff6b6b;
          transform: scale(1.05);
        }
        .price {
          font-size: 2.5rem;
          font-weight: bold;
          color: #ff6b6b;
          margin: 20px 0;
        }
        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }
        .faq {
          border-bottom: 1px solid #e0e0e0;
          padding: 20px 0;
        }
        .faq:last-child {
          border-bottom: none;
        }
        .faq summary {
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .faq p {
          margin-top: 10px;
          color: #666;
        }
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 1.8rem;
          }
          .section-title {
            font-size: 1.5rem;
          }
          .pricing-card.popular {
            transform: none;
          }
        }
      `}} />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>飲食店撮影PhotoStudio</h1>
          <p>プロカメラマンによる飲食店専門の撮影サービス</p>
          <p>料理の美味しさを最大限に引き出す写真で集客力アップ</p>
          <a href="/services/photo/foodphoto/form" className="cta-button" id="cta-amp-apply1">
            無料相談・お見積もり
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">サービスの特徴</h2>
          <div className="features">
            <div className="feature-card">
              <h3>📸 協会認定プロカメラマン</h3>
              <p>日本フードフォトグラファー協会認定のプロカメラマンが、確かな技術力で撮影いたします。</p>
            </div>
            <div className="feature-card">
              <h3>✨ 著作権フリー</h3>
              <p>撮影した写真は全て著作権フリー。SNS、Web、印刷物など自由にご利用いただけます。</p>
            </div>
            <div className="feature-card">
              <h3>🚀 最短1週間納品</h3>
              <p>撮影から納品まで最短1週間。急ぎの案件にも柔軟に対応いたします。</p>
            </div>
            <div className="feature-card">
              <h3>🎯 飲食店専門</h3>
              <p>500店舗以上の撮影実績。飲食店の魅力を最大限に引き出すノウハウがあります。</p>
            </div>
            <div className="feature-card">
              <h3>💰 明朗会計</h3>
              <p>月額費用なし、撮影料金のみ。追加料金なしの分かりやすい料金体系です。</p>
            </div>
            <div className="feature-card">
              <h3>📍 出張撮影</h3>
              <p>東京23区、横浜市、千葉（船橋）は出張費込み。お店まで伺います。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section pricing">
        <div className="container">
          <h2 className="section-title">料金プラン</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>ライトプラン</h3>
              <div className="price">¥33,000</div>
              <p>1時間撮影</p>
              <p>3-5カット納品</p>
              <p>お試し撮影に最適</p>
              <a href="/services/photo/foodphoto/form" className="cta-button" id="cta-amp-apply2">
                申し込む
              </a>
            </div>
            <div className="pricing-card popular">
              <h3>スタンダードプラン</h3>
              <div className="price">¥44,000</div>
              <p>2時間撮影</p>
              <p>10-15カット納品目安</p>
              <p>人気No.1プラン</p>
              <a href="/services/photo/foodphoto/form" className="cta-button" id="cta-amp-apply3">
                申し込む
              </a>
            </div>
            <div className="pricing-card">
              <h3>プレミアムプラン</h3>
              <div className="price">¥88,000</div>
              <p>4時間撮影</p>
              <p>30-40カット納品目安</p>
              <p>充実の撮影内容</p>
              <a href="/services/photo/foodphoto/form" className="cta-button" id="cta-amp-apply4">
                申し込む
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with AMP Images */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">撮影事例</h2>
          <div className="gallery">
            <Image
              src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%201.jpg"
              width={300}
              height={300}
              alt="飲食店撮影事例1"
              style={{ width: '100%', height: 'auto' }}
            />
            <Image
              src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%202.jpg"
              width={300}
              height={300}
              alt="飲食店撮影事例2"
              style={{ width: '100%', height: 'auto' }}
            />
            <Image
              src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%203.jpg"
              width={300}
              height={300}
              alt="飲食店撮影事例3"
              style={{ width: '100%', height: 'auto' }}
            />
            <Image
              src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%204.jpg"
              width={300}
              height={300}
              alt="飲食店撮影事例4"
              style={{ width: '100%', height: 'auto' }}
            />
            <Image
              src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%205.jpg"
              width={300}
              height={300}
              alt="飲食店撮影事例5"
              style={{ width: '100%', height: 'auto' }}
            />
            <Image
              src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%206.jpg"
              width={300}
              height={300}
              alt="飲食店撮影事例6"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section with AMP Accordion */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">よくあるご質問</h2>
          <div className="faq-container">
            <details className="faq">
              <summary>飲食店撮影の料金はいくらですか？</summary>
              <p>ライトプラン33,000円、スタンダードプラン44,000円、プレミアムプラン88,000円の3プランをご用意しています。</p>
            </details>
            <details className="faq">
              <summary>撮影時間はどのくらいかかりますか？</summary>
              <p>プランにより1時間〜4時間の撮影時間を設定しています。料理のボリュームにより最適なプランをご提案します。</p>
            </details>
            <details className="faq">
              <summary>撮影エリアはどこまで対応していますか？</summary>
              <p>東京23区内、横浜市内、千葉（船橋）エリアは基本料金内で出張いたします。</p>
            </details>
            <details className="faq">
              <summary>納品形式と納期を教えてください</summary>
              <p>高解像度のJPEG形式で、撮影日から5営業日以内にクラウドストレージ経由で納品いたします。</p>
            </details>
            <details className="faq">
              <summary>キャンセル料はかかりますか？</summary>
              <p>撮影日2営業日前20%、1営業日前50%、当日100%のキャンセル料が発生します。</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: '#f8f9fa', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">今すぐお問い合わせください</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            プロの撮影で飲食店の魅力を最大限に引き出します
          </p>
          <a href="/services/photo/foodphoto/form" className="cta-button" id="cta-amp-apply5">
            無料相談・お見積もり
          </a>
        </div>
      </section>

    </>
  )
}