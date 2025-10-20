import { z } from 'zod'

const envSchema = z.object({
  // SendGrid Configuration
  SENDGRID_API_KEY: z.string().min(1, 'SENDGRID_API_KEY is required'),
  CONTACT_EMAIL_TO: z.string().email('CONTACT_EMAIL_TO must be a valid email'),
  SENDGRID_FROM_EMAIL: z.string().email('SENDGRID_FROM_EMAIL must be a valid email'),
  SENDGRID_FROM_NAME: z.string().min(1, 'SENDGRID_FROM_NAME is required'),
  
  // Security
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be at least 32 characters').optional(),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(err => err.path.join('.')).join(', ')
      throw new Error(`Missing or invalid environment variables: ${missing}`)
    }
    throw error
  }
}

// Export validated environment variables
export const env = process.env.NODE_ENV === 'production' ? validateEnv() : process.env as Record<string, string | undefined>