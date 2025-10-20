import { z } from "zod";

export const ORDER_TYPES = ["individual", "corporate"] as const;
export const BILL_TO = ["applicant", "store", "separate"] as const;
export const PLANS = ["light", "standard", "premium"] as const;
export const EXTRA_MINUTES = [0, 60, 90, 120] as const; // 30分を削除

export const mediaSchema = z.object({
  web: z.boolean().optional(),
  print: z.boolean().optional(),
  signage: z.boolean().optional(),
}).refine(v => v.web || v.print || v.signage, { message: "少なくとも1つ選択してください" });

export const dateTimeSchema = z.object({
  date: z.string().min(1, "日付は必須です"),
  time: z.string().min(1, "時間は必須です"),
});

// セキュリティ強化のための正規表現
const jpZip = /^〒?\d{3}-\d{4}$/; // 〒記号はオプション、ハイフン必須
const phone = /^\d{10,11}$/; // 10-11桁の数字のみ（ハイフンなし）
const katakana = /^[ァ-ヶー\s]+$/; // カタカナとスペース
const safeText = /^[ぁ-んァ-ヶー一-龯a-zA-Z0-9\s\-_,.\u3000-\u303F]+$/; // 安全な文字のみ

export const addressSchema = z.object({
  postal: z.string().regex(jpZip, "郵便番号は123-4567または〒123-4567の形式で入力してください"),
  prefecture: z.string().min(1, "都道府県は必須です"),
  city: z.string().min(1, "市区郡は必須です"),
  address1: z.string().min(1, "町村番地以下は必須です"),
});

export const formSchema = z.object({
  applicantType: z.enum(ORDER_TYPES).optional(),
  applicantName: z.string().min(1, "申込者名称は必須です").max(100).regex(safeText, "不正な文字が含まれています").optional(),
  applicantKana: z.string().min(1, "フリガナは必須です").max(100).regex(katakana, "カタカナで入力してください").optional(),
  applicantAddress: addressSchema.optional(),
  applicantPhone: z.string().regex(phone, "電話番号は10-11桁の数字で入力してください").optional(),
  applicantEmail: z.string().email("メールアドレスの形式が不正です").max(255).optional(),

  corporate: z.object({
    contactName: z.string().min(1, "担当者名は必須です").max(50).regex(safeText, "不正な文字が含まれています"),
    contactKana: z.string().min(1, "フリガナは必須です").max(50).regex(katakana, "カタカナで入力してください"),
    relation: z.string().min(1, "店舗との関係は必須です").max(100).regex(safeText, "不正な文字が含まれています"),
  }).optional(),

  store: z.object({
    name: z.string().min(1, "店舗名は必須です").max(100),
    address: addressSchema,
    phone: z.string().regex(phone, "電話番号は10-11桁の数字で入力してください"),
    managerName: z.string().min(1, "責任者名は必須です").max(50),
    managerKana: z.string().min(1, "フリガナは必須です").max(50).regex(katakana, "カタカナで入力してください"),
    email: z.string().email("メールアドレスの形式が不正です").max(255),
    coordinator: z.enum(["storeManager", "other"]),
    attendees: z.array(z.enum(["storeManager", "staff", "other"])).min(1, "同席者を1名以上選択してください"),
  }),

  billingTo: z.enum(BILL_TO),
  billingName: z.string().min(1, "請求先宛名は必須です").max(100).regex(safeText, "不正な文字が含まれています"),
  billingAddress: addressSchema.optional(),

  plan: z.enum(PLANS),
  extraMinutes: z.enum(EXTRA_MINUTES.map(String) as [string, ...string[]]),
  locationScout: z.boolean().optional(),
  siteImprovement: z.boolean().optional(), // 新規追加：販促サイトブラッシュアップ

  wish1: dateTimeSchema,
  wish2: dateTimeSchema,
  wish3: dateTimeSchema,

  cuts: z.object({
    food: z.coerce.number().min(0).max(999),
    interior: z.coerce.number().min(0).max(999),
    exterior: z.coerce.number().min(0).max(999),
    people: z.coerce.number().min(0).max(999),
    note: z.string().max(500).optional(),
  }),

  media: mediaSchema,

  agree: z.boolean().refine(v => v === true, { message: "利用規約への同意が必要です" }),

  // honeypot
  website: z.string().max(0).optional(),
})
.superRefine((data, ctx) => {
  if (data.applicantType === "corporate" && !data.corporate) {
    ctx.addIssue({ 
      code: "custom", 
      message: "法人情報は必須です",
      path: ["corporate"]
    });
  }
  if (data.billingTo === "separate" && !data.billingAddress) {
    ctx.addIssue({ 
      code: "custom", 
      message: "請求先住所は必須です",
      path: ["billingAddress"]
    });
  }
});

export type FoodOrder = z.infer<typeof formSchema>;

export function calcTotalJPY(payload: FoodOrder): { total: number; breakdown: string[] } {
  const planPrice: Record<FoodOrder["plan"], number> = {
    light: 33000,
    standard: 44000,
    premium: 88000,
  };
  
  const extraPrice: Record<string, number> = { 
    "0": 0, 
    "60": 11000, 
    "90": 16500, 
    "120": 22000 
  };
  
  const items: string[] = [];
  let total = 0;
  
  // プラン料金
  total += planPrice[payload.plan]; 
  items.push(`プラン: ¥${planPrice[payload.plan].toLocaleString()}`);
  
  // 追加時間
  const extraCost = extraPrice[payload.extraMinutes] || 0;
  if (extraCost > 0) {
    total += extraCost;
    items.push(`追加時間: ¥${extraCost.toLocaleString()}`);
  }
  
  // オプション
  if (payload.locationScout) { 
    total += 11000; 
    items.push("ロケハン: ¥11,000"); 
  }
  if (payload.siteImprovement) { 
    total += 100000; 
    items.push("販促サイトブラッシュアップ: ¥100,000"); 
  }

  return { total, breakdown: items };
}