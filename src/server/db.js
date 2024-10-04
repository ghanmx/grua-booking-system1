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
      .from('profiles')
      .select('id, user_id, full_name, email, role');
    if (error) throw error;
    return data;
  });
};

export const createUser = async (userData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userData.userId,
        full_name: userData.fullName,
        email: userData.email,
        role: userData.role || ROLES.USER
      });
    if (error) throw error;
    return data;
  });
};

export const updateUser = async (id, userData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const deleteUser = async (id) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const addSpecificAdmin = async (email) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: ROLES.ADMIN })
      .eq('email', email);
    if (error) throw error;
    return data;
  });
};

export const getServices = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*');
    if (error) throw error;
    return data;
  });
};

export const createService = async (serviceData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services')
      .insert(serviceData);
    if (error) throw error;
    return data;
  });
};

export const createBooking = async (bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services_logs')
      .insert(bookingData);
    if (error) throw error;
    return data;
  });
};

export const getBookings = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services_logs')
      .select('*, profiles(full_name), services(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  });
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services_logs')
      .update(bookingData)
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services_logs')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  });
};

export const setAdminStatus = async (userId, isAdmin) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: isAdmin ? ROLES.ADMIN : ROLES.USER })
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  });
};

export const getPaidBookings = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services_logs')
      .select('*, profiles(full_name), services(service_name)')
      .eq('status', 'paid')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  });
};

// ... keep existing code (other exported functions)
