import supabase from '../config/supabase.config';

const logger = {
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
  info: (...args) => console.info(...args),
  debug: (...args) => console.debug(...args),
};

const handleSupabaseError = async (operation, entityName) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      logger.error(`Supabase error (${entityName}):`, error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const getUsers = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw new Error(`Failed to fetch users: ${error.message}`);
    return data;
  }, 'users');
};

export const getBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        payment_status,
        total_cost,
        pickup_datetime,
        user:users!bookings_user_id_fkey (id, email),
        service:services!bookings_service_id_fkey (id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) {
      logger.error('Error fetching bookings:', error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
    
    if (!data) {
      logger.warn('No bookings data returned from Supabase');
      return { data: [], count: 0, totalPages: 0 };
    }
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'bookings');
};

export const createBooking = async (bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select();
    if (error) throw new Error(`Failed to create booking: ${error.message}`);
    return data[0];
  }, 'bookings');
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();
    if (error) throw new Error(`Failed to update booking: ${error.message}`);
    return data[0];
  }, 'bookings');
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Failed to delete booking: ${error.message}`);
    return { success: true };
  }, 'bookings');
};

export const deleteUser = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
    return { success: true };
  }, 'users');
};
