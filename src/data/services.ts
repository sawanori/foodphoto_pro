export const services = {
  movie: {
    id: 'movie',
    title: 'Movie Production',
    subtitle: '映像制作',
    description: '企業プロモーション、商品紹介、イベント記録まで幅広い映像制作に対応',
    detailedDescription: '企業の魅力を最大限に引き出す映像制作サービス。企画から撮影、編集まで一貫したサポートでお客様のビジョンを実現します。',
    icon: '🎬',
    gradient: 'from-yellow-400 to-orange-500',
    basePrice: 220000,
    currency: '円',
    priceNote: '〜（税別・基本プラン）',
    features: [
      '4K対応撮影',
      'ドローン撮影',
      'クロマキー撮影',
      'モーショングラフィックス',
      'カラーグレーディング',
      'BGM・SE制作'
    ],
    process: [
      {
        step: 1,
        title: '企画設定',
        duration: '約7日',
        description: 'プロジェクトの目標設定、絵コンテ作成、費用算出を行います',
        details: ['プロジェクト目標設定', '絵コンテ作成', '費用算出', '撮影スケジュール調整'],
        icon: '📋'
      },
      {
        step: 2,
        title: '撮影',
        duration: 'アポイント次第',
        description: 'ロケハン、スタジオ・クロマキー撮影、演出指導を実施します',
        details: ['ロケーション撮影', 'スタジオ撮影', 'クロマキー撮影', '演出指導'],
        icon: '🎬'
      },
      {
        step: 3,
        title: '編集',
        duration: '約1ヶ月',
        description: 'カラーグレーディング、BGM・効果音追加、生成AI活用を行います',
        details: ['映像編集', 'カラーグレーディング', 'BGM・効果音追加', '生成AI活用編集', 'モーショングラフィックス'],
        icon: '✂️'
      },
      {
        step: 4,
        title: '納品',
        duration: '約1ヶ月',
        description: 'データ納品、お客様確認・修正対応、1年間データ保管を行います',
        details: ['データ納品', 'お客様確認・修正対応', '各種フォーマット出力', '1年間データ保管'],
        icon: '📦'
      }
    ],
    types: [
      {
        name: '企業VP',
        description: '会社紹介・ブランディング映像',
        examples: ['会社紹介動画', 'サービス紹介', '採用動画']
      },
      {
        name: '商品PR',
        description: '商品・サービスのプロモーション映像',
        examples: ['商品紹介動画', '使用方法説明', 'Before/After']
      },
      {
        name: 'イベント記録',
        description: 'セミナー・イベントの記録映像',
        examples: ['セミナー収録', 'イベントダイジェスト', 'インタビュー']
      }
    ],
    additionalCosts: [
      { item: 'スタジオ代', price: '実費' },
      { item: 'モデル費', price: '実費' },
      { item: '交通費', price: '実費' },
      { item: '追加修正', price: '¥10,000/回' }
    ]
  },
  photo: {
    id: 'photo',
    title: 'Photography',
    subtitle: '写真撮影',
    description: '商品撮影、ポートレート、建築写真など高品質な写真撮影サービス',
    detailedDescription: '商品の魅力を最大限に引き出すプロフェッショナル撮影サービス。EC サイト用商品撮影からイベント撮影まで幅広く対応します。',
    icon: '📸',
    gradient: 'from-blue-400 to-purple-500',
    plans: [
      {
        name: 'イベント写真撮影プラン',
        basePrice: 20000,
        duration: '1時間',
        deliveryTime: '3日',
        description: '結婚式二次会、企業イベント等の撮影（2時間から受付）',
        includes: ['撮影（1時間）', 'データ納品', '基本的な色補正'],
        additionalHour: 20000
      },
      {
        name: '商品撮影プラン',
        basePrice: 40000,
        duration: '2時間',
        deliveryTime: '1週間',
        description: 'EC、料理撮影等の商品撮影',
        includes: ['撮影（2時間）', 'データ納品', '商品レタッチ', '背景処理'],
        additionalHour: 10000
      }
    ],
    process: [
      {
        step: 1,
        title: 'ヒアリング',
        duration: '3日以内',
        description: '撮影内容の詳細確認と打ち合わせ',
        icon: '💬'
      },
      {
        step: 2,
        title: '撮影',
        duration: '3日以内',
        description: '現地・スタジオでの撮影実施、立ち会い必須',
        price: 'プランにより異なる',
        icon: '📸'
      },
      {
        step: 3,
        title: '納品',
        duration: '3日以内',
        description: 'データ便での納品、1ヶ月保管保証',
        price: '料金に含まれる',
        icon: '📦'
      }
    ],
    categories: [
      {
        name: '商品撮影',
        description: 'EC・カタログ用の商品撮影',
        examples: ['白背景撮影', 'ライフスタイル撮影', '360度撮影'],
        icon: '🛍️',
        image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/4-XoQ2KJrHwhwWFyCx1xhUsArWI6BuwB.jpg'
      },
      {
        name: 'イベント撮影',
        description: '企業イベント・セミナーの撮影',
        examples: ['セミナー撮影', '懇親会撮影', '記念撮影'],
        icon: '🎪',
        image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/7-mJKwnJ1MV7rgCTVH2W7YH58O16jhJM.jpg'
      },
      {
        name: 'ポートレート',
        description: '人物撮影・プロフィール写真',
        examples: ['プロフィール撮影', 'チーム撮影', '宣材写真'],
        icon: '👤',
        image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/9-HS8CW5NXVIyjfZI7IBnbIAamIM35If.jpg'
      },
      {
        name: '建築・空間',
        description: 'オフィス・店舗・建築物の撮影',
        examples: ['オフィス撮影', '店舗撮影', '建築写真'],
        icon: '🏢',
        image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/6-lBfVjkw1GyFlaswiLfy0XVr7Y2iBjC.jpg'
      },
      {
        name: '料理撮影',
        description: '飲食店メニュー・料理撮影',
        examples: ['メニュー撮影', 'シズル撮影', '盛り付け撮影'],
        icon: '🍽️',
        image: 'https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/LP_food_%2023.jpg'
      }
    ]
  },
  web: {
    id: 'web',
    title: 'Web Production',
    subtitle: 'Web制作',
    description: '企業サイト、LP、ECサイト等の企画・制作・運営',
    detailedDescription: 'お客様のビジネス目標に合わせた戦略的なWeb制作サービス。デザインから開発、運営まで一貫してサポートします。',
    icon: '💻',
    gradient: 'from-purple-400 to-pink-500',
    services: [
      {
        name: 'コーポレートサイト',
        description: '企業の公式ウェブサイト制作',
        features: ['レスポンシブデザイン', 'CMS構築', 'SEO対策', 'アクセス解析']
      },
      {
        name: 'ランディングページ',
        description: 'コンバージョン重視のLP制作',
        features: ['高いコンバージョン率', 'A/Bテスト対応', 'フォーム最適化', '効果測定']
      },
      {
        name: 'ECサイト',
        description: 'オンラインショップの構築',
        features: ['決済システム', '在庫管理', '顧客管理', 'マーケティング機能']
      },
      {
        name: 'Webアプリケーション',
        description: 'カスタムWebアプリの開発',
        features: ['要件定義', 'システム設計', '開発・テスト', '保守・運用']
      }
    ],
    technologies: [
      {
        category: 'Frontend',
        tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS']
      },
      {
        category: 'Backend',
        tools: ['Node.js(express)', 'Nest.js', 'API開発']
      },
      {
        category: 'CMS',
        tools: ['WordPress', 'Headless CMS', 'microCMS']
      },
      {
        category: 'Infrastructure',
        tools: ['AWS', 'Vercel', 'Netlify']
      }
    ],
    process: [
      {
        step: 1,
        title: '要件定義',
        description: 'ビジネス目標とターゲットユーザーの明確化',
        deliverables: ['要件定義書', 'サイトマップ', 'ワイヤーフレーム']
      },
      {
        step: 2,
        title: 'デザイン',
        description: 'ブランドに合わせたUI/UXデザイン',
        deliverables: ['デザインカンプ', 'デザインシステム', 'プロトタイプ']
      },
      {
        step: 3,
        title: '開発',
        description: 'フロントエンド・バックエンドの実装',
        deliverables: ['開発環境構築', 'コーディング', 'テスト実装']
      },
      {
        step: 4,
        title: '公開・運用',
        description: 'サイト公開と継続的な改善',
        deliverables: ['本番環境構築', 'サイト公開', '運用・保守']
      }
    ]
  }
}

