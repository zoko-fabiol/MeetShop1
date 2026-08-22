import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-meetshop.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-meetshop-jwt-12345';

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    !import.meta.env.VITE_SUPABASE_URL.includes('mock-meetshop')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
