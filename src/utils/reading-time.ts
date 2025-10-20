export function calculateReadingTime(html: string): number {
  // HTMLタグを除去してテキストのみを抽出
  const text = html.replace(/<[^>]*>/g, '');
  // 日本語の文字数をカウント（日本語は1分あたり400文字で計算）
  const japaneseCharCount = (text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/g) || []).length;
  // 英語の単語数をカウント（英語は1分あたり200単語で計算）
  const englishWordCount = (text.match(/[a-zA-Z]+/g) || []).length;
  
  const japaneseReadingTime = japaneseCharCount / 400;
  const englishReadingTime = englishWordCount / 200;
  
  const totalMinutes = Math.ceil(japaneseReadingTime + englishReadingTime);
  return Math.max(totalMinutes, 1); // 最低1分
}