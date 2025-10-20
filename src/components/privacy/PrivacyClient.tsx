'use client'

import { motion } from 'framer-motion'

export function PrivacyClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-wider uppercase">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent eng-only">
              PRIVACY POLICY
            </span>
          </h1>
          <p className="text-xl text-gray-300">プライバシーポリシー</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-yellow-400/20 p-8 md:p-12 relative overflow-hidden"
        >
          <div className="prose prose-lg prose-invert max-w-none">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-gray-300 leading-relaxed mb-6">
                NonTurn.LLC（以下「当社」）は、お客様の個人情報保護の重要性を認識し、個人情報の保護に関する法律（個人情報保護法）を遵守し、適切な取り扱いを行うことをお約束いたします。
              </p>
              <p className="text-gray-400 text-sm">制定日：2024年7月1日</p>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">1. 個人情報の定義</h2>
              <p className="text-gray-300 leading-relaxed">
                個人情報とは、個人情報保護法第2条第1項に規定する個人情報、すなわち生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む）をいいます。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">2. 個人情報の収集方法</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                当社は、次の方法により個人情報を収集いたします：
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• お問い合わせフォームからの入力</li>
                <li>• お電話でのお問い合わせ</li>
                <li>• メールでのお問い合わせ</li>
                <li>• 契約書類等の書面</li>
                <li>• その他適法な方法</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">3. 個人情報の利用目的</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                当社は、個人情報を以下の目的で利用いたします：
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• お問い合わせへの回答・対応</li>
                <li>• サービスの提供・契約の履行</li>
                <li>• 請求書の送付等、契約に関する事務処理</li>
                <li>• 当社サービスに関する情報提供</li>
                <li>• アフターサービス・サポートの提供</li>
                <li>• 統計データの作成（個人を特定できない形式）</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">4. 個人情報の第三者提供</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                当社は、以下の場合を除き、あらかじめお客様の同意を得ることなく、個人情報を第三者に提供することはありません：
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• 法令に基づく場合</li>
                <li>• 人の生命、身体または財産の保護のために必要がある場合</li>
                <li>• 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                <li>• 国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">5. 個人情報の管理</h2>
              <p className="text-gray-300 leading-relaxed">
                当社は、個人情報の漏洩、滅失、毀損等を防止するため、必要かつ適切な安全管理措置を講じます。また、個人情報を取り扱う従業者に対し、個人情報の適切な取り扱いに関する指導・監督を行います。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">6. 個人情報の開示・訂正・削除</h2>
              <p className="text-gray-300 leading-relaxed">
                お客様は、当社が保有する個人情報について、開示、訂正、利用停止、削除を求めることができます。これらのご請求については、下記のお問い合わせ先までご連絡ください。なお、本人確認のため、必要な書類の提出をお願いする場合があります。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">7. Cookie（クッキー）について</h2>
              <p className="text-gray-300 leading-relaxed">
                当社のウェブサイトでは、サービス向上のためにCookieを使用する場合があります。Cookieの使用を希望されない場合は、ブラウザの設定によりCookieの受け入れを拒否することができます。ただし、この場合、一部のサービスがご利用いただけない場合があります。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">8. プライバシーポリシーの変更</h2>
              <p className="text-gray-300 leading-relaxed">
                当社は、法令の変更や事業内容の変更等に伴い、本プライバシーポリシーを変更する場合があります。変更後のプライバシーポリシーは、当社ウェブサイトに掲載した時点から効力を生じるものとします。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">9. お問い合わせ先</h2>
              <div className="text-gray-300 leading-relaxed">
                <p className="mb-2">個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。</p>
                <div className="bg-black/30 p-4 rounded border border-yellow-400/20 mt-4">
                  <p className="font-semibold text-yellow-400 mb-2">NonTurn.LLC</p>
                  <p>〒220-0012</p>
                  <p>神奈川県横浜市西区みなとみらい3-7-1</p>
                  <p>オーシャンゲートみなとみらい8F</p>
                  <p className="mt-2">
                    Email: <a href="mailto:info@non-turn.com" className="text-yellow-400 hover:text-yellow-300 transition-colors">info@non-turn.com</a>
                  </p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium"
            whileHover={{ x: -5 }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ホームに戻る
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}