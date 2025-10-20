/**
 * 飲食店撮影PhotoStudio - お客様の声データ
 */

export interface Review {
  id: string
  rating: number // 1-5
  author: string
  authorType: string // 業態
  date: string
  content: string
  helpful?: number // 役立ったカウント
  verified: boolean // 確認済みかどうか
}

export const reviews: Review[] = [
  {
    id: 'review-1',
    rating: 5,
    author: 'K.T',
    authorType: 'カフェレストラン',
    date: '2024年11月',
    content: '今回は急な撮影依頼にご対応いただきありがとうございます。またの機会でもご相談させていただく際は何卒よろしくお願いいたします。',
    helpful: 12,
    verified: true,
  },
  {
    id: 'review-2',
    rating: 5,
    author: 'M.S',
    authorType: '創作和食店',
    date: '2024年10月',
    content: '日程調整も迅速に対応いただき、当日も状況を見ながら要望に応えていただき助かりました！また、納品も翌日到着と大変早くスピード感も気に入りました。是非またよろしくお願いいたします。',
    helpful: 18,
    verified: true,
  },
  {
    id: 'review-3',
    rating: 5,
    author: 'A.N',
    authorType: 'イタリアン',
    date: '2024年9月',
    content: '前回、依頼させていただいて大変すばらしかったので再度リピートさせていただきました。ストロボを使った料理写真はすばらしい仕上がりでした。また前回同様に納品も早く非常に助かります。以前から料理専門のカメラマンに依頼してきましたが質と納品の速さはトップクラスです。あと、使用用途をヒアリングした上で撮影カットの提案をしてくれるのでこちらが想定していなかったアイデアをいただけました。',
    helpful: 25,
    verified: true,
  },
  {
    id: 'review-4',
    rating: 5,
    author: 'H.Y',
    authorType: 'ワインビストロ',
    date: '2024年8月',
    content: '今回はホームページ用の写真を撮って頂きました。本当にプロフェッショナルな素晴らしい写真が撮れました。今までのカメラマンさんとは仕上がりが大違いでした。リピート確定です。知り合いにも紹介する予定です。本当にありがとうございました。',
    helpful: 20,
    verified: true,
  },
  {
    id: 'review-5',
    rating: 5,
    author: 'T.M',
    authorType: 'フレンチレストラン',
    date: '2024年7月',
    content: '口コミ内容がとても素晴らしく、飲食店向けである事から、今回フレンチ店を開くのに初めて、ご依頼させて頂きました。時間厳守で、仕事が早く、写真もとても綺麗に撮ってくださったり、段取りも素晴らしく進めてくださるので、安心感が凄かったです。料理や店内とても綺麗に撮って頂きました。',
    helpful: 15,
    verified: true,
  },
  {
    id: 'review-6',
    rating: 5,
    author: 'Y.K',
    authorType: '鉄板焼き店',
    date: '2024年6月',
    content: 'プロの技術力に圧倒されました。料理の湯気や照り、素材の質感まで完璧に表現していただき、SNSの反応が以前の3倍になりました。撮影中のアドバイスも的確で、盛り付けのコツまで教えていただきました。',
    helpful: 22,
    verified: true,
  },
  {
    id: 'review-7',
    rating: 5,
    author: 'S.I',
    authorType: '寿司店',
    date: '2024年5月',
    content: '寿司の撮影は難しいと聞いていましたが、ネタの輝きや握りの美しさを見事に表現していただきました。特に大トロの質感は実物以上に美味しそうで、お客様からの予約が増えました。',
    helpful: 19,
    verified: true,
  },
  {
    id: 'review-8',
    rating: 5,
    author: 'R.T',
    authorType: '中華料理店',
    date: '2024年4月',
    content: '出張撮影なのに機材の準備から片付けまで手際よく、営業の邪魔になりませんでした。麻婆豆腐の湯気や餃子の焼き目など、シズル感あふれる写真に仕上げていただき大満足です。',
    helpful: 16,
    verified: true,
  },
]

// 集計データ
export const reviewStats = {
  totalReviews: reviews.length,
  averageRating: 5.0,
  ratingDistribution: {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  },
}

// レビュー構造化データ生成
export function generateReviewSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: reviewStats.averageRating.toString(),
    bestRating: '5',
    worstRating: '1',
    ratingCount: reviewStats.totalReviews.toString(),
    reviewCount: reviewStats.totalReviews.toString(),
    itemReviewed: {
      '@type': 'Service',
      name: '飲食店撮影PhotoStudio',
      description: '飲食店専門の撮影サービス',
    },
  }
}

export function generateIndividualReviewSchema() {
  return reviews.slice(0, 5).map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: `${review.author}様（${review.authorType}）`,
    },
    datePublished: review.date,
    reviewBody: review.content,
    publisher: {
      '@type': 'Organization',
      name: '飲食店撮影PhotoStudio',
    },
  }))
}