export const serviceOverview = {
  title: 'Our Services',
  subtitle: '企画から完成まで、一貫したクオリティでお客様のビジョンを実現',
  commonProcess: {
    title: '共通制作フロー',
    steps: [
      {
        step: 1,
        title: 'ヒアリング',
        description: 'お客様のご要望を詳しくお聞きします',
        icon: '👂'
      },
      {
        step: 2,
        title: '企画・提案',
        description: '最適なソリューションをご提案します',
        icon: '💡'
      },
      {
        step: 3,
        title: '制作',
        description: 'プロフェッショナルチームが制作を担当',
        icon: '🔨'
      },
      {
        step: 4,
        title: '納品',
        description: '品質チェック後、納品いたします',
        icon: '📦'
      }
    ]
  },
  comparison: {
    title: 'サービス比較',
    headers: ['サービス', '制作期間', '料金目安', '主な用途'],
    rows: [
      ['映像制作', '1-2ヶ月', '22万円〜', '企業PR・商品紹介'],
      ['写真撮影', '1週間', '2万円〜', 'EC・イベント記録'],
      ['Web制作', '1-3ヶ月', '要相談', 'コーポレート・LP']
    ]
  },
  faq: [
    {
      question: '制作期間はどのくらいかかりますか？',
      answer: 'プロジェクトの規模により異なりますが、映像制作は1-2ヶ月、写真撮影は1週間、Web制作は1-3ヶ月が目安です。'
    },
    {
      question: '料金はどのように決まりますか？',
      answer: 'プロジェクトの内容、規模、制作期間により決定いたします。まずはお気軽にご相談ください。'
    },
    {
      question: '修正は何回まで可能ですか？',
      answer: '基本プランでは3回まで修正可能です。それ以上の修正は別途料金が発生する場合があります。'
    },
    {
      question: 'データの納品形式は選べますか？',
      answer: 'はい。用途に応じて最適な形式でデータをご提供いたします。詳細はお打ち合わせ時にご相談ください。'
    }
  ]
}
