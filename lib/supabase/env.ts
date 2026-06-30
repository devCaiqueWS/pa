// Variáveis de ambiente do Supabase. Enquanto não estiverem configuradas
// (.env.local na máquina / env vars na Vercel), `isSupabaseConfigured` é false
// e o app degrada graciosamente: o site público segue funcionando com o
// catálogo estático e o /admin mostra um aviso de "configure o Supabase".
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
