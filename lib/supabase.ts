import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bdebojujyrgdxypwjzuv.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZWJvanVqeXJnZHh5cHdqenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTgxMTAsImV4cCI6MjEwNTM5NDExMH0.hAFQUug62tu9gihi0LW47MsiQIVQjYmZfD2WDh1Xek0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes("supabase.co"));
}
