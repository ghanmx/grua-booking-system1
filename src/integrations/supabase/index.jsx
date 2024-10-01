import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Simplified Google OAuth provider
supabase.auth.signIn = async ({ provider }) => {
  if (provider === 'google') {
    return await supabase.auth.signInWithOAuth({ provider: 'google' });
  }
};

export default supabase;