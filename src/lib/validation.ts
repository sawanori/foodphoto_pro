import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, '名前を入力してください')
    .max(100, '名前は100文字以内で入力してください')
    .regex(/^[^<>'"&]*$/, '不正な文字が含まれています'),
  
  company: z.string()
    .max(100, '会社名は100文字以内で入力してください')
    .regex(/^[^<>'"&]*$/, '不正な文字が含まれています')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  
  service: z.enum(['movie', 'photo', 'web', 'other', ''])
    .optional()
    .or(z.literal('')),
  
  budget: z.enum(['under-100k', '100k-300k', '300k-500k', '500k-1m', 'over-1m', 'undecided', ''])
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .min(10, 'メッセージは10文字以上入力してください')
    .max(1000, 'メッセージは1000文字以内で入力してください')
    .regex(/^[^<>]*$/, '不正な文字が含まれています')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}