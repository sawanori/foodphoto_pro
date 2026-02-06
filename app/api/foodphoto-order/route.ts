import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { formSchema, calcTotalJPY } from "@/lib/foodOrderSchema";

// SendGrid初期化
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function POST(req: NextRequest) {
  try {
    // リクエストボディをパース
    const body = await req.json();

    // Zodでバリデーション
    const parsed = formSchema.parse(body);

    // 合計金額を計算
    const { total, breakdown } = calcTotalJPY(parsed);

    // メール送信先を環境変数から取得
    const to = process.env.SENDGRID_TO || process.env.SENDGRID_FROM_EMAIL;
    const from = process.env.SENDGRID_FROM || process.env.SENDGRID_FROM_EMAIL;

    // 開発環境でSendGridが未設定または無効な場合は警告のみ表示してスキップ
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isValidApiKey = apiKey && apiKey.startsWith('SG.');
    const skipEmail = isDevelopment && (!to || !from || !apiKey || !isValidApiKey);

    if (skipEmail) {
      console.warn("⚠️ 開発環境: SendGrid未設定のため、メール送信をスキップします");
      console.log("フォーム送信データ:", {
        store: parsed.store.name,
        email: parsed.store.email,
        plan: parsed.plan,
        total: `¥${total.toLocaleString()}`
      });
      // 開発環境では成功レスポンスを返す
      return NextResponse.json({ ok: true, devMode: true });
    }

    if (!to || !from || !apiKey) {
      console.error("SendGrid環境変数が設定されていません");
      return NextResponse.json(
        { ok: false, message: "メール設定エラー" },
        { status: 500 }
      );
    }
    
    // メール件名
    const subject = `【飲食店写真撮影申込】${parsed.store.name}`;
    
    // メール本文を構築
    const text = [
      "━━━━━━━━━━━━━━━━━━━━━━",
      "NonTurn合同会社 撮影お申し込み",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "【撮影店舗情報】",
      `店舗名: ${parsed.store.name}`,
      `住所: 〒${parsed.store.address.postal}`,
      `     ${parsed.store.address.prefecture}${parsed.store.address.city}`,
      `     ${parsed.store.address.address1}`,
      `電話: ${parsed.store.phone}`,
      `責任者: ${parsed.store.managerName} (${parsed.store.managerKana})`,
      `メール: ${parsed.store.email}`,
      `撮影調整担当: ${formatCoordinator(parsed.store.coordinator)}`,
      `撮影同席者: ${parsed.store.attendees.map(formatCoordinator).join(", ")}`,
      "",
      "【請求先】",
      `宛名: ${parsed.billingName || ''}`,
      `種別: ${formatBillingTo(parsed.billingTo)}`,
      ...(parsed.billingTo === "separate" && parsed.billingAddress ? [
        `住所: 〒${parsed.billingAddress.postal}`,
        `     ${parsed.billingAddress.prefecture}${parsed.billingAddress.city}`,
        `     ${parsed.billingAddress.address1}`,
      ] : []),
      "",
      "【プラン・オプション】",
      `プラン: ${formatPlan(parsed.plan)}`,
      `追加時間: ${parsed.extraMinutes}分`,
      `ロケハン: ${parsed.locationScout ? "あり" : "なし"}`,
      `販促サイトブラッシュアップ: ${parsed.siteImprovement ? "あり" : "なし"}`,
      "",
      "【合計金額】",
      `内訳: ${breakdown.join(" / ")}`,
      `合計: ¥${total.toLocaleString()}（税込）`,
      "",
      "【希望撮影日時】",
      `第1希望: ${parsed.wish1.date} ${parsed.wish1.time}`,
      ...(parsed.wish2 ? [`第2希望: ${parsed.wish2.date} ${parsed.wish2.time}`] : []),
      ...(parsed.wish3 ? [`第3希望: ${parsed.wish3.date} ${parsed.wish3.time}`] : []),
      "",
      "【希望撮影内容】",
      `料理: ${parsed.cuts.food}カット`,
      `内観: ${parsed.cuts.interior}カット`,
      `外観: ${parsed.cuts.exterior}カット`,
      `人物: ${parsed.cuts.people}カット`,
      ...(parsed.cuts.note ? [`備考: ${parsed.cuts.note}`] : []),
      "",
      "【画像利用媒体】",
      `Web: ${parsed.media.web ? "○" : "－"}`,
      `紙媒体: ${parsed.media.print ? "○" : "－"}`,
      `デジタルサイネージ: ${parsed.media.signage ? "○" : "－"}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      `送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
      "━━━━━━━━━━━━━━━━━━━━━━",
    ].filter(Boolean).join("\n");
    
    // HTMLメール本文（テキストメールの整形版）
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="background: linear-gradient(to right, #fb923c, #ef4444); color: white; padding: 20px; margin: 0;">
          NonTurn合同会社 撮影お申し込み
        </h2>
        <div style="padding: 20px; background: #f9f9f9;">
          <pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">
${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </pre>
        </div>
      </div>
    `;
    
    // 管理者へのメール送信
    await sgMail.send({
      to,
      from,
      subject,
      text,
      html,
    });
    
    // 申込者への確認メール
    const applicantSubject = `【NonTurn合同会社】撮影依頼を承りました`;
    const applicantText = [
      `${parsed.store.managerName} 様`,
      "",
      "この度はNonTurn合同会社へ撮影依頼をいただき、",
      "誠にありがとうございます。",
      "",
      "下記の内容でお申し込みを承りました。",
      "担当者より、撮影日時の調整のご連絡をさせていただきます。",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "【お申し込み内容】",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "【撮影店舗情報】",
      `店舗名: ${parsed.store.name}`,
      `住所: 〒${parsed.store.address.postal}`,
      `     ${parsed.store.address.prefecture}${parsed.store.address.city}`,
      `     ${parsed.store.address.address1}`,
      `電話: ${parsed.store.phone}`,
      `責任者: ${parsed.store.managerName} (${parsed.store.managerKana})`,
      `メール: ${parsed.store.email}`,
      `撮影調整担当: ${formatCoordinator(parsed.store.coordinator)}`,
      `撮影同席者: ${parsed.store.attendees.map(formatCoordinator).join(", ")}`,
      "",
      "【請求先】",
      `宛名: ${parsed.billingName || ''}`,
      `種別: ${formatBillingTo(parsed.billingTo)}`,
      ...(parsed.billingTo === "separate" && parsed.billingAddress ? [
        `住所: 〒${parsed.billingAddress.postal}`,
        `     ${parsed.billingAddress.prefecture}${parsed.billingAddress.city}`,
        `     ${parsed.billingAddress.address1}`,
      ] : []),
      "",
      "【プラン・オプション】",
      `プラン: ${formatPlan(parsed.plan)}`,
      `追加時間: ${parsed.extraMinutes}分`,
      `ロケハン: ${parsed.locationScout ? "あり" : "なし"}`,
      `販促サイトブラッシュアップ: ${parsed.siteImprovement ? "あり" : "なし"}`,
      "",
      "【合計金額】",
      `内訳: ${breakdown.join(" / ")}`,
      `合計: ¥${total.toLocaleString()}（税込）`,
      "",
      "【希望撮影日時】",
      `第1希望: ${parsed.wish1.date} ${parsed.wish1.time}`,
      ...(parsed.wish2 ? [`第2希望: ${parsed.wish2.date} ${parsed.wish2.time}`] : []),
      ...(parsed.wish3 ? [`第3希望: ${parsed.wish3.date} ${parsed.wish3.time}`] : []),
      "",
      "【希望撮影内容】",
      `料理: ${parsed.cuts.food}カット`,
      `内観: ${parsed.cuts.interior}カット`,
      `外観: ${parsed.cuts.exterior}カット`,
      `人物: ${parsed.cuts.people}カット`,
      ...(parsed.cuts.note ? [`備考: ${parsed.cuts.note}`] : []),
      "",
      "【画像利用媒体】",
      `Web: ${parsed.media.web ? "○" : "－"}`,
      `紙媒体: ${parsed.media.print ? "○" : "－"}`,
      `デジタルサイネージ: ${parsed.media.signage ? "○" : "－"}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "※本メールは自動送信されています。",
      "※ご不明な点がございましたら、下記までお問い合わせください。",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "NonTurn合同会社",
      "URL: https://foodphoto-pro.com",
      "お問い合わせ: https://non-turn.com/contact",
      "━━━━━━━━━━━━━━━━━━━━━━",
    ].filter(Boolean).join("\n");
    
    const applicantHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="background: linear-gradient(to right, #fb923c, #ef4444); color: white; padding: 20px; margin: 0;">
          NonTurn合同会社 - 撮影依頼確認
        </h2>
        <div style="padding: 20px; background: #f9f9f9;">
          <pre style="font-family: 'Hiragino Sans', 'Meiryo', sans-serif; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6;">
${applicantText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </pre>
        </div>
      </div>
    `;
    
    // 申込者へメール送信
    await sgMail.send({
      to: parsed.store.email,
      from,
      subject: applicantSubject,
      text: applicantText,
      html: applicantHtml,
    });
    
    // 成功レスポンス
    return NextResponse.json({ ok: true });
    
  } catch (error: any) {
    console.error("メール送信エラー:", error);
    
    // Zodバリデーションエラー
    if (error.issues) {
      const message = error.issues[0]?.message || "入力内容に誤りがあります";
      return NextResponse.json(
        { ok: false, message },
        { status: 400 }
      );
    }
    
    // その他のエラー
    const message = error?.message || "送信に失敗しました";
    return NextResponse.json(
      { ok: false, message },
      { status: 500 }
    );
  }
}

// ヘルパー関数
function formatCoordinator(value: string): string {
  const map: Record<string, string> = {
    storeManager: "店舗責任者",
    staff: "店舗スタッフ",
    other: "その他",
  };
  return map[value] || value;
}

function formatBillingTo(value: string): string {
  const map: Record<string, string> = {
    store: "店舗と同じ",
    separate: "別途入力",
  };
  return map[value] || value;
}

function formatPlan(value: string): string {
  const map: Record<string, string> = {
    light: "ライトプラン（1時間）",
    standard: "スタンダードプラン（2時間）",
    premium: "プレミアムプラン（4時間）",
  };
  return map[value] || value;
}