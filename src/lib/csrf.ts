import { SignJWT, jwtVerify } from 'jose'
import { v4 as uuidv4 } from 'uuid'

const secret = new TextEncoder().encode(
  process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production'
)

export async function generateCSRFToken(): Promise<string> {
  const token = uuidv4()
  const jwt = await new SignJWT({ token })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
  
  return jwt
}

export async function verifyCSRFToken(token: string | null): Promise<boolean> {
  if (!token) return false
  
  try {
    const { payload } = await jwtVerify(token, secret)
    return !!payload.token
  } catch {
    return false
  }
}