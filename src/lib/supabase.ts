import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = createClient<any>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
