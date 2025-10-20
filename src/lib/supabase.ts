import { createClient } from '@supabase/supabase-js'

// Get environment variables
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if the URL is valid (starts with http:// or https://)
const isValidUrl = envUrl.startsWith('http://') || envUrl.startsWith('https://')

// Use placeholder values if env vars are not properly configured
const supabaseUrl = isValidUrl ? envUrl : 'https://placeholder.supabase.co'
const supabaseAnonKey = envKey && envKey !== 'your_supabase_anon_key' ? envKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

// Check if we're using the new API key format
const isNewKeyFormat = supabaseAnonKey.startsWith('sb_publishable_');

// Create a dummy client if environment variables are not set
// This allows the app to run without Supabase (using mock API)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // Add apikey header for new key format
      ...(isNewKeyFormat ? { 'apikey': supabaseAnonKey } : {})
    }
  }
})