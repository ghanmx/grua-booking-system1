import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const handleSupabaseError = async (operation, entityName) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`Supabase error (${entityName}):`, error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const getUsers = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw new Error(`Failed to fetch users: ${error.message}`);
    if (!data) throw new Error('No user data returned from Supabase');
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'users');
};

export const getBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select('*, users(username)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw new Error(`Failed to fetch bookings: ${error.message}`);
    if (!data) throw new Error('No booking data returned from Supabase');
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'bookings');
};

export const getServices = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch services: ${error.message}`);
    if (!data) throw new Error('No service data returned from Supabase');
    
    return data;
  }, 'services');
};

export const getPaidBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select('*, users(username)', { count: 'exact' })
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    if (error) throw error;
    return { data, count, totalPages: Math.ceil(count / limit) };
  });
};

export const createUser = async (userData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash // Note: Ensure proper hashing is done before this step
      });
    if (error) throw error;
    return data;
  });
};

export const updateUser = async (id, userData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const deleteUser = async (id) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const createBooking = async (bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData);
    if (error) throw error;
    return data;
  });
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};
