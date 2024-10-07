import { createClient } from '@supabase/supabase-js';
import config from './config/config.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

const handleSupabaseError = async (operation) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      console.error('Supabase error:', error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

const executeQuery = async (query) => handleSupabaseError(() => query());

export const getUsers = () => executeQuery(() => supabase.from('users').select('id, email, role').order('email'));

export const updateUser = (id, userData) => executeQuery(() => supabase.from('users').update(userData).eq('id', id).select());

export const getBookings = (page = 1, limit = 10) => executeQuery(async () => {
  const startIndex = (page - 1) * limit;
  const { data, count } = await supabase
    .from('bookings')
    .select(`
      id, created_at, status, total_cost,
      user:users(id, email),
      service:services(id, name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + limit - 1);
  
  return { data, count: count || 0, totalPages: Math.ceil((count || 0) / limit) };
});

export const createBooking = (bookingData) => executeQuery(() => supabase.from('bookings').insert([bookingData]).select());

export const updateBooking = (id, bookingData) => executeQuery(() => supabase.from('bookings').update(bookingData).eq('id', id).select());

export const deleteBooking = (id) => executeQuery(() => supabase.from('bookings').delete().eq('id', id));

export const deleteUser = (id) => executeQuery(() => supabase.from('users').delete().eq('id', id));

export const createAccount = async (email, password, userData) => {
  return handleSupabaseError(async () => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ ...userData, user_id: authData.user.id }])
        .select();

      if (profileError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, email: email, role: 'user' }])
        .select();

      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      return { user: userData[0], profile: profileData[0] };
    }
  });
};

export const login = async (email, password) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return { session: data.session, user: userData };
  });
};

export const setupRealtimeSubscription = (table, onUpdate) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, onUpdate)
    .subscribe();
};

export const subscribeToBookings = setupRealtimeSubscription.bind(null, 'bookings');
export const subscribeToUsers = setupRealtimeSubscription.bind(null, 'users');
export const subscribeToProfiles = setupRealtimeSubscription.bind(null, 'profiles');