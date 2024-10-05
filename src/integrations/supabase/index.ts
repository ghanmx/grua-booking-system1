import { createClient } from '@supabase/supabase-js';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export { SupabaseAuthProvider, useSupabaseAuth };