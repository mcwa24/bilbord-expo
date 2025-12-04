import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqpmbcknztcofausqzfa.supabase.co'
// Use service role key for server-side to bypass RLS, fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcG1iY2tuenRjb2ZhdXNxemZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODEzNDksImV4cCI6MjA3OTI1NzM0OX0.6fOBiostBVt68cnKJXFD8GSBtAR4PUpyBLhk3y4hvu8'

export const supabase = createClient(supabaseUrl, supabaseKey)

