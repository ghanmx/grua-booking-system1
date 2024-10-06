import { supabase } from '../config/supabase.config';
import { Booking, User, Service } from '../types/booking';

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

export const getUsers = async (): Promise<User[]> => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .order('email');
    
    if (error) throw error;
    return data as User[];
  });
};

export const getBookings = async (page = 1, limit = 10): Promise<{ data: Booking[], count: number, totalPages: number }> => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        status,
        total_cost,
        user:users(id, email),
        service:services(id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw error;
    return { data: data as Booking[], count: count || 0, totalPages: Math.ceil((count || 0) / limit) };
  });
};

export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();
    
    if (error) throw error;
    return data[0] as Booking;
  });
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  });
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  });
};

export const deleteUser = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  });
};

// Implementación de suscripciones en tiempo real
export const subscribeToBookings = (callback) => {
  return supabase
    .from('bookings')
    .on('*', payload => {
      callback(payload);
    })
    .subscribe();
};
