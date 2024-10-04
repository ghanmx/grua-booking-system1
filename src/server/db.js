import { createClient } from '@supabase/supabase-js';
import { ROLES } from '../constants/roles';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle Supabase errors with retry logic
const handleSupabaseError = async (operation) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error('Supabase error:', error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(error.message || 'An unexpected error occurred');
      }
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const getUsers = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, created_at');
    if (error) throw error;
    return data;
  });
};

export const getBookings = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, users(username)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  });
};

export const getPaidBookings = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, users(username)')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
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