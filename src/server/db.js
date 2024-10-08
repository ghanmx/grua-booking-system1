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


export const getBookings = (page = 1, limit = 50) => executeQuery(async () => {
  const startIndex = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('bookings')
    .select(`
      id, created_at, status, total_cost, payment_status,
      user:users(id, email),
      service:services(id, name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + limit - 1);
  
  if (error) throw error;
  
  return { data, count: count || 0, totalPages: Math.ceil((count || 0) / limit) };
});


export const createBooking = (bookingData) => executeQuery(() => supabase.from('bookings').insert([bookingData]).select());

export const updateBooking = (id, bookingData) => executeQuery(() => supabase.from('bookings').update(bookingData).eq('id', id).select());

export const deleteBooking = (id) => executeQuery(() => supabase.from('bookings').delete().eq('id', id));

export const deleteUser = (id) => executeQuery(() => supabase.from('users').delete().eq('id', id));

export const createAccount = async (email, password, userData) => {
  return handleSupabaseError(async () => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
        },
      },
    });
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

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return { session: data.session, user: userData, profile: profileData };
  });
};

export const logout = () => {
  return handleSupabaseError(() => supabase.auth.signOut());
};

export const getCurrentUser = async () => {
  return handleSupabaseError(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    return { user: userData, profile: profileData };
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

