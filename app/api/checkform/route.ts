import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { verifyCSRFToken } from "@/lib/csrf";

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // CSRF検証
    const isValidCSRF = await verifyCSRFToken(body._csrf);
    if (!isValidCSRF) {
      return NextResponse.json(
        { ok: false, error: "不正なリクエストです。ページを再読み込みしてお試しください。" },
        { status: 403 }
      );
    }

    // バリデーション
    const { name, email, company, check1, check2 } = body;

    if (!name || !email || !company) {
      return NextResponse.json(
        { ok: false, error: "必須項目を入力してください。" },
        { status: 400 }
      );
    }

    if (!check1 || !check2) {
      return NextResponse.json(
        { ok: false, error: "確認事項にチェックしてください。" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "正しいメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    // メール送信設定
    const to = process.env.SENDGRID_TO || process.env.SENDGRID_FROM_EMAIL;
    const from = process.env.SENDGRID_FROM || process.env.SENDGRID_FROM_EMAIL;

    const isDevelopment = process.env.NODE_ENV === "development";
    const isValidApiKey = apiKey && apiKey.startsWith("SG.");
    const skipEmail = isDevelopment && (!to || !from || !apiKey || !isValidApiKey);

    if (skipEmail) {
      console.warn("⚠️ 開発環境: SendGrid未設定のため、メール送信をスキップします");
      console.log("無料撮影サンプル申し込みデータ:", { name, email, company });
      return NextResponse.json({ ok: true, devMode: true });
    }

    if (!to || !from || !apiKey) {
      console.error("SendGrid環境変数が設定されていません");
      return NextResponse.json(
        { ok: false, error: "メール設定エラー" },
        { status: 500 }
      );
    }

    // 管理者へのメール
    const subject = `【無料撮影サンプル申し込み】${company} - ${name}`;
    const text = [
      "━━━━━━━━━━━━━━━━━━━━━━",
      "無料撮影サンプル申し込み",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `お名前: ${name}`,
      `メールアドレス: ${email}`,
      `会社名: ${company}`,
      "",
      "【確認事項】",
      "✓ データは2枚のみ",
      "✓ 当社NonTurn合同会社の宣材としてデータを利用する可能性がある",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      `送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
      "━━━━━━━━━━━━━━━━━━━━━━",
    ].join("\n");

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="background: linear-gradient(to right, #fb923c, #ef4444); color: white; padding: 20px; margin: 0;">
          無料撮影サンプル申し込み
        </h2>
        <div style="padding: 20px; background: #f9f9f9;">
          <pre style="font-family: 'Hiragino Sans', 'Meiryo', sans-serif; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6;">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </div>
      </div>
    `;

    await sgMail.send({ to, from, subject, text, html });

    // 申込者への確認メール
    const applicantText = [
      `${name} 様`,
      "",
      "この度は無料撮影サンプルにお申し込みいただき、",
      "誠にありがとうございます。",
      "",
      "下記の内容でお申し込みを承りました。",
      "担当者より、撮影日時の調整のご連絡をさせていただきます。",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "【お申し込み内容】",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `お名前: ${name}`,
      `メールアドレス: ${email}`,
      `会社名: ${company}`,
      "",
      "【確認事項】",
      "✓ データは2枚のみ",
      "✓ 当社NonTurn合同会社の宣材としてデータを利用する可能性がある",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "※本メールは自動送信されています。",
      "※ご不明な点がございましたら、下記までお問い合わせください。",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━",
      "飲食店撮影PhotoStudio",
      "NonTurn合同会社",
      "URL: https://foodphoto-pro.com",
      "お問い合わせ: https://non-turn.com/contact",
      "━━━━━━━━━━━━━━━━━━━━━━",
    ].join("\n");

    const applicantHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="background: linear-gradient(to right, #fb923c, #ef4444); color: white; padding: 20px; margin: 0;">
          飲食店撮影PhotoStudio - 無料撮影サンプル確認
        </h2>
        <div style="padding: 20px; background: #f9f9f9;">
          <pre style="font-family: 'Hiragino Sans', 'Meiryo', sans-serif; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6;">${applicantText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </div>
      </div>
    `;

    await sgMail.send({
      to: email,
      from,
      subject: "【飲食店撮影PhotoStudio】無料撮影サンプルのお申し込みを承りました",
      text: applicantText,
      html: applicantHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("checkform送信エラー:", error);
    const message = error instanceof Error ? error.message : "送信に失敗しました";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
