import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Add caching to queries
const cachedQuery = (queryFn) => {
  const cache = new Map();
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = await queryFn(...args);
    cache.set(key, result);
    return result;
  };
};

export const getUsers = cachedQuery(async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone_number, is_admin');
  if (error) throw error;
  return data;
});

export default supabase;