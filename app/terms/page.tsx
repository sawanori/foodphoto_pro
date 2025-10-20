import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 飲食店撮影 PhotoStudio",
  description:
    "飲食店撮影 PhotoStudio（https://foodphoto-pro.com）の公式利用規約。NonTurn合同会社が提供する撮影サービスのご利用条件について記載しています。",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">利用規約</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-900 leading-relaxed mb-6">
              本規約は、飲食店撮影 PhotoStudio（
              <a
                href="https://foodphoto-pro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 underline"
              >
                https://foodphoto-pro.com
              </a>
              、以下「本サイト」）において、NonTurn合同会社（以下「当社」といいます）が提供する撮影サービス（以下「本サービス」）の利用条件を定めるものです。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第1条（用語の定義）</h2>
            <p className="text-gray-900 mb-4">本規約において使用する用語は、以下の意味を有します。</p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">用語</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">意味</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">① 本サイト</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">
                      NonTurn合同会社がインターネット上で運営する「飲食店撮影
                      PhotoStudio」（https://foodphoto-pro.com）
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">② 本サービス</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">プロカメラマンによる飲食店専門出張撮影サービス</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">③ 利用契約</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">
                      本規約の適用を受ける本サービスの提供に関する、当社と利用者間の契約
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">④ 申込者</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">利用契約締結の申込みをする法人または自然人</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑤ 利用者</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">利用契約が成立した法人または自然人</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑥ 利用店舗</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">本サービスを利用する飲食店舗</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑦ 加入申込書</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">申込者が当社に利用契約の申込みを行う際に用いる所定の書面</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑧ WEB加入申込書</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">本サイトを通じて利用契約締結を申し込む際に用いる所定フォーマット</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑨ 申込書</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">加入申込書およびWEB加入申込書の総称</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑩ 発注確認書</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">申込書を受け、当社が申込者に発行する利用契約に関する書面</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">⑪ 本コンテンツ</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">本サービスにて撮影された写真、動画、その他のデータの総称</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第2条（本規約）</h2>
            <p className="text-gray-900 mb-6">
              当社は、本規約に従い本サービスを提供します。利用契約と本規約に矛盾がある場合は、利用契約が優先されます。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第3条（本規約の変更）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>当社は、本規約を任意に変更できるものとします。</li>
              <li>
                規約変更は本サイトにて告知し、利用者は変更後の規約が適用されるものとします。ただし、社会通念上軽微な変更の場合は告知を行わないことがあります。
              </li>
              <li>規約変更により利用者に生じた一切の事象について当社は責任を負いません。</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第4条（委託）</h2>
            <p className="text-gray-900 mb-6">
              当社は、本サービスの一部または全部を第三者に委託できるものとします。利用者はこれを承諾するものとします。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第5条（利用契約締結の申込み）</h2>
            <p className="text-gray-900 mb-6">申込者は、申込書に必要事項を記載のうえ、当社に申込みを行うものとします。</p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第6条（利用契約の成立）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>申込者が申込書を提出し、当社が承諾した時点で利用契約は成立します。</li>
              <li>
                承諾後、当社は発注確認書をもって申込み内容（プラン、撮影日、料金等）を通知します。
              </li>
              <li>
                当社は、以下のいずれかに該当すると判断した場合、利用契約を解除できるものとします。
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li>
                    第三者の権利（財産権、著作権、肖像権、プライバシー権、パブリシティ権等）を侵害し、またはそのおそれがある場合
                  </li>
                  <li>本規約・利用契約に違反するおそれがある場合</li>
                  <li>料金等の支払を怠るおそれがある場合</li>
                  <li>法令違反の目的で使用するおそれがある場合</li>
                  <li>公序良俗に違反する場合</li>
                  <li>本サービスの運営を妨げ、又は信頼を毀損する場合</li>
                  <li>過去に当社との契約に違反又は損害を与えた事実が判明した場合</li>
                </ol>
              </li>
              <li>
                前項により契約解除を受けた利用者は、当該利用契約履行のため当社に生じた一切の費用を当社の請求に従い負担します。
              </li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第7条（変更届出）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>
                利用者は、申込書の内容または当社に届け出た情報に変更・誤りが判明した場合、直ちに当社へ届け出るものとします。
              </li>
              <li>
                当社は、前条解除事由に該当すると判断したとき、届出を受理せず契約を解約する場合があります。
              </li>
              <li>届出遅延により生じた損害について、当社は責任を負いません。</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第8条（利用契約の有効期間）</h2>
            <p className="text-gray-900 mb-6">契約日は申込承諾日とし、撮影日の属する月の翌月末日までを有効期間とします。</p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第9条（納品・検収）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>当社は、撮影日から5営業日以内に本コンテンツを電子的方法で納品します。</li>
              <li>
                利用者は、納品後3営業日以内（確認期間）に内容・瑕疵の有無を確認し、その結果を当社に通知するものとします。確認期間満了までに通知がない場合、当該満了日をもって検収完了とみなします。
              </li>
              <li>
                確認期間内に瑕疵があると認めた場合、合理的かつ明確な事由を添えて通知するものとし、当社は異議がない限り無償で修補します。修補後の納品日は別途協議のうえ決定します。
              </li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第10条（構成物の権利）</h2>
            <p className="text-gray-900 mb-6">
              撮影対象に第三者の権利が含まれる場合（モデル・商品・建築物・音源・フォント等）、必要な利用許諾は利用者の費用と責任において取得するものとします。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第11条（本コンテンツの権利の帰属）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>本コンテンツ（写真・動画等）の著作権は、原則として利用者に帰属します。</li>
              <li>
                利用者は、本コンテンツを自由に使用できます（商業利用・二次利用・SNS投稿等の制限なし）。
              </li>
              <li>
                当社および利用者は、本コンテンツにかかる著作者人格権を互いに行使しないものとします。
              </li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第12条（料金等および支払）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>本サービスの対価は発注確認書に定める額とし、利用者はこれを当社に支払います。</li>
              <li>その他、契約成立後に生じた費用についても当社の請求に従い支払うものとします。</li>
              <li>支払方法・期日は当社が発行する請求書の定めに従うものとします。</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第13条（キャンセル料）</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-900 mb-6">
              <li>撮影日2営業日前：申込プラン額の20%</li>
              <li>撮影日1営業日前：申込プラン額の50%</li>
              <li>撮影当日：申込プラン額の100%</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第14条（延滞金）</h2>
            <p className="text-gray-900 mb-6">
              支払期日から1か月を経過してもなお支払われない場合、未払額に対し年14.5%の割合で算出される延滞金を支払うものとします。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第15条（瑕疵担保責任）</h2>
            <p className="text-gray-900 mb-6">検収完了後に判明した瑕疵について、当社は責任を負いません。</p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第16条（秘密保持）</h2>
            <p className="text-gray-900 mb-6">
              利用者は、本サービス遂行上で知り得た当社の技術・営業その他業務情報（秘密情報）を第三者に開示・漏洩してはなりません。ただし、既に公知の情報等、相当の事由がある場合を除きます。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第17条（公表）</h2>
            <p className="text-gray-900 mb-6">
              当社は、制作事例として本コンテンツの一部および利用者名を、当社または提携先のウェブサイト等に掲載できるものとします。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第18条（当社による解約）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>
                利用者が以下のいずれかに該当した場合、当社は催告なく全部または一部の利用契約を解約できるものとします。
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li>規約・契約違反の是正を催告されてもなお是正しないとき</li>
                  <li>対価の支払を遅滞、又は故なく拒否したとき</li>
                  <li>手形・小切手の不渡りが発生したとき</li>
                  <li>差押・仮処分等の強制執行や滞納処分を受けたとき</li>
                  <li>破産・民事再生等の申立てがなされたとき</li>
                  <li>信用状態に重大な変化が生じたと当社が判断したとき</li>
                  <li>解散又は営業停止状態になったとき</li>
                  <li>連絡不能となったとき</li>
                  <li>利用者の責により制作開始・継続ができない合理的事由があるとき</li>
                  <li>利用店舗の運営が公序良俗に反し又は本サービスに不適切と判断されるとき</li>
                  <li>その他、契約の継続が困難であると当社が判断したとき</li>
                </ol>
              </li>
              <li>解約時点までに生じる一切の金銭債務は直ちに支払うものとします。</li>
              <li>当該解約に起因して生じた損害について、当社は責任を負いません。</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第19条（禁止行為）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>当社または第三者の知的財産権・財産・権利を侵害する行為</li>
              <li>当社または第三者の肖像権・プライバシーを侵害する行為</li>
              <li>不利益または損害を与える行為、名誉毀損・差別・侮辱行為</li>
              <li>公序良俗に違反する行為</li>
              <li>法令・本規約・契約に違反する行為</li>
              <li>不正な目的での利用、運営に支障を与える行為</li>
              <li>第三者に前各号の行為をさせる又は助長する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第20条（本サービスの一時中断）</h2>
            <p className="text-gray-900 mb-6">
              天災地変、戦乱、法令規制、設備メンテナンス・障害、その他当社が必要と判断する事由により、当社は事前の通知なく本サービスの全部または一部を一定期間中断できるものとします。これに伴う返金・減免・損害賠償は行いません。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第21条（本サービスの変更及び廃止）</h2>
            <p className="text-gray-900 mb-6">
              当社は任意に本サービスの内容の全部又は一部を変更し、又は廃止することができます。可能な限り事前に本サイトにて告知します。
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第22条（免責等）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>当社は、利用者の売上・利益・顧客数等の増減、事業運営その他一切の事項について責任を負いません。</li>
              <li>
                当社の故意または過失により本規約に違反し損害が発生した場合、賠償額の上限は当該損害発生日までに支払われた料金等の合計額とします。
              </li>
              <li>当社は、事前の通知なく本サイトの内容・レイアウト・技術仕様を変更・追加できます。</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第23条（損害賠償等）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>利用者が本規約または利用契約に違反し当社に損害を与えた場合、当該損害（弁護士費用等の法的費用を含む）を賠償する義務を負います。</li>
              <li>第三者との紛争が生じた場合、利用者の責任と費用において解決し、当社に損害・迷惑を及ぼさないものとします。</li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第24条（個人情報の取扱い）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>
                当社は、個人情報を適正に取り扱います。利用目的は、サービス提供、利用者管理、連絡、料金請求、問い合わせ対応、メールマガジン配信、当社および第三者サービスの広告・宣伝、キャンペーン・アンケート運営、新サービスの調査・分析等を含みます。
              </li>
              <li>
                決済等に必要な範囲で、カード決済代行事業者・金融機関等に個人情報を提供する場合があります。
              </li>
              <li>
                本条の利用目的の範囲内で、当社は業務の全部または一部を第三者に委託することがあります。
              </li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第25条（反社会的勢力に対する表明保証等）</h2>
            <ol className="list-decimal ml-6 space-y-2 text-gray-900 mb-6">
              <li>
                利用者は、反社会的勢力に該当せず、支配・影響を受けていないこと、役員・従業員・関係者等がその構成員または関係者でないことを表明・保証します。
              </li>
              <li>
                反社会的勢力への該当・関与等が認められた場合、当社は催告なく利用契約を解除できます。利用者は当社の被った損害を賠償し、自らの損害の賠償を当社に求めません。
              </li>
            </ol>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第26条（準拠法、合意管轄裁判所）</h2>
            <p className="text-gray-900 mb-6">本規約は日本法に準拠し、当社と利用者の間で紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>

            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">第27条（協議）</h2>
            <p className="text-gray-900 mb-6">本規約に定めのない事項や解釈に疑義が生じた場合、当社と利用者は信義誠実に基づき協議し、速やかな解決を図ります。</p>

            <hr className="my-8 border-gray-300" />
            <p className="text-gray-900">
              （附則）本規約は <strong className="font-bold">2025年8月22日</strong> から施行します。
              <br />
              事業者名：NonTurn合同会社
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}