export type MockPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  cover_image_url?: string;
  category?: { slug: string; name: string };
  published_at: string;
  updated_at?: string;
  author_name?: string;
};

const POSTS: MockPost[] = [
  {
    id: 1,
    slug: "menu-photo-pricing",
    title: "飲食媒体でCVを上げる料理写真：価格表記と構図の黄金比",
    excerpt: "「1枚目で勝つ」写真の作り方を、価格表記と構図から解説。",
    cover_image_url: "https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2011.jpg",
    category: { slug: "howto", name: "撮影ノウハウ" },
    content_html: `
      <h2>ポイント1：余白と情報量のバランス</h2>
      <p>飲食店の料理写真において、最も重要なのは「第一印象」です。特に食べログやぐるなびなどの媒体では、サムネイル段階でユーザーの興味を引けるかが勝負の分かれ目となります。</p>
      <img src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2023.jpg" alt="料理写真の構図例" />
      <h3>価格表記の黄金ルール</h3>
      <ul>
        <li>価格は写真の右下に配置（日本人の視線の流れに合わせる）</li>
        <li>フォントサイズは画像全体の1/15〜1/20程度</li>
        <li>背景との明度差を50%以上確保する</li>
      </ul>
      <h2>ポイント2：テカリと湯気の演出</h2>
      <p>料理の「シズル感」を演出する上で、適度なテカリと湯気は欠かせません。しかし過度な演出は逆効果。実際の提供状態に近い自然な状態を心がけましょう。</p>
      <blockquote>
        <p>「写真と実物が違う」というクレームを避けるためにも、過度な加工は控えめに。信頼性が売上に直結します。</p>
      </blockquote>
      <h3>撮影時のチェックリスト</h3>
      <ol>
        <li>料理の温度感が伝わるか</li>
        <li>食材の質感が活きているか</li>
        <li>盛り付けのボリューム感は適切か</li>
        <li>背景がうるさくないか</li>
      </ol>
      <p>これらの要素を意識することで、CVR（コンバージョン率）の向上が期待できます。実際に弊社のクライアント様では、写真の改善により予約率が平均23%向上しました。</p>
    `,
    published_at: "2025-09-06T12:00:00.000Z",
    updated_at: "2025-09-06T15:00:00.000Z",
    author_name: "PhotoStudio編集部",
  },
  {
    id: 2,
    slug: "tabelog-top-image",
    title: "食べログ1枚目でクリック率を上げるレンズ選定",
    excerpt: "35mm/50mm/85mmの使い分けと料理距離の指標。",
    cover_image_url: "https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2012.jpg",
    category: { slug: "media", name: "媒体運用" },
    content_html: `
      <h2>レンズ選びが決める第一印象</h2>
      <p>食べログのトップ画像は、お店の「顔」です。適切なレンズ選定により、料理の魅力を最大限に引き出すことができます。</p>
      <h3>レンズ別の特徴と使い分け</h3>
      <h4>35mm - 空間も含めた演出</h4>
      <p>広角寄りの35mmレンズは、料理だけでなく店内の雰囲気も含めて撮影したい場合に最適です。特にカウンター席からの撮影や、コース料理全体を見せたい場合に効果的です。</p>
      <img src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2022.jpg" alt="35mmレンズでの撮影例" />
      <h4>50mm - 自然な遠近感</h4>
      <p>標準レンズと呼ばれる50mmは、人間の視野に最も近い画角です。違和感のない自然な料理写真が撮影でき、初心者にも扱いやすいレンズです。</p>
      <h4>85mm - 料理のディテール重視</h4>
      <p>中望遠の85mmは、料理のディテールを美しく表現できます。背景のボケも綺麗で、高級感のある演出が可能です。</p>
      <h3>撮影距離の黄金比</h3>
      <table>
        <thead>
          <tr>
            <th>レンズ</th>
            <th>推奨距離</th>
            <th>向いている料理</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>35mm</td>
            <td>30-50cm</td>
            <td>定食・コース全体</td>
          </tr>
          <tr>
            <td>50mm</td>
            <td>40-70cm</td>
            <td>単品料理・丼物</td>
          </tr>
          <tr>
            <td>85mm</td>
            <td>60-100cm</td>
            <td>寿司・デザート</td>
          </tr>
        </tbody>
      </table>
      <p>これらの指標を参考に、料理の特性に合わせたレンズ選定を行うことで、食べログでのクリック率向上が期待できます。</p>
    `,
    published_at: "2025-09-05T12:00:00.000Z",
    updated_at: "2025-09-05T14:00:00.000Z",
    author_name: "PhotoStudio編集部",
  },
  {
    id: 3,
    slug: "steam-effect-hot-dishes",
    title: "湯気の演出で温かさを伝える：熱々料理の撮影テクニック",
    excerpt: "自然な湯気の撮り方から人工的な演出まで、プロの技を公開。",
    cover_image_url: "https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%202.jpg",
    category: { slug: "howto", name: "撮影ノウハウ" },
    content_html: `
      <h2>湯気が料理写真に与える効果</h2>
      <p>温かい料理の魅力を最大限に伝えるには、「湯気」の演出が欠かせません。特にラーメン、鍋料理、グラタンなど、熱々であることが美味しさの証となる料理では、湯気の有無が注文率を大きく左右します。</p>
      <h3>自然な湯気を撮影する基本テクニック</h3>
      <p>まずは料理本来の湯気を美しく撮影する方法から解説します。</p>
      <ul>
        <li><strong>黒背景の活用</strong>：湯気を際立たせるには暗い背景が効果的</li>
        <li><strong>サイドライティング</strong>：横からの光で湯気の輪郭を強調</li>
        <li><strong>撮影タイミング</strong>：提供直後の30秒が勝負</li>
        <li><strong>シャッター速度</strong>：1/60秒以上で湯気の流れを止める</li>
      </ul>
      <img src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%201.jpg" alt="湯気の撮影例" />
      <h3>人工的な湯気演出の方法</h3>
      <p>撮影時間が長引く場合、自然な湯気だけでは限界があります。プロが使う演出技法をご紹介します。</p>
      <h4>1. ドライアイス法</h4>
      <p>食品に直接触れない位置に少量のドライアイスを配置。安全性と効果のバランスが良い定番手法です。</p>
      <h4>2. 電子タバコ法</h4>
      <p>ニコチンゼロの電子タバコで細い湯気を演出。繊細なコントロールが可能です。</p>
      <h4>3. 湿らせた綿棒法</h4>
      <p>電子レンジで温めた湿った綿棒を料理の後ろに隠す。最も安全で手軽な方法です。</p>
      <h3>料理別の湯気演出ポイント</h3>
      <table>
        <thead>
          <tr>
            <th>料理ジャンル</th>
            <th>湯気の量</th>
            <th>推奨手法</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ラーメン・うどん</td>
            <td>多め</td>
            <td>自然＋ドライアイス</td>
          </tr>
          <tr>
            <td>コーヒー・紅茶</td>
            <td>少なめ</td>
            <td>湿らせた綿棒</td>
          </tr>
          <tr>
            <td>グラタン・ドリア</td>
            <td>中程度</td>
            <td>自然のみ</td>
          </tr>
          <tr>
            <td>ステーキ</td>
            <td>少なめ</td>
            <td>提供直後の自然</td>
          </tr>
        </tbody>
      </table>
      <blockquote>
        <p>重要：過度な湯気演出は逆効果。料理の温度感と違和感のない範囲で調整することが大切です。</p>
      </blockquote>
      <h3>後処理での湯気強調テクニック</h3>
      <ol>
        <li>明瞭度を部分的に上げて湯気を強調</li>
        <li>コントラストの微調整で立体感を演出</li>
        <li>ハイライトを少し持ち上げて輝きを追加</li>
      </ol>
      <p>これらの技術を組み合わせることで、見る人の食欲を刺激する「温かさが伝わる」料理写真が完成します。実際に、湯気のある写真は注文率が平均18%向上するというデータもあります。</p>
    `,
    published_at: "2025-09-04T12:00:00.000Z",
  },
  {
    id: 4,
    slug: "instagram-reel-food",
    title: "Instagramリールで注目される料理動画の撮り方",
    excerpt: "15秒で食欲をそそる動画構成とトランジション技法。",
    cover_image_url: "https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%203.jpg",
    category: { slug: "howto", name: "撮影ノウハウ" },
    content_html: `
      <h2>リール動画が変える集客力</h2>
      <p>Instagram リールは、飲食店の集客において最も費用対効果の高いツールの一つです。適切に制作された15秒の動画は、静止画の10倍以上のエンゲージメントを生み出します。</p>
      <h3>黄金の構成パターン</h3>
      <ol>
        <li><strong>0-3秒：フック</strong> - 最も美味しそうな瞬間でスタート</li>
        <li><strong>3-10秒：プロセス</strong> - 調理や盛り付けの様子</li>
        <li><strong>10-15秒：完成形</strong> - 360度回転や接写でフィニッシュ</li>
      </ol>
      <img src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%204.jpg" alt="リール構成例" />
      <h3>効果的なトランジション技法</h3>
      <h4>1. マッチカット</h4>
      <p>同じ構図で食材が変化していく演出。視聴者の目を釘付けにします。</p>
      <h4>2. スピードランプ</h4>
      <p>緩急をつけた速度変化で、重要な瞬間を強調します。</p>
      <h4>3. オーバーヘッドスピン</h4>
      <p>真上からの回転ショット。料理全体を美しく見せる定番技法です。</p>
      <h3>撮影のテクニカルポイント</h3>
      <ul>
        <li>フレームレート：60fps以上（スローモーション用）</li>
        <li>解像度：縦型1080×1920（9:16）</li>
        <li>手ブレ補正：ジンバルまたはスタビライザー使用推奨</li>
        <li>照明：自然光＋補助LED（色温度5600K）</li>
      </ul>
      <p>実際の成功事例：渋谷のイタリアンレストランでは、週1回のリール投稿により、3ヶ月で予約数が45%増加しました。</p>
    `,
    published_at: "2025-09-04T12:00:00.000Z",
    updated_at: "2025-09-04T14:00:00.000Z",
    author_name: "PhotoStudio編集部",
  },
  {
    id: 5,
    slug: "google-map-photo-seo",
    title: "Googleマップの写真でMEO対策を強化する方法",
    excerpt: "ローカルSEOに効く写真の撮り方とアップロード戦略。",
    cover_image_url: "https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%205.jpg",
    category: { slug: "media", name: "媒体運用" },
    content_html: `
      <h2>Googleマップ写真がMEOに与える影響</h2>
      <p>Googleマップ上の写真は、単なる視覚情報以上の価値があります。適切な写真戦略により、ローカル検索順位を大幅に向上させることができます。</p>
      <h3>MEOに効果的な写真カテゴリー</h3>
      <ol>
        <li><strong>外観写真</strong>：正面、看板、入り口（各2-3枚）</li>
        <li><strong>内装写真</strong>：カウンター、テーブル席、個室（各3-5枚）</li>
        <li><strong>料理写真</strong>：人気メニュートップ5（各2-3枚）</li>
        <li><strong>スタッフ写真</strong>：笑顔の接客シーン（2-3枚）</li>
      </ol>
      <h3>写真のメタデータ最適化</h3>
      <p>Googleは写真のEXIFデータも解析します。以下の情報を正確に設定しましょう：</p>
      <ul>
        <li>撮影日時：最新の情報であることを示す</li>
        <li>位置情報：店舗の正確な緯度経度</li>
        <li>ファイル名：「店名_料理名_地域名.jpg」形式</li>
      </ul>
      <img src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%206.jpg" alt="Googleマップ写真例" />
      <h3>アップロード戦略</h3>
      <h4>頻度とタイミング</h4>
      <ul>
        <li>週2-3回の定期的なアップロード</li>
        <li>ランチタイム前（11:00-11:30）</li>
        <li>ディナータイム前（17:00-17:30）</li>
      </ul>
      <h4>季節性を活かす</h4>
      <p>季節限定メニューや期間限定の装飾など、タイムリーな写真は特に評価されます。</p>
      <blockquote>
        <p>重要：オーナー確認済みアカウントからの投稿は、一般ユーザーの投稿より3倍の重み付けがされます。</p>
      </blockquote>
      <p>これらの施策により、「地域名＋料理ジャンル」検索で上位3位以内の表示率が平均67%向上した実績があります。</p>
    `,
    published_at: "2025-09-03T12:00:00.000Z",
    updated_at: "2025-09-03T18:00:00.000Z",
    author_name: "PhotoStudio編集部",
  },
  {
    id: 6,
    slug: "seasonal-menu-photography",
    title: "季節メニューを魅力的に撮影する5つのコツ",
    excerpt: "春夏秋冬、季節感を演出する小道具と構図の選び方。",
    cover_image_url: "https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%207.jpg",
    category: { slug: "howto", name: "撮影ノウハウ" },
    content_html: `
      <h2>季節感が売上を左右する</h2>
      <p>日本の飲食店において、季節メニューは売上の30-40%を占める重要な要素です。写真で季節感を適切に表現することで、顧客の購買意欲を大きく刺激できます。</p>
      <h3>春：新緑と花を活かす</h3>
      <ul>
        <li>桜の花びらを散らす（食用花使用）</li>
        <li>淡いピンクや若草色の食器を選ぶ</li>
        <li>自然光を多用し、明るめの露出で撮影</li>
      </ul>
      <h3>夏：涼感と鮮やかさ</h3>
      <ul>
        <li>ガラス食器で透明感を演出</li>
        <li>氷や水滴で涼しさを表現</li>
        <li>青や白を基調とした背景選び</li>
      </ul>
      <img src="https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%208.jpg" alt="夏の料理撮影例" />
      <h3>秋：温かみと豊かさ</h3>
      <ul>
        <li>紅葉や木の実を小道具に</li>
        <li>暖色系の照明で温かみを演出</li>
        <li>土鍋や陶器で季節感を強調</li>
      </ul>
      <h3>冬：湯気と温もり</h3>
      <ul>
        <li>湯気を強調（ドライアイス活用も）</li>
        <li>暖色のライティングで温かさを</li>
        <li>厚手の器で冬らしさを演出</li>
      </ul>
      <h3>実践的な撮影セットアップ</h3>
      <table>
        <thead>
          <tr>
            <th>季節</th>
            <th>色温度</th>
            <th>推奨背景</th>
            <th>小道具例</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>春</td>
            <td>5500K</td>
            <td>白木・パステル</td>
            <td>桜・若葉</td>
          </tr>
          <tr>
            <td>夏</td>
            <td>6500K</td>
            <td>青・ガラス</td>
            <td>氷・貝殻</td>
          </tr>
          <tr>
            <td>秋</td>
            <td>4500K</td>
            <td>木目・暖色布</td>
            <td>紅葉・栗</td>
          </tr>
          <tr>
            <td>冬</td>
            <td>3500K</td>
            <td>黒・深緑</td>
            <td>雪結晶・松</td>
          </tr>
        </tbody>
      </table>
      <p>季節感のある写真は、SNSでのシェア率が通常の2.3倍になるというデータもあります。ぜひ積極的に取り入れてみてください。</p>
    `,
    published_at: "2024-12-10T12:00:00.000Z",
    updated_at: "2024-12-10T15:00:00.000Z",
    author_name: "PhotoStudio編集部",
  }
];

export const getAllPosts = () =>
  POSTS.slice().sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));

export const getLatestPosts = (n: number) => getAllPosts().slice(0, n);

export const getPostBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);