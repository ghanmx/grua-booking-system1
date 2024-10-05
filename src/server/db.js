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

export const getUsers = async (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + limit - 1);
  
  if (error) throw new Error(`Failed to fetch users: ${error.message}`);
  if (!data) throw new Error('No user data returned from Supabase');
  
  return { data, count, totalPages: Math.ceil(count / limit) };
};

export const getBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        users (id, email),
        services (id, name, tow_truck_type)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw new Error(`Failed to fetch bookings: ${error.message}`);
    if (!data) throw new Error('No booking data returned from Supabase');
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'bookings');
};

export const getPaidBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        users (id, email),
        services (id, name, tow_truck_type)
      `, { count: 'exact' })
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw new Error(`Failed to fetch paid bookings: ${error.message}`);
    if (!data) throw new Error('No paid booking data returned from Supabase');
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'paid bookings');
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
